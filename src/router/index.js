import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ChooseQuizMode from '@/views/ChooseQuizMode.vue'
import QuizView from '@/views/PopulationQuiz.vue'
import EndGameView from '@/views/EndGameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:quizName/choose-quiz-mode',
      name: 'chooseqQuizMode',
      component: ChooseQuizMode,
      props: (route) => ({ quiz: route.params.quizName }),
    },
    {
      path: '/:quizName/quizzing',
      name: 'quizView',
      component: QuizView,
    },
    {
      path: '/:endGame',
      name: 'endGameView',
      component: EndGameView,
      props: (route) => ({ endGame: route.params.endGame }),
    },
  ],
})

export default router
