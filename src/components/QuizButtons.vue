<script setup>
// import { ref } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'

const route = useRoute()
const router = useRouter()
// const quizName = route.params.quizName

const quizName = computed(() => route.params.quizName)

const quizStore = useQuizStore()

const chooseQuiz = (quizName) => {
  quizStore.resetQuizStore()
  router.replace(`/${quizName}/choose-quiz-mode`)
}
</script>
<template>
  <div class="wrapper">
    <div class="quizzes-wrapper">
      <div v-if="quizName !== 'capitals'" @click="chooseQuiz('capitals')" class="quiz">
        Capitals
      </div>
      <div v-if="quizName !== 'continents'" @click="chooseQuiz('continents')" class="quiz">
        Continents
      </div>
      <div v-if="quizName !== 'population'" @click="chooseQuiz('population')" class="quiz">
        Population
      </div>
      <div v-if="quizName !== 'language'" @click="chooseQuiz('language')" class="quiz">
        Language
      </div>
    </div>
  </div>
</template>

<style scoped>
.quizzes-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
}

.quiz {
  color: black;
  background-color: #f1e2d6;

  border-radius: 25px;

  width: 12ch;
  padding: 0.5rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  cursor: pointer;
}

.quiz:hover {
  color: white;
  background-color: #fab662;
}

/* RESPONSIVE FONT MANAGEMENT */
.quiz {
  font-size: clamp(1.2rem, 1.2vw + 1vh, 2rem);
}
</style>
