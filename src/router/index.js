import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Auth from "@/views/Auth.vue";
import Callback from "@/views/Callback.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Auth,
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback,
    },
  ],
});

export default router;