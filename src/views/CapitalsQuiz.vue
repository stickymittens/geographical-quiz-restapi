<script setup>
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useCountryStore } from '@/stores/countryStore'
import QuizLayout from '@/components/QuizLayout.vue'

//QUIZ STORE
const quizStore = useQuizStore()

//COUNTRY STORE
const countryStore = useCountryStore()

//VALUES
const displayedOptionValue = ref(null) // Which country is currently asked about

//PROPs
const question = ref(null)

const option1 = ref(null)
const option2 = ref(null)
const formatOption1 = ref(null)
const formatOption2 = ref(null)

const optionValue1 = ref(null)
const optionValue2 = ref(null)

const chosenOption = ref(null)
const isCorrect = ref(null)

// Use the generateNewPair method from the store to generate the country pair
const generateNewQuestion = async () => {
  let result = await quizStore.generateNewPair()

  if (!result || !result.a || !result.b) return

  // Retry if either capital is missing or empty
  while (
    !Array.isArray(result.a.capital) ||
    result.a.capital.length === 0 ||
    !Array.isArray(result.b.capital) ||
    result.b.capital.length === 0
  ) {
    result = await quizStore.generateNewPair()
    if (!result || !result.a || !result.b) return
  }

  option1.value = result.a.capital
  option2.value = result.b.capital

  formatOption1.value = option1.value[0]
  formatOption2.value = option2.value[0]

  optionValue1.value = result.a.name
  optionValue2.value = result.b.name

  const chosenValueNumber = Math.floor(Math.random() * 2) + 1
  displayedOptionValue.value = chosenValueNumber === 1 ? optionValue1.value : optionValue2.value

  question.value = `What's the capital of ${displayedOptionValue.value}?`
}

const handleAnswerSelected = (selectedAnswer) => {
  if (quizStore.firstQuestion) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
    let correctCapital = null
    if (displayedOptionValue.value === optionValue1.value) {
      correctCapital = formatOption1.value
    } else if (displayedOptionValue.value === optionValue2.value) {
      correctCapital = formatOption2.value
    }

    const selectedCapital = selectedAnswer === 'answer1' ? formatOption1.value : formatOption2.value
    console.log('Answer selected:', selectedAnswer)

    // Check correctness
    chosenOption.value = selectedAnswer === 'answer1' ? 1 : 2
    isCorrect.value = selectedCapital === correctCapital

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
      :option1="formatOption1"
      :option2="formatOption2"
      :optionValue1="optionValue1"
      :optionValue2="optionValue2"
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
