<script setup>
import { ref, computed } from 'vue'
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
const quizName = computed(() => route.params.quizName)

const shadowBox = ref(null)
const optionBtns = ref(null)
const backgroundImg = ref(null)
const backBtn = ref(null)

const props = defineProps({
  question: String,
  option1: [String, Array],
  option2: [String, Array],
  optionValue1: [String, Array],
  optionValue2: [String, Array],
  chosenOption: Number,
  isCorrect: Boolean,
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
    router.replace(`/${quizName.value}/choose-quiz-mode`)
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
      router.replace(`/${quizName.value}/choose-quiz-mode`)
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
  const btn = backBtn.value

  if (el1) {
    el1.style.transition = 'opacity 0.4s ease-out'
    el1.style.transitonDelay = '0s'
    el1.style.opacity = '1'
  }

  if (btn) {
    btn.style.transition = 'opacity 0.5s ease-in-out'
    btn.style.transitonDelay = '5s'
    btn.style.opacity = '1'
  }
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    openPageAnimation()
  })
})

//nextpage animation 2000ms
const nextPageAnimation = () => {
  const el1 = shadowBox.value
  const img = backgroundImg.value

  if (el1) {
    el1.style.transition = 'opacity 0.5s ease-in-out'
    el1.style.transitionDelay = '0.5s'
    el1.style.opacity = '0'
  }

  if (img) {
    img.style.transition = 'left 0.6s ease-out'
    img.style.transitionDelay = '1.2s'
    img.style.left = '100vw'
  }
}

const emit = defineEmits(['answer-selected'])

watch(
  () => [props.isCorrect, quizStore.isQuizInProgress],
  ([isCorrect, isQuizInProgress]) => {
    if (isCorrect === null) return

    if (isQuizInProgress === true) {
      console.log('Answer was:', isCorrect ? 'correct' : 'incorrect')
    }

    optionBtns.value = document.querySelectorAll('.option-btn')

    const option1 = optionBtns.value[0]
    const option2 = optionBtns.value[1]

    if (isQuizInProgress === true) {
      if (!shadowBox.value) return

      if (props.chosenOption === 1) {
        if (isCorrect === true) {
          option1.classList.add('answer-correct')
        } else if (isCorrect === false) {
          option1.classList.add('answer-incorrect')
        }
      } else if (props.chosenOption === 2) {
        if (isCorrect === true) {
          option2.classList.add('answer-correct')
        } else if (isCorrect === false) {
          option2.classList.add('answer-incorrect')
        }
      }

      setTimeout(() => {
        if (shadowBox.value) {
          option1.classList.remove('answer-correct')
          option1.classList.remove('answer-incorrect')
          option2.classList.remove('answer-correct')
          option2.classList.remove('answer-incorrect')
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
  router.push(`/${quizName.value}/save-infinity-score`)
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
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-lost`)
            }, 2100)
          }
        } else {
          if (errorsCount >= quizStore.maxErrors) {
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-lost`)
            }, 2100)
          }
        }
      } else if (quizStore.infiniteMode === false) {
        if (quizStore.maxErrors === '0') {
          if (errorsCount >= 1) {
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-lost`)
            }, 2100)
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-won`)
            }, 2100)
          }
        } else if (quizStore.maxErrors > 0) {
          if (errorsCount >= quizStore.maxErrors) {
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-lost`)
            }, 2100)
          } else if (quizStore.numberOfQuestions === questionIndex - 1) {
            nextPageAnimation()
            quizStore.isQuizInProgress = false
            setTimeout(() => {
              router.push(`/${quizName.value}/you-won`)
            }, 2100)
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
        <h1 class="question">{{ props.question }}</h1>
      </div>

      <ul class="options">
        <button class="option-btn" @click="emit('answer-selected', 'answer1')">
          {{ props.option1 }}
          <!-- {{ props.optionValue1 }} -->
          <!-- long name for testing -->
          <!-- Saint Helena, Ascension and Tristan da Cunha Guinea-Bissau -->
        </button>
        <button class="option-btn" @click="emit('answer-selected', 'answer2')">
          {{ props.option2 }}
          <!-- {{ props.optionValue2 }} -->
          <!-- Saint Helena, Ascension and Tristan da Cunha Guinea-Bissau -->
        </button>
      </ul>

      <button
        ref="infinityScoreBtn"
        v-if="quizStore.infiniteMode === true"
        id="infinity-button"
        @click="saveInfinityScore"
      >
        <span> Save current score</span>
      </button>
      <!-- shadow box -->
    </div>
    <button ref="backBtn" @click="handleBackButton" class="go-back">
      <span>&#8592; Back to settings</span>
    </button>
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

  z-index: 0;
}

.shadow-box {
  z-index: 10;
  opacity: 0;

  width: 44vw;
  height: 55vh;

  display: flex;
  flex-direction: column;

  background-color: none;
}

.text-area {
  position: relative;

  background-color: #f1e2d6;
  background-image: none;

  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 1.5vh;

  padding: 1.2rem 1.5rem 2rem 1.5rem;

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

.question {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 18vh;
  font-size: clamp(1rem, 1vw + 1vh, 2.4rem);
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

.options {
  /* background-color: yellow; */
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2vw;
}

.option-btn {
  flex-shrink: 0;

  height: 6rem;
  width: 20vw;
  padding: 0.4rem 0.8rem;

  border-radius: 25px;

  background-color: #f1e2d6;

  cursor: pointer;

  border: 5px solid transparent;

  transition: border 0.3s ease;
}

.option-btn:hover:not(.correct):not(.incorrect) {
  border-color: #fab662;
}

.option-btn.answer-correct {
  border-color: #55b34bce !important;
}

.option-btn.answer-incorrect {
  border-color: #f44336ce !important;
}

#infinity-button,
.go-back {
  position: relative; /* needed for inner text positioning */
  width: max-content;

  color: black;
  background-color: #f1e2d6;

  border-radius: 50px;
  border: none;

  padding: 0.6rem 1.2rem;

  margin-top: 0;
  margin-bottom: 0;

  cursor: pointer;

  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}

/* Border only on infinity button */
#infinity-button {
  align-self: center;
  border: 0.5px solid #fab662;

  opacity: 0.5;
}

.go-back {
  position: absolute;
  bottom: 3vh;
  left: 3vw;

  opacity: 0;
  border: none;
}

/* Inner span for text */
#infinity-button > span,
.go-back > span {
  position: relative; /* keep text in place */
  z-index: 2;

  display: inline-block;
  user-select: none;
  pointer-events: none;

  transition:
    transform 0.3s ease,
    color 0.3s ease,
    font-weight 0.3s ease;
  color: inherit;
  font-weight: normal;
}

/* Hover states for both buttons */
#infinity-button:hover,
.go-back:hover {
  background-color: #fab662;
  color: #f1e2d6;

  transform: scale(1.05);
  opacity: 1;
}

/* Inverse scale on text to keep size stable */
#infinity-button:hover > span,
.go-back:hover > span {
  transform: scale(0.95);
  font-weight: 500;
}

/* RESPONSIVE FONT MANAGEMENT  */
/* h1 {
  font-size: clamp(1.1rem, 1.5vw + 1.2vh, 3.2rem);
} */

.question {
  font-size: clamp(1rem, 1vw + 1vh, 2.4rem);
}

.option-btn {
  font-size: clamp(1rem, 1.2vw + 0.5vh, 2rem);
}

.errors,
.question-number,
#infinity-button,
.go-back {
  font-size: clamp(0.95rem, 1.2vw + 0.4vh, 2.4rem);
}

@media (max-width: 1024px) {
  .shadow-box {
    width: 70vw;
    height: 65vh;
  }

  .option-btn {
    width: 40vw;
    height: 7rem;
  }

  .question {
    height: 10vh;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .wrapper {
    align-items: flex-end;
  }

  .shadow-box {
    width: 70vw;
    /* height: auto; */
    /* margin-top: 5vh; */
    gap: 3vh;
  }

  .question {
    height: auto;
    margin: 2vh 0;
  }

  .option-btn {
    width: 35vw;
    height: 6rem;
    font-size: clamp(1rem, 1.2vw + 0.5vh, 2rem);
  }
}

@media (max-width: 767px) {
  .shadow-box {
    gap: 2vh;
  }

  .text-area {
    padding: 1.5rem;
    gap: 1.5vh;
  }

  .question {
    margin-top: 2vh;
    height: auto;
  }
}
</style>
