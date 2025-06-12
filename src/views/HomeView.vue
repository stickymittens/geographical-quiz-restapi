<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const backgroundImg = ref(null)
const playBtn = ref(null)
const layer = ref(null)

//from endGame + remember to add teh same forceHomeReload in other components for thsi to refresh
onMounted(() => {
  const cameFromRedirect = sessionStorage.getItem('forceHomeReload')

  if (cameFromRedirect === 'true') {
    sessionStorage.removeItem('forceHomeReload')
    window.location.reload()
  }
})

const openPageAnimation = () => {
  const img = backgroundImg.value
  const btn = playBtn.value

  if (img) {
    img.style.transition = 'left 1.1s ease-out'
    img.style.transitionDelay = '0.3s'
    img.style.left = '-10vw'
  }

  if (btn) {
    btn.style.transition = 'opacity 0.2s ease'
    btn.style.transitionDelay = '0.9s'
    btn.style.opacity = '1'
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

const displayLayer = () => {
  if (layer.value) {
    layer.value.style.opacity = '0.3'
  } else {
    console.warn('layer not yet mounted')
  }
}

const hideLayer = () => {
  if (layer.value) {
    layer.value.style.opacity = '0'
  } else {
    console.warn('layer not yet mounted')
  }
}

const nextPageAnimation = () => {
  const img = backgroundImg.value
  const btn = playBtn.value

  if (img) {
    img.style.transition = 'left 1s ease'
    // img.style.transitionDelay = '0.5s'
    img.style.left = '-150vw'
  }

  if (btn) {
    btn.style.transition = 'opacity 0.3s ease'
    btn.style.transitionDelay = '0.7s'
    btn.style.opacity = '0'
  }
}

const play = () => {
  nextPageAnimation()
  setTimeout(() => {
    router.replace(`/choose-quiz-mode`)
  }, 1100)
}
</script>

<template>
  <div ref="homeWrapper" class="home-wrapper">
    <div class="background">
      <img
        ref="backgroundImg"
        src="https://plus.unsplash.com/premium_vector-1711920037357-029f344f7cfc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D
"
      />
    </div>
    <button
      ref="playBtn"
      @click="play()"
      @mouseenter="displayLayer()"
      @mouseleave="hideLayer"
      id="play-btn"
    >
      Play
    </button>
  </div>

  <div ref="layer" id="layer"></div>
</template>

<style scoped>
.home-wrapper {
  position: relative;

  display: flex;
  /* justify-content: center; */
  align-items: center;

  background-color: #2f4e9f;
  height: 100vh;
  width: 100vw;

  overflow: hidden;
}

.background {
  height: 100%;
}

img {
  position: absolute;
  height: 100%;

  left: 0;
  bottom: 0;
}

#play-btn {
  /* position: absolute; */
  margin-left: 60vw;
  padding: 1.7rem 4rem;

  font-weight: 800;
  color: white;

  background-color: #fab662;

  border: 5px solid #f1e2d6;
  border-radius: 50px;

  cursor: pointer;

  z-index: 10;
  opacity: 0;

  /* transition: all 5s ease; */
}

#layer {
  position: absolute;
  left: 0;
  top: 0;

  height: 100vh;
  width: 100vw;
  background-color: white;

  opacity: 0;
  z-index: 5;

  transition: opacity 0.3s ease;
}

/* RESPONSIVE FONT MANAGEMENT */
button {
  font-size: clamp(2rem, 3vw + 2.5vh, 4rem);
}

@media (max-width: 1024px) {
  #play-btn {
    padding: 1.7rem 3.2rem;
  }

  img {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  #play-btn {
    margin-left: 60vw;
  }
}

@media (max-width: 430px) {
  #play-btn {
    padding: 0.7rem 1.8rem;
    margin-left: 10vw;
  }
}
</style>
