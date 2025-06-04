<script setup>
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useCountryStore } from '@/stores/countryStore'
import QuizLayout from '@/components/QuizLayout.vue'

//QUIZ STORE
const quizStore = useQuizStore()

//COUNTRY STORE
const countryStore = useCountryStore()

//PROPs
const question = 'Which country has the larger population?'
const isCorrect = ref(null)
const option1 = ref(null)
const option2 = ref(null)
const optionValue1 = ref(null)
const optionValue2 = ref(null)
const formattedOptionValue1 = ref(null)
const formattedOptionValue2 = ref(null)
const chosenOption = ref(null)

// Use the generateNewPair method from the store to generate the country pair
const generateNewQuestion = async () => {
  const result = await quizStore.generateNewPair()

  if (!result || !result.a || !result.b) return

  if (result?.a && result?.b) {
    option1.value = result.a.name
    option2.value = result.b.name

    optionValue1.value = result.a.population
    optionValue2.value = result.b.population

    formattedOptionValue1.value = new Intl.NumberFormat('fr-FR').format(optionValue1.value)
    formattedOptionValue2.value = new Intl.NumberFormat('fr-FR').format(optionValue2.value)
  }
}

const handleAnswerSelected = (selectedAnswer) => {
  if (quizStore.firstQuestion) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
    if (selectedAnswer === 'answer1') {
      if (optionValue1.value === optionValue2.value) {
        isCorrect.value = true
      } else {
        isCorrect.value = optionValue1.value > optionValue2.value ? true : false
      }
    } else if (selectedAnswer === 'answer2') {
      if (optionValue1.value === optionValue2.value) {
        isCorrect.value = true
      } else {
        isCorrect.value = optionValue2.value > optionValue1.value ? true : false
      }
    }

    chosenOption.value = selectedAnswer === 'answer1' ? 1 : 2

    console.log('Answer selected:', selectedAnswer)

    setTimeout(() => {
      isCorrect.value = null
      chosenOption.value = null
      generateNewQuestion()
    }, 500)
  }
}

// Fetch the countries when the component mounts
onMounted(async () => {
  await countryStore.fetchCountries()
  handleAnswerSelected()
})
</script>

<template>
  <div class="quiz-wrapper">
    <QuizLayout
      :question="question"
      :option1="option1"
      :option2="option2"
      :optionValue1="formattedOptionValue1"
      :optionValue2="formattedOptionValue2"
      :chosenOption="chosenOption"
      :isCorrect="isCorrect"
      @answer-selected="handleAnswerSelected"
    />
  </div>
</template>

<style scoped>
.quiz-wrapper {
  position: relative;

  height: 100vh;
  background-image: url('https://www.transparenttextures.com/patterns/cartographer.png');

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
