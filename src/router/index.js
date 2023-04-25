import { createRouter, createWebHistory } from 'vue-router'
import Auth from '@/views/Auth.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: Auth
    },
    {
      path: '/auth/callback/*',
      beforeEnter(to, from, next) {
        if (to.query.code !== "" && to.query.code !== undefined) {
          store.commit("setCode", to.query.code)
          store.dispatch("initUser").then(() => {
            next("/")
          }).catch(() => {
            next("/auth")
          })
        } else {
          next("/auth")
        }
      }
    },
  ]
})

export default router
