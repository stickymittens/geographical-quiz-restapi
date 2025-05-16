<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import QuizModeLayout from '@/components/QuizModeLayout.vue'

const props = defineProps({
  quiz: String,
})

console.log('Chosen quiz:', props.quiz)

const router = useRouter()
const backToHomePage = () => {
  router.push('/')
}
</script>

<template>
  <div class="choose-quiz-mode-wrapper">
    <div @click="backToHomePage" class="go-back"><span>&#8592; Back</span></div>

    <QuizModeLayout />
  </div>
</template>

<style scoped>
.choose-quiz-mode-wrapper {
  position: relative;
}

.go-back {
  position: absolute;
  top: 3vh;
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
