<script setup>
import { useQuizStore } from '@/stores/quizStore'
import { useRouter } from 'vue-router'

const quizStore = useQuizStore()
const router = useRouter()

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
</script>
<template>
  <div class="navbar-wrapper">
    <ul>
      <li id="home-page" @click="homePageBtn">Home Page</li>
      <li>How to play?</li>
      <li>Scoreboards</li>
      <li>Profile/Log in</li>
    </ul>
  </div>
</template>

<style scoped>
.navbar-wrapper {
  width: 100vw;

  position: relative;

  background-color: #f1e2d6;
  color: #633851;

  font-size: clamp(1rem, 1vw + 0.5vh, 4.5rem);
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
