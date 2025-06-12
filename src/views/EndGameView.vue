<script setup>
import { useQuizStore } from '@/stores/quizStore'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const quizStore = useQuizStore()

const route = useRoute()
const router = useRouter()
const endGame = route.params.endGame
const quizName = route.params.quizName

//openpage animation
const youWonLost = ref(null)

//funct changing colors
const option1Refs = ref([])
const option2Refs = ref([])
const optionValue1Refs = ref([])
const optionValue2Refs = ref([])

//Handling browser refresh, close, or navigate away
function handleBeforeUnload(event) {
  event.preventDefault()
  event.returnValue = ''

  // Flag to reset quiz after reload
  localStorage.setItem('decidedToLeave', 'true')
}

onMounted(() => {
  if (localStorage.getItem('decidedToLeave') === 'true') {
    quizStore.resetQuizStore()
    localStorage.removeItem('decidedToLeave')
    router.replace('/')
    return
  }
})

function handleBackButton() {
  quizStore.resetQuizStore()

  // Replace current route with home
  sessionStorage.setItem('forceHomeReload', 'true')
  router.replace('/').then(() => {
    window.history.pushState(history.state, '', window.location.href)
  })

  // Push dummy state so browser "back" does nothing from now on
  setTimeout(() => {
    window.history.pushState(history.state, '', window.location.href)
  }, 100)
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.history.pushState(history.state, '', window.location.href)
  window.addEventListener('popstate', handleBackButton)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('popstate', handleBackButton)
})

//OPEN PAGE ANIMATION
const openPageAnimation = () => {
  const banner = youWonLost.value

  if (banner) {
    // Animate the banner from the left
    banner.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out'
    banner.style.transform = 'translateX(0)'
    banner.style.opacity = '1'
  }

  const bannerTexts1 = document.querySelectorAll('.banner-text-1')
  bannerTexts1.forEach((text) => {
    text.style.transition = 'opacity 0.3s ease-out'
    text.style.transitionDelay = '0.6s'
    text.style.opacity = '1'
  })

  const bannerTexts2 = document.querySelectorAll('.banner-text-2')
  bannerTexts2.forEach((text) => {
    text.style.transition = 'opacity 0.3s ease-out'
    text.style.transitionDelay = '0.9s'
    text.style.opacity = '1'
  })

  const optionBlocks = document.querySelectorAll('.options')
  optionBlocks.forEach((block) => {
    block.style.transition = 'opacity 0.4s ease-out'
    block.style.transitionDelay = '1.4s'
    block.style.opacity = '1'
  })

  const arrows = document.querySelectorAll('.arrows')
  arrows.forEach((arrow) => {
    arrow.style.transition = 'opacity 0.4s ease-out'
    arrow.style.transitionDelay = '1.8s'
    arrow.style.opacity = '1'
  })
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    openPageAnimation()
  })
})

//inifnity - current & best score
let currentScore = quizStore.questionIndex - quizStore.incorrectsArray.length - 1
let best = quizStore.bestInfinityScore

if (currentScore > quizStore.bestInfinityScore) {
  quizStore.bestInfinityScore = currentScore
}

//funct changing colors of the correct/incorrect option
function changeOptionColors() {
  quizStore.incorrectsArray.forEach((item, index) => {
    const chosenOption = item.chosenOption
    const option1 = option1Refs.value[index]
    const option2 = option2Refs.value[index]
    const value1 = optionValue1Refs.value[index]
    const value2 = optionValue2Refs.value[index]

    if (chosenOption === 1) {
      option1.style.color = 'red'
      value1.style.color = 'red'

      option2.style.color = 'green'
      option2.style.opacity = '0.5'
      value2.style.color = 'green'
      value2.style.opacity = '0.5'
    } else if (chosenOption === 2) {
      option1.style.color = 'green'
      option1.style.opacity = '0.5'
      value1.style.color = 'green'
      value1.style.opacity = '0.5'

      option2.style.color = 'red'
      value2.style.color = 'red'
    }
  })
}

onMounted(() => {
  changeOptionColors()
})

function replaySameSettings() {
  quizStore.resetToReplay()
  router.replace(`/${quizName}/quizzing`)
}

function replayDiffSettings() {
  quizStore.resetQuizStore()
  router.replace(`/choose-quiz-mode`)
}

//ARROWS
// const optionsWrap = document.querySelector('.options-wrap')
// const arrowLeft = document.getElementById('arrow1')
// const arrowRight = document.getElementById('arrow2')

// if (optionsWrap && arrowLeft && arrowRight) {
//   function updateArrowVisibility() {
//     const canScrollLeft = optionsWrap.scrollLeft > 0
//     const canScrollRight =
//       optionsWrap.scrollWidth > optionsWrap.clientWidth + optionsWrap.scrollLeft

//     arrowLeft.style.display = canScrollLeft ? 'block' : 'none'
//     arrowRight.style.display = canScrollRight ? 'block' : 'none'

//     if (canScrollLeft || canScrollRight) {
//       optionsWrap.classList.add('scrollable')
//     } else {
//       optionsWrap.classList.remove('scrollable')
//     }
//   }

//   function scrollOptions(direction) {
//     const scrollAmount = optionsWrap.clientWidth * 0.8
//     optionsWrap.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth',
//     })
//   }

//   arrowLeft.addEventListener('click', () => scrollOptions('left'))
//   arrowRight.addEventListener('click', () => scrollOptions('right'))
//   optionsWrap.addEventListener('scroll', updateArrowVisibility)
//   window.addEventListener('resize', updateArrowVisibility)

//   updateArrowVisibility()
// }

//ARROWS END
</script>

<template>
  <div class="wrapper">
    <div ref="youWonLost" class="banner">
      <div v-if="endGame === 'you-won'" class="won">
        <h1 class="banner-text-1">You won</h1>
        <h2 class="banner-text-2">YOUR SCORE: {{ currentScore }}</h2>
      </div>

      <div v-if="endGame === 'you-lost'" class="lost">
        <h1 class="banner-text-1">You Lost 😔</h1>
        <h2 class="banner-text-2">
          YOUR SCORE:
          {{ currentScore }}
        </h2>
      </div>
    </div>

    <div v-if="endGame === 'save-infinity-score'" class="infinity-mode-wrapper">
      <div class="infinity-mode">
        <h1>INFINITY MODE</h1>
        <p>Your current score is {{ currentScore }}</p>
        <p>Your best score is {{ quizStore.bestInfinityScore }}</p>
      </div>
      <p v-if="currentScore > best" id="new-best">🎉 You achieved a new highest score! 🎉</p>
    </div>

    <div v-if="quizStore.incorrectsArray.length > 0" class="options-wrap">
      <div v-for="(item, index) in quizStore.incorrectsArray" :key="index" class="options">
        <div class="arrow-left arrows" v-if="index !== 0">&#8592;</div>
        <div class="wrapper-option-1">
          <p :ref="(el) => (option1Refs[index] = el)" class="option1">
            {{ item.option1 }}
          </p>
          <p :ref="(el) => (optionValue1Refs[index] = el)" class="option-value1">
            {{ item.optionValue1 }}
          </p>
        </div>
        <div class="wrapper-option-2">
          <p :ref="(el) => (option2Refs[index] = el)" class="option2">
            {{ item.option2 }}
          </p>
          <p :ref="(el) => (optionValue2Refs[index] = el)" class="option-value2">
            {{ item.optionValue2 }}
            <!-- Afrikaans, English, Southern Ndebele, Northern Sotho and Southern Sotho -->
          </p>
        </div>
        <div class="arrow-right arrows" v-if="index !== quizStore.incorrectsArray.length - 1">
          &#8594;
        </div>
      </div>
    </div>
    <div v-else id="no-errors">🎉 No errors 🎉</div>

    <div class="replay">
      <div class="replay-wrapper">
        <button @click="replaySameSettings()" id="replay-btn">Replay</button>
        <p id="invisible-text">insisible text</p>
      </div>
      <div @click="replayDiffSettings()" class="diff-settings-wrapper">
        <button id="diff-settings-btn">Replay</button>
        <p id="visible-text">with different settings</p>
      </div>
      <!-- replay -->
    </div>
  </div>
</template>

<style scoped>
/* correct #55b34bce
incorrect #f44336ce */

.wrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  padding-top: 15vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  background-color: #749cd4;
  /* background-color: yellow; */

  overflow: hidden;
}

.infinity-mode-wrapper {
  width: 100vw;
}

.banner {
  opacity: 0;
  transform: translateX(-100%);
}

.banner-text-1 {
  font-weight: 600;
}

.banner-text-1,
.banner-text-2 {
  opacity: 0;
}

.won,
.lost,
.infinity-mode,
#new-best {
  text-align: center;

  padding: 2vh 0;

  width: 100vw;
  background-color: #f1e2d6;
  color: #633851;
}

#new-best {
  font-weight: 600;
}

.options-wrap {
  position: relative;
  width: 100vw;

  display: flex;

  overflow-x: scroll;
  scroll-snap-type: x mandatory; /* Change this to mandatory */
  scroll-behavior: smooth;

  scroll-padding-left: 10vw;
  scroll-padding-right: 10vw; /* Ensures items stay away from left edge */
  padding: 0 10vw;

  margin: 2vh 0;

  /* background-color: pink; */
}

.options-wrap {
  scrollbar-width: none; /* Firefox */
}
.options-wrap::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.options {
  position: relative;

  display: flex;
  justify-content: center;
  /* background-color: darkblue; */

  scroll-snap-align: center; /* Center the item when snapping */

  width: 80vw; /* Ensures one item fits within the screen */
  flex-shrink: 0; /* Prevent shrinking if content overflows */

  margin-right: 10vw;

  opacity: 0;
}

.optionsValues {
  z-index: 10;
}

.wrapper-option-1,
.wrapper-option-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
}

.option1,
.option2 {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  height: 8rem;
  width: 25vw;

  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin: 0 2vw;

  background-color: #f1e2d6;

  border: 3px solid transparent;
}

.option-value1,
.option-value2 {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  height: 10rem;
  width: 25vw;

  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin: 0 2vw;

  background-color: #f1e2d6;
  color: black;

  border: 3px solid transparent;
}

/* REPLAY */
.replay {
  background-color: #2f4d9d;

  width: 100%;
  height: max-content;
  padding: 2vh 0 1vh 0;

  border-top: 0.5px #f1e2d6 solid;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10vw;
}

.diff-settings-wrapper,
.replay-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#invisible-text {
  color: #2f4d9d;
  pointer-events: none;
}

#replay-btn,
#diff-settings-btn {
  padding: 1rem 2rem;

  font-weight: 800;
  color: white;

  background-color: #fab662;

  border: 1px solid #f1e2d6;
  border-radius: clamp(25px, 5vw, 48px);

  cursor: pointer;
}

#visible-text {
  text-align: center;
  font-style: italic;
  font-weight: 200;
}

.quizzes-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
}

.quiz {
  opacity: 1;

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

.quiz.disabled {
  pointer-events: none;
  user-select: none;
  cursor: not-allowed;
}

#no-errors {
  top: 50%;
  transform: translateY(-50%);

  color: white;
  opacity: 1;

  background-color: #fab662;
  width: 100vw;
  text-align: center;
}

/*ARROWS*/

.arrow-left,
.arrow-right {
  position: absolute;
  top: 45%;
  transform: translateY(-55%);

  font-size: 2rem;
  color: #f1e2d67e;

  cursor: pointer;
  z-index: 10;
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}

/* Always show arrows on small screens if scrollable */

/* Only show on hover if scrollable */
/* @media (min-width: 769px) {
  .options-wrap.scrollable:hover .arrow-left,
  .options-wrap.scrollable:hover .arrow-right {
    display: block;
  }
} */

/* Always show arrows on small screens if scrollable */
@media (max-width: 430px) {
  .arrow-left,
  .arrow-right {
    font-size: 1rem;
  }
}

@media ((min-width: 431px) and (max-width: 768px)) {
  .arrow-left,
  .arrow-right {
    font-size: 1.5rem;
  }
}

/*ARROWS END */

/* RESPONSIVE FONT MANAGEMENT */
#replay-btn,
#diff-settings-btn,
#new-best {
  font-size: clamp(1rem, 0.85vw + 0.85vh, 2rem);
}

#invisible-text,
#visible-text {
  font-size: clamp(0.875rem, 0.7vw + 0.7vh, 1rem);
}

.option1,
.option2 {
  font-size: clamp(0.875rem, 1.2vw + 1vh, 2.5rem);
}

.option-value1,
.option-value2 {
  font-size: clamp(0.875rem, 1.2vw + 0.8vh, 2.3rem);
}

#no-errors {
  font-size: clamp(2rem, 3vw + 4vh, 5rem);
}

@media (max-width: 1024px) {
  .options-wrap {
    scroll-padding-left: 2vw;
    scroll-padding-right: 2vw;
    padding: 0 2vw;
  }

  .options {
    width: 96vw;
    margin-right: 2vw;
  }

  .option1,
  .option2 {
    width: 35vw;
  }

  .option-value1,
  .option-value2 {
    width: 35vw;
  }
}

@media (max-width: 430px) {
  .options-wrap {
    scroll-padding-left: 2vw;
    scroll-padding-right: 2vw;
    padding: 0 2vw;
  }

  .options {
    width: 96vw;
  }

  .option1,
  .option2 {
    width: 44vw;
  }

  .option-value1,
  .option-value2 {
    width: 44vw;
  }
}
</style>
