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

//PROPs
const isCorrect = ref(null)

const option1 = ref(null)
const option2 = ref(null)
const chosenOption = ref(null)

// Use the generateNewPair method from the store to generate the country pair
const generateNewQuestion = async () => {
  const result = await quizStore.generateNewPair()

  if (result?.a && result?.b) {
    answer1.value = result.a.name
    answer2.value = result.b.name
    answerValue1.value = result.a.population
    answerValue2.value = result.b.population

    option1.value = result.a.name
    option2.value = result.b.name
  }
}

const handleAnswerSelected = (selectedAnswer) => {
  if (selectedAnswer === 'answer1') {
    isCorrect.value = answerValue1.value > answerValue2.value ? true : false
  } else if (selectedAnswer === 'answer2') {
    isCorrect.value = answerValue2.value > answerValue1.value ? true : false
  }

  chosenOption.value = selectedAnswer === 'answer1' ? 1 : 2

  if (quizStore.firstQuestion === true) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
    // console.log('Answer selected:', selectedAnswer)

    // quizStore.firstQuestion = true

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
      :answer1="answer1"
      :answer2="answer2"
      :chosenOption="chosenOption"
      :option1="option1"
      :option2="option2"
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
