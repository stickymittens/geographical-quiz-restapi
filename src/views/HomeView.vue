<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
// import QuizButtons from '@/components/QuizButtons.vue'
// import { useQuizStore } from '@/stores/quizStore'

const router = useRouter()

const backgroundImg = ref(null)
const quizzesWrapper = ref(null)
// const question = ref(null)

// const buttonsDisabled = ref(null)
// const quizStore = useQuizStore()

//from endGame + remember to add teh same forceHomeReload in other components for thsi to refresh
onMounted(() => {
  const cameFromRedirect = sessionStorage.getItem('forceHomeReload')

  if (cameFromRedirect === 'true') {
    sessionStorage.removeItem('forceHomeReload')
    window.location.reload()
  }
})

const openPageAnimation = () => {
  const el1 = backgroundImg.value
  if (el1) {
    el1.style.transition = 'left 1s ease'
    el1.style.transitionDelay = '0.5s'
    el1.style.left = '-25vw'
  }

  const el2 = quizzesWrapper.value
  if (el2) {
    el2.style.transition = 'width 1s ease'
    el2.style.transitionDelay = '0.5s'
    el2.style.width = '65vw'
  }

  const elements = quizzesWrapper.value?.children
  if (elements) {
    const firstChild = elements[0]
    firstChild.style.transition = 'opacity 1s ease'
    firstChild.style.transitionDelay = '0.8s'
    firstChild.style.opacity = 1

    Array.from(elements)
      .slice(1)
      .forEach((element, index) => {
        setTimeout(() => {
          setTimeout(
            () => {
              element.style.transition = 'opacity 0.8s ease'
              element.style.opacity = 1
            },
            (index + 1) * 200,
          )
        }, 1200)
      })
  }
}

//ANIMATION RELOADS EVERY TIME THIS VIEW IS OPEN/NAVIGATED BACK TO
onMounted(() => {
  const route = useRoute()

  if (route.path === '/') {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        openPageAnimation()
      })
    })
  }
})

const nextPageAnimation = () => {
  const elements = quizzesWrapper.value?.children

  if (elements) {
    const firstChild = elements[0]
    firstChild.style.transition = 'opacity 1s ease'
    firstChild.style.opacity = 0

    Array.from(elements)
      .slice(1)
      .forEach((element, index) => {
        setTimeout(() => {
          setTimeout(
            () => {
              element.style.transition = 'opacity 0.5s ease'
              element.style.opacity = 0
            },
            (index + 1) * 150,
          )
        }, 0)
      })
  }

  const el = quizzesWrapper.value
  if (el) {
    el.style.transition = 'width 1s ease'
    el.style.transitionDelay = '1.5s'
    el.style.width = '100vw'
  }
}

// const chooseQuiz = (quizName) => {
//   quizStore.chosenQuiz = quizName
//   buttonsDisabled.value = true

//   nextPageAnimation()

//   setTimeout(() => {
//     router.replace(`/${quizName}/choose-quiz-mode`)
//   }, 200)
// }

const play = () => {
  nextPageAnimation()
  setTimeout(() => {
    router.replace(`/choose-quiz-mode`)
  }, 200)
}
</script>

<template>
  <div class="home-wrapper">
    <div class="background">
      <img
        ref="backgroundImg"
        src="https://plus.unsplash.com/premium_vector-1711920037357-029f344f7cfc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D
"
      />
    </div>
    <button @click="play()" id="play-btn">Play</button>
    <!-- <div ref="quizzesWrapper" class="quizzes-wrapper"> -->
    <!-- <h1 ref="question">
        Which quiz
        <span class="line-break"> </span>
        are you taking today?
      </h1>
      <QuizButtons /> -->
    <!-- <div @click="chooseQuiz('capitals')" :class="['quiz', { disabled: buttonsDisabled }]">
        Capitals
      </div>
      <div @click="chooseQuiz('countries')" :class="['quiz', { disabled: buttonsDisabled }]">
        Continents
      </div>
      <div @click="chooseQuiz('population')" :class="['quiz', { disabled: buttonsDisabled }]">
        Population
      </div>
      <div @click="chooseQuiz('language')" :class="['quiz', { disabled: buttonsDisabled }]">
        Language
      </div> -->
    <!-- quizzes wrapper -->
    <!-- </div> -->
  </div>
</template>

<style scoped>
.home-wrapper {
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10vh;

  min-height: 100vh;

  background-color: #2f4e9f;

  height: 100vh;
  width: 100vw;

  overflow: hidden;
}

.background {
  position: relative;
  height: 100%;
}

img {
  position: absolute;
  height: 100%;

  left: 0;
  bottom: 0;
}

/* .quizzes-wrapper {
  position: absolute;

  right: 0;

  height: 100%;
  width: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2vw;

  background-color: #749cd4;
  border-left: 0.5px #f1e2d6 solid;
} */

/* @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap'); */
/* h1 {
  z-index: 10;

  opacity: 0;

  text-align: center;
  font-style: italic;
  font-weight: 200;
  color: #f1e2d6;

  width: 65vw;

  margin-bottom: 2vh;

} */

/* .line-break {
  display: none;
}

.quiz {
  z-index: 10;

  opacity: 0;

  color: black;
  background-color: #f1e2d6;

  border-radius: 25px;

  width: 12ch;
  padding: 1rem 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  cursor: pointer;
} */

/* .quiz:hover {
  color: white;
  background-color: #fab662;
}

.quiz.disabled {
  pointer-events: none;
  user-select: none;
  cursor: not-allowed;
} */

/* RESPONSIVE FONT MANAGEMENT */
button {
  font-size: clamp(2rem, 2vw + 1.4vh, 5rem);
}

#play-btn {
  padding: 1rem 2rem;
  margin-right: 10vw;

  font-weight: 800;
  color: white;

  background-color: #fab662;

  border: 1px solid #f1e2d6;
  border-radius: clamp(25px, 5vw, 48px);

  cursor: pointer;

  z-index: 10;

  /* transition: all 0.5s ease; */
}

/* @media (max-width: 768px) {
  .line-break {
    display: block; 
    width: 100%;
  }
} */
</style>
