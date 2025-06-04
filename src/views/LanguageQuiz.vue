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
const aLanguages = ref(null)
const bLanguages = ref(null)

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

function formatLanguages(l) {
  if (!l || l.length === 0) return ''

  if (l.length === 1) {
    return `${l[0]}`
  }

  if (l.length === 2) {
    return `${l[0]} and ${l[1]}`
  }

  return `${l.slice(0, -1).join(', ')}, and ${l[l.length - 1]}`
}

// Use the generateNewPair method from the store to generate the country pair
const generateNewQuestion = async () => {
  let result = await quizStore.generateNewPair()

  if (!result || !result.a || !result.b) return

  const aLangsArray = Object.values(result.a.languages).sort()
  aLanguages.value = formatLanguages(aLangsArray)

  const bLangsArray = Object.values(result.b.languages).sort()
  bLanguages.value = formatLanguages(bLangsArray)

  //retry if identical language(s)
  if (aLanguages.value === bLanguages.value) {
    result = await quizStore.generateNewPair()
    console.log('ERROR - same language')
  }

  option1.value = result.a.name
  option2.value = result.b.name

  optionValue1.value = aLanguages.value
  optionValue2.value = bLanguages.value

  const chosenValueNumber = Math.floor(Math.random() * 2) + 1
  displayedOptionValue.value = chosenValueNumber === 1 ? optionValue1.value : optionValue2.value

  question.value = `What's the country with official language(s) of ${displayedOptionValue.value}?`
  // question.value =
  //   "What's the country with official language(s) of 'Afrikaans', 'English', 'Southern Ndebele', 'Northern Sotho' and 'Southern Sotho'?"
  // question.value = "What's the country with official language(s) of Afrikaans?"
}

const handleAnswerSelected = (selectedAnswer) => {
  if (quizStore.firstQuestion) {
    if (quizStore.isQuizInProgress) {
      generateNewQuestion()
    }
    quizStore.firstQuestion = false
  } else {
    let correctCountry = null
    if (displayedOptionValue.value === optionValue1.value) {
      correctCountry = option1.value
    } else if (displayedOptionValue.value === optionValue2.value) {
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
