<script setup>
import { useQuizStore } from '@/stores/quizStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const quizStore = useQuizStore()

const route = useRoute()
const router = useRouter()
const endGame = route.params.endGame
const quizName = route.params.quizName

//funct changing colors
const option1Refs = ref([])
const option2Refs = ref([])
const optionValue1Refs = ref([])
const optionValue2Refs = ref([])

//Handling browser refresh, close, or navigate away
function handleBeforeUnload(event) {
  event.preventDefault()
  event.returnValue = ''

  // Flag to reset quiz after reload
  localStorage.setItem('decidedToLeave', 'true')
}

onMounted(() => {
  if (localStorage.getItem('decidedToLeave') === 'true') {
    quizStore.resetQuizStore()
    localStorage.removeItem('decidedToLeave')
    router.replace('/')
    return
  }
})

function handleBackButton() {
  quizStore.resetQuizStore()

  // Replace current route with home
  sessionStorage.setItem('forceHomeReload', 'true')
  router.replace('/').then(() => {
    window.history.pushState(history.state, '', window.location.href)
  })

  // Push dummy state so browser "back" does nothing from now on
  setTimeout(() => {
    window.history.pushState(history.state, '', window.location.href)
  }, 100)
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.history.pushState(history.state, '', window.location.href)
  window.addEventListener('popstate', handleBackButton)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('popstate', handleBackButton)
})

//inifnity - current & best score
let currentScore = quizStore.questionIndex - quizStore.incorrectsArray.length - 1
let best = quizStore.bestInfinityScore

if (currentScore > quizStore.bestInfinityScore) {
  quizStore.bestInfinityScore = currentScore
}

//funct changing colors of the correct/incorrect option
function changeOptionColors() {
  quizStore.incorrectsArray.forEach((item, index) => {
    const chosenOption = item.chosenOption
    const option1 = option1Refs.value[index]
    const option2 = option2Refs.value[index]
    const value1 = optionValue1Refs.value[index]
    const value2 = optionValue2Refs.value[index]

    if (chosenOption === 1) {
      option1.style.color = 'red'
      value1.style.color = 'red'
      option2.style.color = 'green'
      value2.style.color = 'green'
    } else if (chosenOption === 2) {
      option1.style.color = 'green'
      value1.style.color = 'green'
      option2.style.color = 'red'
      value2.style.color = 'red'
    }
  })
}

onMounted(() => {
  changeOptionColors()
})

function replaySameSettings() {
  quizStore.resetToReplay()
  router.replace(`/${quizName}/quizzing`)
}

function replayDiffSettings() {
  quizStore.resetQuizStore()
  router.replace(`/${quizName}/choose-quiz-mode`)
}
</script>

<template>
  <div class="wrapper">
    <div v-if="endGame === 'you-won'" class="won">
      <h1>You won</h1>
      <h2>YOUR SCORE: {{ currentScore }}</h2>
    </div>

    <div v-if="endGame === 'you-lost'" class="lost">
      <h1>You Lost</h1>
      <h2>
        YOUR SCORE:
        {{ currentScore }}
      </h2>
    </div>

    <div v-if="endGame === 'save-infinity-score'" class="infinity-mode-wrapper">
      <div class="infinity-mode">
        <h1>INFINITY MODE</h1>
        <p>Your current score is {{ currentScore }}</p>
        <p>Your best score is {{ quizStore.bestInfinityScore }}</p>
      </div>
      <p v-if="currentScore > best" id="new-best">🎉 You achieved a new highest score! 🎉</p>
    </div>

    <div v-if="quizStore.incorrectsArray.length > 0" class="options-wrap">
      <!-- <p id="arrow1">&#8592;</p> -->
      <!-- <p id="arrow2">&#8592;</p> -->
      <div v-for="(item, index) in quizStore.incorrectsArray" :key="index" class="options">
        <div class="wrapper-option-1">
          <p :ref="(el) => (option1Refs[index] = el)" class="option1">
            {{ item.option1 }}
          </p>
          <p :ref="(el) => (optionValue1Refs[index] = el)" class="option-value-1">
            {{ item.optionValue1 }}
          </p>
        </div>
        <div class="wrapper-option-2">
          <p :ref="(el) => (option2Refs[index] = el)" class="option2">
            {{ item.option2 }}
          </p>
          <p :ref="(el) => (optionValue2Refs[index] = el)" class="option-value-2">
            {{ item.optionValue2 }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>No errors</div>

    <div class="replay">
      <div class="replay-wrapper">
        <button @click="replaySameSettings()" id="replay-btn">Replay</button>
        <p id="invisible-text">insisible text</p>
      </div>
      <div @click="replayDiffSettings()" class="diff-settings-wrapper">
        <button id="diff-settings-btn">Replay</button>
        <p id="visible-text">with different settings</p>
      </div>
      <!-- replay -->
    </div>
  </div>
</template>

<style scoped>
/* correct #55b34bce
incorrect #f44336ce */

.wrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  padding-top: 15vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  background-color: #749cd4;
  /* background-color: pink; */

  overflow: hidden;
}

.infinity-mode-wrapper {
  width: 100vw;
}

.won,
.lost,
.infinity-mode,
#new-best {
  text-align: center;
  margin: 5vh 0;
  padding: 2vh 0;

  width: 100%;
  background-color: #f1e2d6;
  color: #633851;
}

#new-best {
  font-weight: 600;
}

.options-wrap {
  position: relative;
  width: 100vw;

  display: flex;
  /* gap: 5vw; */

  overflow-x: scroll;
  scroll-snap-type: x mandatory; /* Change this to mandatory */
  scroll-behavior: smooth;

  scroll-padding-left: 10vw;
  scroll-padding-right: 10vw; /* Ensures items stay away from left edge */
  padding: 0 10vw;

  margin-bottom: 5vh;
}

.options-wrap {
  scrollbar-width: none; /* Firefox */
}
.options-wrap::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.options {
  display: flex;
  justify-content: center;
  /* background-color: darkblue; */

  scroll-snap-align: center; /* Center the item when snapping */

  width: 80vw; /* Ensures one item fits within the screen */
  flex-shrink: 0; /* Prevent shrinking if content overflows */

  margin-right: 10vw;
}

.optionsValues {
  z-index: 10;
}

.wrapper-option-1,
.wrapper-option-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
}

.option1,
.option2 {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  height: 8rem;
  width: 25vw;

  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin: 0 2vw;

  background-color: #f1e2d6;

  border: 3px solid transparent;

  font-size: clamp(1.2rem, 1.5vw + 0.5vh, 2.5rem);
}

.option-value-1,
.option-value-2 {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  height: 3rem;
  width: 25vw;

  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin: 0 2vw;

  background-color: #f1e2d6;
  color: black;

  border: 3px solid transparent;
}

/* REPLAY */
.replay {
  background-color: #2f4d9d;

  width: 100%;
  height: 15vh;

  border-top: 0.5px #f1e2d6 solid;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4vw;
}

.diff-settings-wrapper,
.replay-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#invisible-text {
  color: #2f4d9d;
  pointer-events: none;
}

#replay-btn,
#diff-settings-btn {
  padding: 1rem 2rem;

  font-weight: 800;
  color: white;

  background-color: #fab662;

  border: 1px solid #f1e2d6;
  border-radius: clamp(25px, 5vw, 48px);

  cursor: pointer;
}

#visible-text {
  text-align: center;
  font-style: italic;
  font-weight: 200;
}

.quizzes-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
}

.quiz {
  opacity: 1;

  color: black;
  background-color: #f1e2d6;

  border-radius: 25px;

  width: 12ch;
  padding: 0.5rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  cursor: pointer;
}

.quiz:hover {
  color: white;
  background-color: #fab662;
}

.quiz.disabled {
  pointer-events: none;
  user-select: none;
  cursor: not-allowed;
}

/* RESPONSIVE FONT MANAGEMENT */
#replay-btn,
#diff-settings-btn,
#new-best {
  font-size: clamp(1rem, 0.85vw + 0.85vh, 2rem);
}

#invisible-text,
#visible-text {
  font-size: clamp(0.875rem, 0.7vw + 0.7vh, 1rem);
}

.option-value-1,
.option-value-2 {
  font-size: clamp(0.875rem, 1.2vw + 0.8vh, 2.4rem);
}

@media (max-width: 1024px) {
  .options-wrap {
    scroll-padding-left: 2vw;
    scroll-padding-right: 2vw;
    padding: 0 2vw;
  }

  .options {
    width: 96vw;
    margin-right: 2vw;
  }

  .option1,
  .option2 {
    width: 35vw;
    /* margin: 2vh 2vw; */
  }

  .option-value-1,
  .option-value-2 {
    width: 35vw;
    /* margin: 2vh 2vw; */
  }
}

@media (max-width: 430px) {
  .options-wrap {
    scroll-padding-left: 2vw;
    scroll-padding-right: 2vw;
    padding: 0 2vw;
  }

  .options {
    width: 96vw;
  }

  .option1,
  .option2 {
    width: 44vw;
    /* margin: 2vh 2vw; */
  }

  .option-value-1,
  .option-value-2 {
    width: 44vw;
    /* margin: 2vh 2vw; */
  }
}
</style>
