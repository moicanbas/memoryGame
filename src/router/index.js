import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Game from "../components/Game.vue";
import Scores from "../components/Scores.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { 
    path: "/game", 
    name: "game", 
    component: Game,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("memory-player")) {
        next({ name: "home" });
      } else {
        next();
      }
    }
  },
  { path: "/scores", name: "scores", component: Scores },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
