<script setup>
// import { defineProps } from 'vue'
import QuizModeLayout from '@/components/QuizModeLayout.vue'
import { useQuizStore } from '@/stores/quizStore'

// const props = defineProps({
//   quiz: String,
// })

// console.log('Chosen quiz:', props.quiz)

const quizStore = useQuizStore()

console.log(quizStore.chosenQuiz)
</script>

<template>
  <div class="choose-quiz-mode-wrapper">
    <QuizModeLayout />
  </div>
</template>

<style scoped>
.choose-quiz-mode-wrapper {
  position: relative;
}

.go-back {
  position: absolute;
  top: 10vh;
  left: 4vw;

  color: black;

  width: max-content;
  background-color: #edddd4;
  border: 1px solid #772e25;
  border-radius: 55px;

  padding: 0.5rem 1rem;

  cursor: pointer;
}

.go-back span {
  width: 10vw;
}
</style>
