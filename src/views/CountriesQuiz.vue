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
const displayedOption = ref(null) // Which country is currently asked about

//PROPs
const question = ref(null)

const option1 = ref(null)
const option2 = ref(null)

const optionValue1 = ref(null)
const optionValue2 = ref(null)
const formatOptionValue1 = ref(null)
const formatOptionValue2 = ref(null)

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

  option1.value = result.a.name
  option2.value = result.b.name

  optionValue1.value = result.a.capital
  optionValue2.value = result.b.capital

  formatOptionValue1.value = optionValue1.value[0]
  formatOptionValue2.value = optionValue2.value[0]

  const chosenOptionNumber = Math.floor(Math.random() * 2) + 1
  displayedOption.value = chosenOptionNumber === 1 ? optionValue1.value : optionValue2.value

  question.value = `Which country has the capital city of ${displayedOption.value}?`
}

const handleAnswerSelected = (selectedAnswer) => {
  if (quizStore.firstQuestion) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
    let correctCountry = null
    if (displayedOption.value === optionValue1.value) {
      correctCountry = option1.value
    } else if (displayedOption.value === optionValue2.value) {
      correctCountry = option2.value
    }

    const selectedCapital = selectedAnswer === 'answer1' ? option1.value : option2.value
    console.log('Answer selected:', selectedAnswer)

    // Check correctness
    chosenOption.value = selectedAnswer === 'answer1' ? 1 : 2
    isCorrect.value = selectedCapital === correctCountry

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
      :optionValue1="formatOptionValue1"
      :optionValue2="formatOptionValue2"
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
