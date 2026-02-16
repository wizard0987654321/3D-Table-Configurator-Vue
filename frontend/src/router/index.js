import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthenticationView from '../views/AuthenticationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthenticationView,
    },
    {
      path: '/scene',
      name: 'scene',
      component: () => import('../views/SceneView.vue'),
    },
    {
      path: '/saved-configurations',
      name: 'saved-configurations',
      component: () => import('../views/SavedConfigurationsView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
  ],
})

export default router
