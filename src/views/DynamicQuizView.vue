<script setup>
import { useRoute } from 'vue-router'
import PopulationQuiz from '@/views/PopulationQuiz.vue'
import CapitalsQuiz from '@/views/CapitalsQuiz.vue'

const route = useRoute()

const quizComponentMap = {
  population: PopulationQuiz,
  capitals: CapitalsQuiz,
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
