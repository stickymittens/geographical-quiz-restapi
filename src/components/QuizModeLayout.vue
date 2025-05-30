<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useRouter, useRoute } from 'vue-router'
import QuizButtons from './QuizButtons.vue'

const quizStore = useQuizStore()
const router = useRouter()
const route = useRoute()

const quizLayoutWrapper = ref(null)
const backgroundImg = ref(null)
const playBtn = ref(null)

const hovered = ref('')

const quizName = computed(() => route.params.quizName)

// //reset values by refreshing
// function resetByRefreshing() {
//   if (route.path.endsWith('/choose-quiz-mode')) {
//     quizStore.resetQuizStore()
//     router.replace('/choose-quiz-mode').then(() => {
//       window.history.pushState(history.state, '', window.location.href)
//     })
//   }
// }

// resetByRefreshing()

const openPageAnimation = () => {
  const el = quizLayoutWrapper.value
  const img = backgroundImg.value
  const btn = playBtn.value

  if (img) {
    img.style.transition = 'left 0.5s ease-out'
    img.style.left = '80vw'
  }

  if (el) {
    el.style.transition = 'opacity 1s ease-out'
    el.style.opacity = '1'
  }

  if (btn) {
    btn.style.transition = 'opacity 1s ease-out'
    btn.style.opacity = '1'
  }
}

onMounted(() => {
  setTimeout(() => {
    openPageAnimation()
  }, 100)
})

onMounted(() => {
  const route = useRoute()

  if (route.path.endsWith('/choose-quiz-mode')) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        openPageAnimation()
      })
    })
  }
})

const goInfiniteMode = () => {
  quizStore.infiniteMode = true
}

const goNumberOfQuestionsMode = () => {
  quizStore.infiniteMode = false
}

const nextPageAnimation = () => {
  const el = quizLayoutWrapper.value
  const img = backgroundImg.value

  if (el) {
    el.style.transition = 'left 1s ease-out'
    el.style.left = '-100vw'

    if (img) {
      img.style.transition = 'left 1s ease-out'
      img.style.left = '-35vw'
    }
  }
}

const startGame = () => {
  nextPageAnimation()

  setTimeout(() => {
    router.push(`/${quizName.value}/quizzing`)
    quizStore.isQuizInProgress = true
  }, 1200)
}
</script>

<template>
  <div class="page-wrapper">
    <img
      ref="backgroundImg"
      id="background-image"
      src="https://plus.unsplash.com/premium_vector-1711920037357-029f344f7cfc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D
"
    />
    <div ref="quizLayoutWrapper" class="quiz-layout-wrapper">
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
            id="infinity-mode-btn"
            :style="{
              backgroundColor: quizStore.infiniteMode ? '#eb5d3d' : 'inherit',
              color: quizStore.infiniteMode ? 'white' : 'black',
            }"
            :disabled="quizStore.infiniteMode"
          >
            Infinite Mode
          </button>
        </p>

        <ul>
          <li>
            <label class="pointer label errors">
              <input type="radio" v-model="quizStore.maxErrors" value="0" class="radio" />
              No errors
            </label>
          </li>
          <li>
            <label class="pointer label errors">
              <input type="radio" v-model="quizStore.maxErrors" value="3" class="radio" />
              3 errors
            </label>
          </li>
          <li>
            <label class="pointer label errors">
              <input type="radio" v-model="quizStore.maxErrors" value="5" class="radio" />
              5 errors
            </label>
          </li>
        </ul>
      </div>

      <div class="buttons-wrapper">
        <p id="change-quiz">or change your quiz</p>
        <QuizButtons />
      </div>
    </div>

    <button ref="playBtn" @click="startGame" id="play-btn">Play!</button>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}

.page-wrapper {
  position: relative;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

#background-image {
  transform: scaleX(-1);

  position: absolute;
  left: 100vw;
  bottom: 0;
  border-left: 0.5px solid #f1e2d6;
  border-right: 0.5px solid #f1e2d6;

  height: 100%;

  z-index: 0;
}

.buttons-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;

  z-index: 1;
}

.quiz-layout-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4vh;

  align-items: center;

  width: max-content;
  z-index: 1;

  opacity: 1;
}

.text-area {
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(1.5vw + 1vh);

  padding-top: 5vh;
  padding-bottom: 5vh;

  padding-left: 5vw;
  padding-right: 5vw;

  background-color: #f1e2d6;
  color: black;
  border-radius: 25px;
}

#number-of-questions-input {
  border: none;
  border-radius: 25px;

  width: 12ch;
  margin: 0 1vw;

  color: #eb5d3d;
  font-weight: 500;
  padding: 0.5rem 1rem;
  text-align: center;
}

#infinity-mode-btn {
  border: 1px solid #eb5d3d;
  border-radius: 25px;

  padding: 0.5vh 1vw;
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

.label {
  display: flex;
  align-items: center;
}

.radio {
  margin-right: 1vw;
}

input[type='radio'] {
  appearance: none;
  position: relative;

  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.5);
}

input[type='radio']:checked::after {
  content: '';
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 14px;
  height: 14px;
  background-color: #eb5d3d;
  border-radius: 50%;
  transition: all 0.2s ease-in;
}

input[type='radio']:not(:checked)::after {
  content: '';
  position: absolute;
  top: 2.5px;
  left: 2.5px;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.2s ease-out;
}

#play-btn {
  margin-left: 3vw;
  padding: 1rem 2rem;

  font-weight: 800;
  color: white;

  background-color: #fab662;

  border: 1px solid #f1e2d6;
  border-radius: clamp(25px, 5vw, 48px);

  cursor: pointer;

  z-index: 1;
  opacity: 0;
}

/* RESPONSIVE FONT MANAGEMENT */
h1 {
  font-size: clamp(1.4rem, 1.75vw + 1.75vh, 3.5rem);
}

p {
  font-size: clamp(1.2rem, 1.5vw + 0.5vh, 2.5rem);
}

#number-of-questions-input {
  font-size: clamp(0.87rem, 0.75vw + 0.75vh, 1.5rem);
}

input::placeholder {
  font-size: clamp(0.85rem, 0.65vw + 0.65vh, 1.2rem);
  font-style: italic;
}

#infinity-mode-btn {
  font-size: clamp(1.2rem, 1.5vw + 0.5vh, 2.5rem);
}

.errors,
#change-quiz {
  font-size: clamp(0.95rem, 1.2vw + 0.8vh, 2.4rem);
}

#play-btn {
  font-size: clamp(1.3rem, 1.5vw + 1.5vh, 3.2rem);
}

/* MOBILE DEVICES */
@media (max-width: 768px) {
  .page-wrapper {
    flex-direction: column;
    align-items: center;

    gap: 4vh;
  }

  .quiz-layout-wrapper {
    gap: 2vh;
  }

  .text-area {
    /* width: 95vw; */
    gap: 3vh;

    padding-left: 7vw;
    padding-right: 7vw;

    width: 80vw;
  }

  /* errors ul  */
  ul {
    gap: 5vw;
  }

  #infinity-mode-btn {
    padding: 0.5rem;
  }

  #play-btn {
    margin-left: 0;
    width: 80vw;
    /* width: 95vw; */
  }
}

@media (max-width: 430px) {
  .text-area {
    width: 96vw;
    gap: 3vh;

    padding-left: 7vw;
    padding-right: 7vw;
  }

  #play-btn {
    margin-left: 0;
    width: 90vw;
  }
}
</style>
