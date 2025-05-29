// stores/quizStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCountryStore } from './countryStore'

export const useQuizStore = defineStore('quiz', () => {
  const countryStore = useCountryStore()

  const questionIndex = ref(1)
  const firstQuestion = ref(true)

  const infiniteMode = ref(false)
  const numberOfQuestions = ref(20)

  const maxErrors = ref(3)
  const errorsCount = ref(0)
  const incorrectsArray = ref([])

  const bestInfinityScore = ref(0)

  const isQuizInProgress = ref(false)

  const countryA = ref(null)
  const countryB = ref(null)

  const isSmallDevicesNavBarVisible = ref(null)

  function setQuizSettings(infiniteMode, numberOfQuestions, maxErrors) {
    infiniteMode.value = infiniteMode
    numberOfQuestions.value = numberOfQuestions
    maxErrors.value = maxErrors
  }

  function inifniteModeFunctionality() {
    if (infiniteMode.value === true) {
      numberOfQuestions.value = Infinity
    }
  }

  async function generateNewPair() {
    if (isQuizInProgress.value) {
      const countries = countryStore.countries

      inifniteModeFunctionality()

      if (countries.length < 2) return

      let i = Math.floor(Math.random() * countries.length)
      let j = Math.floor(Math.random() * countries.length)
      while (i === j) j = Math.floor(Math.random() * countries.length)

      const selectedA = countries[i]
      const selectedB = countries[j]

      // if (firstQuestion.value === true) {
      //   // console.log(selectedA, selectedB)
      //   console.log(selectedA.population > selectedB.population)
      // } else {
      //   console.log(selectedA.population > selectedB.population)
      // }

      return { a: selectedA, b: selectedB }
    }
  }

  function resetQuizStore() {
    isQuizInProgress.value = false
    firstQuestion.value = true
    questionIndex.value = 1

    infiniteMode.value = false
    numberOfQuestions.value = 20
    maxErrors.value = 3
    errorsCount.value = 0
    incorrectsArray.value = []

    countryA.value = null
    countryB.value = null
  }

  function resetToReplay() {
    isQuizInProgress.value = true
    firstQuestion.value = true
    questionIndex.value = 1

    // infiniteMode.value = false
    // numberOfQuestions.value = 20
    // maxErrors.value = 3
    errorsCount.value = 0
    incorrectsArray.value = []

    countryA.value = null
    countryB.value = null
  }

  return {
    questionIndex,
    firstQuestion,
    bestInfinityScore,

    infiniteMode,
    inifniteModeFunctionality,

    numberOfQuestions,
    maxErrors,
    errorsCount,
    incorrectsArray,
    setQuizSettings,
    resetQuizStore,
    resetToReplay,

    isQuizInProgress,

    countryA,
    countryB,
    generateNewPair,

    isSmallDevicesNavBarVisible,
  }
})
