<script setup>
import { useQuizStore } from '@/stores/quizStore'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const quizStore = useQuizStore()
const router = useRouter()
const route = useRoute()
const isNavBarVisible = ref(false)
const navBarSmallDevices = ref(null)
const hamburgerMenu = ref(null)

//reading width for small devices option
const width = ref(window.innerWidth)

function updateWidth() {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

function homePageBtn() {
  if (quizStore.isQuizInProgress) {
    const confirmLeave = confirm('You will lose all your progress. Are you sure?')
    if (!confirmLeave) {
      window.history.pushState(history.state, '', window.location.href)
      return
    }
    quizStore.resetQuizStore()
  } else {
    quizStore.resetQuizStore()
  }

  if (router.currentRoute.value.fullPath === '/') {
    // Already on home — force reload
    window.location.reload()
  } else {
    sessionStorage.setItem('forceHomeReload', 'true')
    router.replace('/').then(() => {
      window.history.pushState(history.state, '', window.location.href)
    })
  }
}

function goToChooseQuizMode() {
  if (route.path.endsWith('/choose-quiz-mode')) {
    // window.location.reload()
    quizStore.resetQuizStore()
    router.replace('/choose-quiz-mode').then(() => {
      window.history.pushState(history.state, '', window.location.href)
    })
  } else {
    if (quizStore.isQuizInProgress) {
      const confirmLeave = confirm('You will lose all your progress. Are you sure?')
      if (!confirmLeave) {
        window.history.pushState(history.state, '', window.location.href)
        return
      }
      quizStore.resetQuizStore()
    } else {
      quizStore.resetQuizStore()
      router.replace('/choose-quiz-mode').then(() => {
        window.history.pushState(history.state, '', window.location.href)
      })
    }
  }
}

function toggleNavBarSmallDevices() {
  isNavBarVisible.value = !isNavBarVisible.value

  hamburgerMenu.value?.chil

  if (isNavBarVisible.value === true) {
    navBarSmallDevices.value.style.height = '100vh'
    Array.from(hamburgerMenu.value.children).forEach((child) => {
      child.style.backgroundColor = '#2d4c9d'
    })
  } else {
    navBarSmallDevices.value.style.height = '0vh'
    Array.from(hamburgerMenu.value.children).forEach((child) => {
      child.style.backgroundColor = '#f1e2d6'
    })
  }
}
</script>

<template>
  <div v-if="width > 430" class="navbar-wrapper">
    <ul>
      <li id="home-page" @click="homePageBtn">Home Page</li>
      <li>How to play?</li>
      <li @click="goToChooseQuizMode">Quizzes and Settings</li>
    </ul>
  </div>

  <div v-else>
    <div
      @click="toggleNavBarSmallDevices"
      ref="hamburgerMenu"
      class="hamburger-menu"
      alt="navigation bar button"
    >
      <div class="hamburger-menu-item"></div>
      <div class="hamburger-menu-item"></div>
      <div class="hamburger-menu-item"></div>
    </div>
    <div ref="navBarSmallDevices" :class="['navbar-small-devices', { visible: isNavBarVisible }]">
      <ul class="ul-small-devices">
        <li @click="homePageBtn" class="li-small-devices">Home Page</li>
        <li class="li-small-devices">How to play?</li>
        <li class="li-small-devices">Quizzes and Settings</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  position: relative;

  width: 100vw;
  height: 8vh;

  display: flex;
  align-items: center;
  justify-content: end;

  background-color: #f1e2d6;
  color: #633851;

  font-size: clamp(1rem, 1vw + 1vh, 4.5rem);
}

.hamburger-menu {
  position: absolute;
  top: 4vw;
  right: 2vh;

  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hamburger-menu-item {
  height: 3px;
  width: 30px;

  border-radius: 25px;

  background-color: #f1e2d6;
}

.navbar-small-devices {
  background-color: #f1e2d6;
  color: #633851;

  width: 100vw;
  height: 0;

  opacity: 0;
  pointer-events: none;
}

.navbar-small-devices.visible {
  opacity: 1;
  pointer-events: auto;
}

.ul-small-devices {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: #eb5d3d; */
}

.li-small-devices {
  font-size: clamp(1rem, 2vw + 3vh, 8rem);

  padding: 0.5rem;

  width: 100%;
  border-top: 0.5px solid #633851;
  /* border-bottom: 0.5px solid #633851; */
}

.li-small-devices:first-child {
  border-top: none;
}

.li-small-devices:last-child {
  border-bottom: none;
}

ul {
  list-style: none;
  padding: 2vh 5vw;

  display: flex;
  flex-direction: row;
  justify-content: right;
  gap: 3vw;
}

li:hover {
  color: #eb5d3d;
}

#home-page {
  position: absolute;
  left: 5vw;
}

@media (max-width: 768px) {
}
</style>
