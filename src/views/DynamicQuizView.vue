<script setup>
import { useRoute } from 'vue-router'
import PopulationQuiz from '@/views/PopulationQuiz.vue'
import CapitalsQuiz from '@/views/CapitalsQuiz.vue'
import CountriesQuiz from './CountriesQuiz.vue'
import LanguageQuiz from './LanguageQuiz.vue'

const route = useRoute()

const quizComponentMap = {
  population: PopulationQuiz,
  capitals: CapitalsQuiz,
  countries: CountriesQuiz,
  language: LanguageQuiz,
}

const quizName = route.params.quizName
const selectedComponent = quizComponentMap[quizName] || {
  template: `<div>Unknown quiz: {{ quizName }}</div>`,
  props: ['quizName'],
}
</script>

<template>
  <component :is="selectedComponent" />
</template>
