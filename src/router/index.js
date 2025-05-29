import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ChooseQuizMode from '@/views/ChooseQuizMode.vue'
import DynamicQuizView from '@/views/DynamicQuizView.vue'
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
      path: '/choose-quiz-mode',
      name: 'ChooseQuizMode',
      component: ChooseQuizMode,
    },
    {
      path: '/:quizName/choose-quiz-mode',
      name: 'chooseqQuizMode',
      component: ChooseQuizMode,
      props: (route) => ({ quiz: route.params.quizName }),
    },
    {
      path: '/:quizName/quizzing',
      name: 'dynamicQuizView',
      component: DynamicQuizView,
      props: (route) => ({ quiz: route.params.quizName }),
    },
    {
      path: '/:quizName/:endGame',
      name: 'endGameView',
      component: EndGameView,
      // propsQuizName: (route) => ({ quiz: route.params.quizName }),
      props: (route) => ({ endGame: route.params.endGame }),
    },
  ],
})

export default router
