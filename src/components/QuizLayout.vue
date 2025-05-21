<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { defineEmits } from 'vue'
// import { defineExpose } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { watch } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

const quizStore = useQuizStore()

//NAVIGATING BACK
const router = useRouter()
const route = useRoute()

const quizName = route.params.quizName

const backToHomePage = () => {
  router.push(`/${quizName}/choose-quiz-mode`)

  //Resetting quizStore
  quizStore.resetQuizStore()
}

//Handling browser refresh/back buttons
function handleBeforeUnload(event) {
  if (quizStore.isQuizInProgress) {
    event.preventDefault()
    event.returnValue = '' // Required for modern browsers

    quizStore.resetQuizStore()

    localStorage.setItem('redirectRoute', `/${quizName}/choose-quiz-mode`)
  }
}

function handleBackButton() {
  if (quizStore.isQuizInProgress) {
    const confirmLeave = confirm('You will lose all your progress. Are you sure?')
    if (confirmLeave) {
      quizStore.resetQuizStore()
      router.push(`/${quizName}/choose-quiz-mode`)
    } else {
      window.history.pushState(null, '', window.location.href)
    }
  } else {
    router.replace('/')
  }
}

onMounted(() => {
  if (quizStore.isQuizInProgress) {
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handleBackButton)
  }
})

onMounted(() => {
  // If there's a saved redirect route in localStorage, navigate to it
  const redirectRoute = localStorage.getItem('redirectRoute')

  if (redirectRoute) {
    // Clear the saved route after using it
    localStorage.removeItem('redirectRoute')

    // Redirect to the stored route
    setTimeout(() => {
      router.push(redirectRoute)
    }, 500)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('popstate', handleBackButton)
})

//OPEN PAGE ANIMATION
const openPageAnimation = () => {
  const el = shadowBox.value

  if (el) {
    el.style.transition = 'left 0.5s ease-out'
    el.style.left = 'auto'
  }
}

onMounted(() => {
  setTimeout(() => {
    openPageAnimation()
  }, 1)
})

const props = defineProps({
  answer1: String,
  answer2: String,
  isCorrect: Boolean,
  option1: String,
  option2: String,
  chosenOption: Number,
  endGame: String,
})

const emit = defineEmits(['answer-selected'])

const shadowBox = ref(null)

// const incorrectsArray = ref([])

const answerBtns = ref(null)

watch(
  () => [props.isCorrect, quizStore.isQuizInProgress],
  ([isCorrect, isQuizInProgress]) => {
    if (isCorrect === null) return // Only act when there's a valid answer

    console.log('Answer was:', isCorrect ? 'correct' : 'incorrect')

    // console.log(answers)

    answerBtns.value = document.querySelectorAll('.answer-btn')

    const answer1 = answerBtns.value[0]
    const answer2 = answerBtns.value[1]

    console.log(answer1, answer2)

    if (isQuizInProgress === true) {
      if (!shadowBox.value) return

      if (props.chosenOption === 1) {
        if (isCorrect === true) {
          answer1.classList.add('answer-correct')
        } else if (isCorrect === false) {
          answer1.classList.add('answer-incorrect')
        }
      } else if (props.chosenOption === 2) {
        if (isCorrect === true) {
          answer2.classList.add('answer-correct')
        } else if (isCorrect === false) {
          answer2.classList.add('answer-incorrect')
        }
      }

      setTimeout(() => {
        if (shadowBox.value) {
          answer1.classList.remove('answer-correct')
          answer1.classList.remove('answer-incorrect')
          answer2.classList.remove('answer-correct')
          answer2.classList.remove('answer-incorrect')
        }
      }, 500)

      quizStore.errorsCount += isCorrect === false ? 1 : 0

      setTimeout(() => {
        if (shadowBox.value) {
          quizStore.questionIndex++
        }
      }, 500)
    }

    //UPDATES CORRECTLY
    if (isCorrect === false) {
      quizStore.incorrectsArray.push({
        option1: props.option1,
        option2: props.option2,
        chosenOption: props.chosenOption,
      })
    }
    // console.log(quizStore.incorrectsArray)
  },
)

//INFINITY SCORE BUTTON
const infinityScoreBtn = ref(null)

function saveInfinityScore() {
  quizStore.isQuizInProgress = false
  router.push('/save-infinity-score')
}

watch(
  () => [quizStore.errorsCount, quizStore.questionIndex],
  ([errorsCount, questionIndex]) => {
    let current = quizStore.questionIndex - 1

    if (current > quizStore.bestInfinityScore) {
      quizStore.bestInfinityScore = current
    }

    function endGame() {
      if (quizStore.infiniteMode === true) {
        if (quizStore.maxErrors === '0') {
          if (errorsCount >= 1) {
            console.log('inf - you lost')
            quizStore.isQuizInProgress = false
            router.push('/you-lost')
          }
        } else {
          if (errorsCount >= quizStore.maxErrors) {
            console.log('inf - you lost')
            quizStore.isQuizInProgress = false
            router.push('/you-lost')
          }
        }
      } else if (quizStore.infiniteMode === false) {
        if (quizStore.maxErrors === '0') {
          if (errorsCount >= 1) {
            console.log('non - 0 - you lost')
            quizStore.isQuizInProgress = false
            router.push('/you-lost')
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            console.log('non - 0 - you won')
            router.push('/you-won')
          }
        } else if (quizStore.maxErrors > 0) {
          if (errorsCount >= quizStore.maxErrors) {
            console.log('non - >0 - you lost')
            quizStore.isQuizInProgress = false
            router.push('/you-lost')
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            console.log('non - >0 -  you won')
            quizStore.isQuizInProgress = false
            router.push('/you-won')
          }
        }
      }

      //MAX ERRORS === 0 WORKS WELL
    }
    endGame()
  },
)

// onMounted(() => {
//   function endGame() {
//     if (quizStore.maxErrors - quizStore.errorsCount === 0) {
//       console.log('you lost')
//     } else if (
//       quizStore.maxErrors - quizStore.errorsCount !== 0 &&
//       quizStore.numberOfQuestions === props.questionIndex
//     ) {
//       console.log('you won')
//     }
//   }
//   endGame()
// })
</script>

<template>
  <div class="wrapper">
    <img
      ref="backgroundImg"
      id="background-image"
      src="https://plus.unsplash.com/premium_vector-1711920037357-029f344f7cfc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D
"
    />
    <div @click="backToHomePage" class="go-back">
      <span>&#8592; Back to settings</span>
    </div>

    <div ref="shadowBox" class="shadow-box">
      <div class="text-area">
        <h3 class="errors">Erorrs left: {{ quizStore.maxErrors - quizStore.errorsCount }}</h3>
        <h2 class="question-number">
          Question {{ quizStore.questionIndex }} out of
          {{ quizStore.infiniteMode ? '&#8734;' : quizStore.numberOfQuestions }}
        </h2>
        <h1 class="question">Which country has the bigger population?</h1>
        <!-- text-area -->
      </div>

      <ul class="answers">
        <button class="answer-btn" @click="emit('answer-selected', 'answer1')">
          {{ answer1 }}
          <!-- a[0hkbup9i] and islands of suepr long words and some othe rcute islands -->
        </button>
        <button class="answer-btn" @click="emit('answer-selected', 'answer2')">
          {{ answer2 }}
        </button>
      </ul>

      <button
        ref="infinityScoreBtn"
        v-if="quizStore.infiniteMode === true"
        id="infinity-button"
        @click="saveInfinityScore"
      >
        Save current score
      </button>
      <!-- shadow box -->
    </div>

    <!-- page wrapper -->
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;

  height: 100vh;
  width: 100vw;
  background-color: #749cd4;

  display: flex;
  justify-content: center;
  align-items: center;
}

#background-image {
  /* transform: scaleX(-1); */

  position: absolute;
  left: -45vw;
  border-right: 0.5px solid #f1e2d6;

  height: 100%;
}

.go-back {
  position: absolute;
  bottom: 3vh;
  left: 3vw;

  color: black;

  width: max-content;
  background-color: #f1e2d6;
  /* border: 1px solid #772e25; */
  border-radius: 50px;

  padding: 0.5rem 1rem;
  cursor: pointer;
}

.go-back span {
  width: 10vw;
}

.shadow-box {
  position: absolute;
  left: 100vw;
  bottom: 50vh;

  width: 50vw;
  height: 30vh;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* background-color: aquamarine; */

  background-color: none;
}

.text-area {
  position: relative;

  background-color: #f1e2d6;
  background-image: none;

  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 1vh;

  padding: 1rem 2rem 2rem 2rem;

  background-color: #f1e2d6;
  color: #283d3b;
  border-radius: 25px;

  transition: background-color 1s ease-in-out;

  box-sizing: border-box;
}

.errors {
  align-self: flex-end;
  color: #eb5d3d;

  margin-bottom: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;

  display: flex;
  justify-content: space-evenly;

  width: 100%;
}

.answers {
  /* background-color: yellow; */
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5vw;
}

.answer-btn {
  flex-shrink: 0;

  height: 8rem;
  width: 25vw;

  border-radius: 25px;
  padding: 0.5rem 1rem;

  background-color: #f1e2d6;

  cursor: pointer;

  border: 3px solid transparent;
}

.answer-btn:hover:not(.correct):not(.incorrect) {
  border-color: #fab662; /* Yellow on hover if not correct/incorrect */
}

/* Correct answer state */
.answer-btn.answer-correct {
  border-color: #55b34bce !important;
}

/* Incorrect answer state */
.answer-btn.answer-incorrect {
  border-color: #f44336ce !important;
}

#infinity-button {
  align-self: center;
  width: max-content;
  cursor: pointer;

  border-radius: 50px;
  border: none;

  padding: 0.5rem 1rem;

  background-color: #f1e2d6;

  font-weight: 500;
}

#infinity-button:hover {
  background-color: #fab662;
  color: #f1e2d6;
}

/* RESPONSIVE FONT MANAGEMENT */
h1 {
  font-size: clamp(1.125rem, 1vw + 1vh, 1.75rem);
}

.question-number {
  font-size: clamp(0.5rem, 1vw + 1vh, 1rem);
}

.errors {
  font-size: clamp(0.5rem, 1vw + 1vh, 1rem);
}

.answer-btn {
  font-size: clamp(1.125rem, 1vw + 1vh, 1.75rem);
}

#infinity-button {
  font-size: clamp(0.5rem, 1vw + 1vh, 1rem);
}
</style>
