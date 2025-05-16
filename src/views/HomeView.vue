<script setup>
// import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useCountryStore } from '@/stores/useCountryStore'

const router = useRouter()

// const countryStore = useCountryStore()

// onMounted(() => {
//   countryStore.fetchCountries()
// })

// const countries = countryStore.countries
// console.log(countries)

const chooseQuiz = (quizName) => {
  router.push(`/${quizName}/choose-quiz-mode`)
}
</script>

<template>
  <div class="home-wrapper">
    <!-- <div class="section-wrapper">
      <div>
        <img
          src="/Users/karolina/Documents/met-stats-but-pretty/src/components/icons/warmups.png"
          alt="Warm-ups"
          id="warmups"
        />
      </div>
      <div class="quizzes-wrapper">
        <div class="quiz">Capitals</div>
        <div class="quiz">Continents</div>
      </div>
    </div> -->

    <div class="section-wrapper">
      <div>
        <!-- <img
          src="/Users/karolina/Documents/met-stats-but-pretty/src/components/icons/quizzes.png"
          alt="Quizzes"
          id="quizzes"
        /> -->
        <h1>Quizzes</h1>
      </div>
      <div class="quizzes-wrapper">
        <div @click="chooseQuiz('capitals')" class="quiz">Capitals</div>
        <div @click="chooseQuiz('continents')" class="quiz">Continents</div>
        <div @click="chooseQuiz('population')" class="quiz">Population</div>
        <div @click="chooseQuiz('language')" class="quiz">Language</div>
      </div>
    </div>
  </div>

  <div>
    <!-- <h1>Country List</h1>
    <ul>
      <li v-for="country in countries" :key="country.name">
        {{ country.name }}
        <br />
        Capital: {{ country.capital || 'Unknown' }}
        <br />
        Languages: {{ country.languages || 'Unknown' }}
        <br />
        Population: {{ country.population || 'Unknown' }}
        <br />
        Continents: {{ country.continents || 'Unknown' }}
      </li>
    </ul> -->
  </div>
</template>

<style scoped>
.home-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10vh;

  min-height: 100vh;

  background-image: url('https://www.transparenttextures.com/patterns/cartographer.png');
}

.section-wrapper {
  display: flex;
  justify-content: center;

  flex-direction: column;
  text-align: center;

  gap: 5vh;

  z-index: 1;
  background-color: #edddd4;
  padding: 5vh 10vw;
  border-radius: 25px;
  width: max-content;
  max-width: 80%;
}

.quizzes-wrapper {
  display: flex;
  justify-content: center;
  gap: 5vw;
}

.quiz {
  /* background-color: #edddd4; */

  color: black;
  font-size: 18px;
  font-weight: 500;

  border: 1px solid #772e25;
  border-radius: 15px;

  width: 15vw;
  padding: 1rem 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  cursor: pointer;
}

img {
  z-index: -1;

  height: 10%;
  width: 20%;
}

h1 {
  color: #772e25;
}
</style>
