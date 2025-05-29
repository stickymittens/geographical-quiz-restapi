<script setup>
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useCountryStore } from '@/stores/countryStore'
import QuizLayout from '@/components/QuizLayout.vue'

//QUIZ STORE
const quizStore = useQuizStore()

//COUNTRY STORE
const countryStore = useCountryStore()

//DEFINING VALUES
const answer1 = ref(null)
const answer2 = ref(null)
const answerValue1 = ref(null)
const answerValue2 = ref(null)

const displayedCountry = ref(null) // Which country is currently asked about

//PROPs
const question = ref(null)
const isCorrect = ref(null)
const option1 = ref(null)
const option2 = ref(null)
// let optionValue1 = ref(null)
// let optionValue2 = ref(null)
const chosenOption = ref(null)

// Use the generateNewPair method from the store to generate the country pair
const generateNewQuestion = async () => {
  const result = await quizStore.generateNewPair()

  if (result?.a && result?.b) {
    answer1.value = result.a.capital
    answer2.value = result.b.capital

    answerValue1.value = result.a.name
    answerValue2.value = result.b.name

    const chosenValueNumber = Math.floor(Math.random() * 2) + 1
    displayedCountry.value = chosenValueNumber === 1 ? answerValue1.value : answerValue2.value

    question.value = `What's the capital of ${displayedCountry.value}`
  }
}

const handleAnswerSelected = (selectedAnswer) => {
  let correctCapital = null
  if (displayedCountry.value === answerValue1.value) {
    correctCapital = answer1.value
  } else if (displayedCountry.value === answerValue2.value) {
    correctCapital = answer2.value
  }

  // Get the capital user selected
  const selectedCapital = selectedAnswer === 'answer1' ? answer1.value : answer2.value

  // Check correctness
  isCorrect.value = selectedCapital === correctCapital

  // chosenOption.value = selectedAnswer === 'answer1' ? 1 : 2

  if (quizStore.firstQuestion) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
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
      :answer1="answer1"
      :answer2="answer2"
      :chosenOption="chosenOption"
      :option1="option1"
      :option2="option2"
      :optionValue1="answerValue1"
      :optionValue2="answerValue2"
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
