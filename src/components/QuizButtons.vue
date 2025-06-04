<script setup>
// import { ref } from 'vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quizStore'

const route = useRoute()
const router = useRouter()
const currentQuizName = computed(() => route.params.quizName)

const quizStore = useQuizStore()
const quizzesWrapper = ref(null)

const chooseQuiz = (quizName) => {
  quizStore.resetToReplay()
  router.replace(`/${quizName}/choose-quiz-mode`)
}
</script>

<template>
  <div class="wrapper">
    <div ref="quizzesWrapper" class="quizzes-wrapper">
      <div class="row1">
        <div
          @click="chooseQuiz('capitals')"
          :class="{ active: currentQuizName === 'capitals' }"
          class="quiz double"
        >
          Capitals
        </div>
        <div
          @click="chooseQuiz('countries')"
          :class="{ active: currentQuizName === 'countries' }"
          class="quiz double"
        >
          Countries
        </div>
      </div>
      <div class="row2">
        <div
          @click="chooseQuiz('population')"
          :class="{ active: currentQuizName === 'population' }"
          class="quiz"
        >
          Population
        </div>
        <div
          @click="chooseQuiz('language')"
          :class="{ active: currentQuizName === 'language' }"
          class="quiz"
        >
          Language
        </div>
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

.row1,
.row2 {
  display: flex;
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
  opacity: 1;

  transition: opacity 0.2s ease-in-out;
}

.quiz:hover,
.quiz.active {
  color: white;
  background-color: #fab662;

  transition: color 0.1s ease-out;
}

.quiz.active {
  opacity: 0.5;
}

/* RESPONSIVE FONT MANAGEMENT */
.quiz {
  font-size: clamp(0.95rem, 1.2vw + 0.8vh, 2.4rem);
}

/* .double {
  font-size: clamp(0.087rem, 1vw + 0.6vh, 2.4rem);
} */

@media (max-width: 430px) {
  .quizzes-wrapper {
    flex-direction: column;
    gap: 2vh;
    justify-content: stretch;
    align-items: stretch;
  }

  .row1,
  .row2 {
    display: flex;
    gap: 2vh;
  }

  .quiz {
    width: 40vw;
  }
}
</style>
