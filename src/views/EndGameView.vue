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
    </div>

    <div v-if="endGame === 'you-lost'" class="lost">
      <h1>You Lost</h1>
    </div>

    <div v-if="endGame === 'save-infinity-score'">
      <h1>INFINITY MODE</h1>
      <p>Your current score is {{ quizStore.questionIndex - 1 }}</p>
      <p>Your best score is {{ quizStore.bestInfinityScore }}</p>
    </div>

    <div v-if="quizStore.incorrectsArray.length > 0">
      <div v-for="(item, index) in quizStore.incorrectsArray" :key="index">
        <p :ref="(el) => (option1Refs[index] = el)" class="option1">{{ item.option1 }}</p>
        <p :ref="(el) => (option2Refs[index] = el)" class="option2">{{ item.option2 }}</p>
        <!-- <p>{{ item.chosenOption }}</p> -->
      </div>
    </div>
    <div v-else>No errors</div>

    <!-- <div class="infinite-mode"></div> -->

    <div>
      <p>Play the same quiz</p>
      <p>Play teh same quiz with differet setting</p>
      <p>Play another quiz</p>
    </div>
  </div>
</template>

<style scoped>
.option1 {
  color: white;
}

.option2 {
  color: white;
}
</style>
