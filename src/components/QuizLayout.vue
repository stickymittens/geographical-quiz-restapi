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
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('popstate', handleBackButton)
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

// watch(
//   () => props.isCorrect,
//   (isCorrect) => {
//     quizStore.questionIndex++
//     console.log('Answer was:', isCorrect ? 'correct' : 'incorrect')
//     // call your style logic here too if needed
//     if (!shadowBox.value) return

//     if (isCorrect === true) {
//       // shadowBox.value.style.shadowBox = '0 0 10px 10px rgba(0, 250, 0, 0.4)'
//       shadowBox.value.style.backgroundColor = 'green'
//       setTimeout(() => {
//         // shadowBox.value.style.shadowBox = 'none'
//         shadowBox.value.style.backgroundColor = '#edddd4'
//       }, 500)
//     } else if (isCorrect === false) {
//       // shadowBox.value.style.shadowBox = '0 0 10px 10px rgba(250, 0, 0, 0.4)'
//       shadowBox.value.style.backgroundColor = 'red'
//       errorsCount.value++
//       setTimeout(() => {
//         // shadowBox.value.style.shadowBox = 'none'
//         shadowBox.value.style.backgroundColor = '#edddd4'
//       }, 500)
//     }
//   },
// )

watch(
  () => [props.isCorrect, quizStore.isQuizInProgress],
  ([isCorrect, isQuizInProgress]) => {
    if (isCorrect === null) return // Only act when there's a valid answer

    console.log('Answer was:', isCorrect ? 'correct' : 'incorrect')

    if (isQuizInProgress === true) {
      if (!shadowBox.value) return

      shadowBox.value.style.backgroundColor = isCorrect ? 'green' : 'red'
      setTimeout(() => {
        if (shadowBox.value) {
          shadowBox.value.style.backgroundColor = '#edddd4'
        }
      }, 500)

      quizStore.errorsCount += isCorrect === false ? 1 : 0

      setTimeout(() => {
        if (shadowBox.value) {
          quizStore.questionIndex++
        }
      }, 1000)
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
    <div @click="backToHomePage" class="go-back"><span>&#8592; Back</span></div>
    <div ref="shadowBox" class="text-area">
      <h3 class="errors">Erorrs letf: {{ quizStore.maxErrors - quizStore.errorsCount }}</h3>
      <h2 class="question-number">
        Question {{ quizStore.questionIndex }} out of
        {{ quizStore.infiniteMode ? '&#8734;' : quizStore.numberOfQuestions }}
      </h2>
      <h1 class="question">Which country has the bigger population?</h1>

      <ul class="answers">
        <button @click="emit('answer-selected', 'answer1')">{{ answer1 }}</button>
        <button @click="emit('answer-selected', 'answer2')">{{ answer2 }}</button>
      </ul>

      <button
        ref="infinityScoreBtn"
        v-if="quizStore.infiniteMode === true"
        id="infinity-button"
        @click="saveInfinityScore"
      >
        Save current score
      </button>
      <!-- <p @click="nextQuestion" id="next">Next &#8594;</p> -->
    </div>
  </div>
</template>

<style scoped>
.go-back {
  position: absolute;
  top: 3vh;
  left: 4vw;

  color: black;

  width: max-content;
  background-color: #edddd4;
  border: 1px solid #772e25;
  border-radius: 55px;

  padding: 0.5rem 1rem;
}

.go-back span {
  width: 10vw;
}

.text-area {
  position: relative;
  max-width: 80vw;

  flex-grow: 1;
  background-color: #edddd4;
  background-image: none;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;

  padding: 4vh 4vw 4vh 4vw;

  background-color: #edddd4;
  color: #283d3b;
  border: 1px solid #772e25;
  border-radius: 15px;

  transition: background-color 1s ease-in-out;
}

h3 {
  align-self: flex-end;
  margin-bottom: 3vh;

  color: #772e25;
  font-weight: 500;
}

h1 {
  font-size: 200%;
}

ul {
  list-style-type: none;
  padding: 0;

  display: flex;
  justify-content: space-evenly;

  width: 100%;
}

button {
  border: 1px solid #772e25;
  border-radius: 25px;

  font-size: 30px;
  padding: 0.5rem 1rem;
  margin: 6vh 0;
}

button:hover {
  text-decoration: underline;
  text-decoration-color: #772e25;
  text-decoration-thickness: 5%;
}

#next {
  align-self: flex-end;
  cursor: pointer;
}
</style>
