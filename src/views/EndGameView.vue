<script setup>
import { useQuizStore } from '@/stores/quizStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const endGame = route.params.endGame

const router = useRouter()

function handleBackButton() {
  quizStore.resetQuizStore()
  // Force navigation to main page
  router.replace('/')
}

onMounted(() => {
  // Push a dummy entry to history
  window.history.pushState(null, '', window.location.href)

  // Listen for browser back button
  window.addEventListener('popstate', handleBackButton)
})

onUnmounted(() => {
  // Clean up the listener
  window.removeEventListener('popstate', handleBackButton)
})

const quizStore = useQuizStore()

//funct changing colors of the correct/incorrect option
const option1Refs = ref([])
const option2Refs = ref([])

function changeOptionColors() {
  quizStore.incorrectsArray.forEach((item, index) => {
    const chosenOption = item.chosenOption
    const option1 = option1Refs.value[index]
    const option2 = option2Refs.value[index]

    if (chosenOption === 1) {
      option1.style.color = 'red'
      option2.style.color = 'green'
    } else if (chosenOption === 2) {
      option1.style.color = 'green'
      option2.style.color = 'red'
    }
  })
}

onMounted(() => {
  changeOptionColors()
})
</script>

<template>
  <div class="wrapper">
    <div v-if="endGame === 'you-won'" class="won">
      <h1>You won</h1>
      <h2>YOUR SCORE: {{ quizStore.questionIndex }}</h2>
    </div>

    <div v-if="endGame === 'you-lost'" class="lost">
      <h1>You Lost</h1>
      <h2>YOUR SCORE: {{ quizStore.questionIndex }}</h2>
    </div>

    <div v-if="endGame === 'save-infinity-score'">
      <h1>INFINITY MODE</h1>
      <p>Your current score is {{ quizStore.questionIndex - 1 }}</p>
      <p>Your best score is {{ quizStore.bestInfinityScore }}</p>
    </div>

    <div v-if="quizStore.incorrectsArray.length > 0" class="options-wrap">
      <!-- <p id="arrow1">&#8592;</p> -->
      <!-- <p id="arrow2">&#8592;</p> -->
      <div v-for="(item, index) in quizStore.incorrectsArray" :key="index" class="options">
        <p :ref="(el) => (option1Refs[index] = el)" class="option1">{{ item.option1 }}</p>
        <p :ref="(el) => (option2Refs[index] = el)" class="option2">{{ item.option2 }}</p>
      </div>
    </div>
    <div v-else>No errors</div>

    <!-- <div class="infinite-mode"></div> -->

    <div>
      <div>
        <p>Play the same quiz</p>
        <p>Play teh same quiz with differet setting</p>
      </div>
      <p>Play another quiz</p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
  padding: 10vh 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #749cd4;

  overflow: hidden;
}

.won,
.lost {
  text-align: center;
  margin: 5vh 3vw;
  padding: 2vh 0;

  width: 100%;
  background-color: #f1e2d6;
  color: #633851;
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
  margin: 2vh 2vw;

  background-color: #f1e2d6;

  cursor: pointer;

  border: 3px solid transparent;

  font-size: clamp(1.2rem, 1.5vw + 0.5vh, 2.5rem);
}

@media (max-width: 768px) {
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
    width: 44vw;
    margin: 2vh 2vw;
  }
}
</style>
