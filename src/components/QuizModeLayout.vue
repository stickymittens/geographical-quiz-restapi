<script setup>
import { ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useRouter, useRoute } from 'vue-router'

const quizStore = useQuizStore()
const router = useRouter()
const route = useRoute()

const goInfiniteMode = () => {
  quizStore.infiniteMode = true
}

const goNumberOfQuestionsMode = () => {
  quizStore.infiniteMode = false
}

const hovered = ref('')

const quizName = route.params.quizName

const startGame = () => {
  router.push(`/${quizName}/quizzing`)
  quizStore.isQuizInProgress = true
  console.log('max errors', quizStore.maxErrors, typeof quizStore.maxErrors)
}
</script>

<template>
  <div class="page-wrapper">
    <div class="quiz-layout-wrapper">
      <div class="text-area">
        <h1>Choose your quiz mode!</h1>

        <p
          @click="goNumberOfQuestionsMode"
          ref="questionsToggle"
          :style="{
            opacity: !quizStore.infiniteMode ? 1 : hovered === 'questions' ? 0.5 : 0.3,
            transition: 'opacity 0.3s ease-in-out',
          }"
          @mouseover="hovered = 'questions'"
          @mouseleave="hovered = ''"
          class="pointer"
        >
          Enter a number of questions <br />you want to answer
          <input
            v-model="quizStore.numberOfQuestions"
            id="number-of-questions-input"
            type="number"
            min="10"
            max="500"
            placeholder="10 - 500"
          /><br />
        </p>

        <p
          @click="goInfiniteMode"
          ref="infinityToggle"
          :style="{
            opacity: quizStore.infiniteMode ? 1 : hovered === 'infinity' ? 0.5 : 0.3,
            transition: 'opacity 0.3s ease-in-out',
          }"
          @mouseover="hovered = 'infinity'"
          @mouseleave="hovered = ''"
          class="pointer"
        >
          or go
          <button
            class="pointer"
            id="infinite-mode-btn"
            :style="{
              backgroundColor: quizStore.infiniteMode ? '#772e25' : 'inherit',
              color: quizStore.infiniteMode ? 'white' : 'black',
            }"
            :disabled="quizStore.infiniteMode"
          >
            Infinite Mode
          </button>
        </p>

        <ul>
          <li>
            <label class="pointer label">
              <input type="radio" v-model="quizStore.maxErrors" value="0" class="radio" />
              No errors
            </label>
          </li>
          <li>
            <label class="pointer label">
              <input type="radio" v-model="quizStore.maxErrors" value="3" class="radio" />
              3 errors
            </label>
          </li>
          <li>
            <label class="pointer label">
              <input type="radio" v-model="quizStore.maxErrors" value="5" class="radio" />
              5 errors
            </label>
          </li>
        </ul>
      </div>

      <button @click="startGame" id="play-btn">Play!</button>
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}

.page-wrapper {
  height: 100vh;
  background-image: url('https://www.transparenttextures.com/patterns/cartographer.png');

  display: flex;
  justify-content: center;
  align-items: center;
}

.quiz-layout-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-area {
  flex-grow: 1;
  background-color: #edddd4;
  background-image: none;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;

  padding: 4vw 10vh;

  background-color: #edddd4;
  color: #283d3b;
  border: 1px solid #772e25;
  border-radius: 15px;
}

p {
  font-size: 24px;
}

#number-of-questions-input {
  border: none;
  border-radius: 25px;

  min-width: max-content;
  margin: 0 1vw;

  color: #772e25;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  text-align: center;
}

#infinite-mode-btn {
  border: 1px solid #772e25;
  border-radius: 25px;

  font-size: 24px;
  padding: 0.5rem 1rem;
  margin: 0 1vw;
}

/* ERRRRRRROOOOORRRRSSS */
ul {
  list-style-type: none;
  padding: 0;

  margin-top: 3vh;

  display: flex;
  gap: 3vw;
}

li {
  font-size: 20px;
}

.label {
  display: flex;
  align-items: center;
}

.radio {
  margin-right: 1vw;
}

#play-btn {
  margin: 2vh 0 2vh 3vw;
  padding: 1rem 2rem;

  font-size: 2rem;
  font-weight: 800;
  color: white;

  background-color: #772e25;

  border: 1px solid #edddd4;
  border-radius: 25px;

  cursor: pointer;
}
</style>
