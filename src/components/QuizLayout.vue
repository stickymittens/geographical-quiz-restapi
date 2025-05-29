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

const router = useRouter()
const route = useRoute()
const quizName = route.params.quizName

const shadowBox = ref(null)
const answerBtns = ref(null)
const backgroundImg = ref(null)

const props = defineProps({
  answer1: String,
  answer2: String,
  isCorrect: Boolean,
  option1: String,
  option2: String,
  optionValue1: Object,
  optionValue2: Object,
  chosenOption: Number,
  endGame: String,
})

//BROWSER NAVIGATION
//Handling browser refresh, close, or navigate away
function handleBeforeUnload(event) {
  if (quizStore.isQuizInProgress) {
    event.preventDefault()
    event.returnValue = ''

    localStorage.setItem('decidedToLeave', 'true')
  }
}

onMounted(() => {
  // Check if user decided to leave
  const decidedToLeave = localStorage.getItem('decidedToLeave')
  if (decidedToLeave === 'true') {
    quizStore.resetQuizStore()
    localStorage.removeItem('decidedToLeave')

    // Redirect after resetting quiz
    router.replace(`/${quizName}/choose-quiz-mode`)
    return // optional: prevent further redirect logic this time
  }

  // If there's a saved redirect route in localStorage, navigate to it
  const redirectRoute = localStorage.getItem('redirectRoute')
  if (redirectRoute) {
    localStorage.removeItem('redirectRoute')
    router.replace(redirectRoute)
  }
})

//added handleBack to teh Back to settings btn
function handleBackButton() {
  if (quizStore.isQuizInProgress) {
    const confirmLeave = confirm('You will lose all your progress. Are you sure?')
    if (confirmLeave) {
      quizStore.resetQuizStore()
      router.replace(`/${quizName}/choose-quiz-mode`)
    } else {
      window.history.pushState(history.state, '', window.location.href)
    }
  } else {
    router.replace('/')
  }
}

onMounted(() => {
  if (quizStore.isQuizInProgress) {
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.history.pushState(history.state, '', window.location.href)
    window.addEventListener('popstate', handleBackButton)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('popstate', handleBackButton)
})

//OPEN PAGE ANIMATION
const openPageAnimation = () => {
  const el1 = shadowBox.value

  if (el1) {
    el1.style.transition = 'left 1s ease-out'
    el1.style.left = 'auto'
  }
}

onMounted(() => {
  setTimeout(() => {
    openPageAnimation()
  }, 1)
})

const emit = defineEmits(['answer-selected'])

watch(
  () => [props.isCorrect, quizStore.isQuizInProgress],
  ([isCorrect, isQuizInProgress]) => {
    if (isCorrect === null) return

    if (isQuizInProgress === true) {
      console.log('Answer was:', isCorrect ? 'correct' : 'incorrect')
    }

    answerBtns.value = document.querySelectorAll('.answer-btn')

    const answer1 = answerBtns.value[0]
    const answer2 = answerBtns.value[1]

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

      if (isCorrect === false) {
        quizStore.incorrectsArray.push({
          option1: props.option1,
          option2: props.option2,
          optionValue1: props.optionValue1,
          optionValue2: props.optionValue2,
          chosenOption: props.chosenOption,
        })
      }
    }
  },
)

//INFINITY SCORE BUTTON
const infinityScoreBtn = ref(null)

function saveInfinityScore() {
  quizStore.isQuizInProgress = false
  router.push(`/${quizName}/save-infinity-score`)
}

//END GAME FUNCT
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
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-lost`)
            }, 500)
          }
        } else {
          if (errorsCount >= quizStore.maxErrors) {
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-lost`)
            }, 500)
          }
        }
      } else if (quizStore.infiniteMode === false) {
        if (quizStore.maxErrors === '0') {
          if (errorsCount >= 1) {
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-lost`)
            }, 500)
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-won`)
            }, 500)
          }
        } else if (quizStore.maxErrors > 0) {
          if (errorsCount >= quizStore.maxErrors) {
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-lost`)
            }, 500)
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName}/you-won`)
            }, 500)
          }
        }
      }
    }

    endGame()
  },
)
</script>

<template>
  <div class="wrapper">
    <img
      ref="backgroundImg"
      id="background-image"
      src="https://plus.unsplash.com/premium_vector-1711920037357-029f344f7cfc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D
"
    />

    <div ref="shadowBox" class="shadow-box">
      <div class="text-area">
        <h3 v-if="quizStore.maxErrors !== '0'" class="errors">
          Errors left: {{ quizStore.maxErrors - quizStore.errorsCount }}
        </h3>
        <h3 v-else class="errors">No errors mode</h3>
        <h2 class="question-number">
          Question {{ quizStore.questionIndex }} out of
          {{ quizStore.infiniteMode ? '&#8734;' : quizStore.numberOfQuestions }}
        </h2>
        <h1 class="question">Which country has the bigger population?</h1>
      </div>

      <ul class="answers">
        <button class="answer-btn" @click="emit('answer-selected', 'answer1')">
          {{ answer1 }}
          <!-- {{ optionValue1 }} -->
          <!-- long name for testing -->
          <!-- Saint Helena, Ascension and Tristan da Cunha Guinea-Bissau -->
        </button>
        <button class="answer-btn" @click="emit('answer-selected', 'answer2')">
          {{ answer2 }}
          <!-- {{ optionValue2 }} -->
          <!-- Saint Helena, Ascension and Tristan da Cunha Guinea-Bissau -->
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
    <button @click="handleBackButton" class="go-back">&#8592; Back to settings</button>
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

  overflow: hidden;
}

#background-image {
  transform: scaleX(-1);

  position: absolute;
  left: -35vw;
  border-left: 0.5px solid #f1e2d6;

  height: 100%;
}

.shadow-box {
  position: absolute;
  left: 100vw;
  /* left: auto; */
  bottom: 50vh;

  width: 44vw;
  height: 30vh;

  display: flex;
  flex-direction: column;
  gap: 2vh;

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

  padding: 2rem 2rem 3rem 2rem;

  background-color: #f1e2d6;
  color: #283d3b;
  border-radius: 25px;

  transition: background-color 1s ease-in-out;

  box-sizing: border-box;
}

.question-number,
.errors {
  font-weight: 200;
  font-style: italic;
}

.errors {
  align-self: flex-end;
  color: #eb5d3d;

  /* margin-bottom: 1rem; */
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
  gap: 2vw;
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
  border-color: #fab662;
}

.answer-btn.answer-correct {
  border-color: #55b34bce !important;
}

.answer-btn.answer-incorrect {
  border-color: #f44336ce !important;
}

#infinity-button,
.go-back {
  width: max-content;

  color: black;
  background-color: #f1e2d6;

  border-radius: 50px;
  border: none;

  padding: 0.5rem 1rem;
  margin-top: 0;
  margin-bottom: 0;
  transition:
    padding 0.3s ease,
    margin 0.3s ease;

  cursor: pointer;
}

#infinity-button {
  align-self: center;
  border: 0.5px solid #fab662;
}

.go-back {
  position: absolute;
  bottom: 3vh;
  left: 3vw;
}

#infinity-button:hover,
.go-back:hover {
  background-color: #fab662;
  color: #f1e2d6;

  padding-left: calc(1rem + 1vw);
  padding-right: calc(1rem + 1vw);

  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;

  font-weight: 500;
}

/* RESPONSIVE FONT MANAGEMENT  */
h1 {
  font-size: clamp(1.3rem, 1.5vw + 1.5vh, 3.2rem);
}

.answer-btn {
  font-size: clamp(1.2rem, 1.5vw + 0.5vh, 2.5rem);
}

.errors,
.question-number,
#infinity-button,
.go-back {
  font-size: clamp(0.95rem, 1.2vw + 0.4vh, 2.4rem);
}

@media (max-width: 1023px) {
  .shadow-box {
    width: 90vw;
  }

  .answer-btn {
    width: 44vw;
  }
}

@media (max-width: 767px) {
  .shadow-box {
    gap: 2vh;
  }
}
</style>
