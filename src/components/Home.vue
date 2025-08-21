<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const difficulty = ref("easy");
const errorMsg = ref("");

function startGame() {
  if (!name.value.trim()) {
    errorMsg.value = "Por favor ingresa tu nombre antes de jugar 🙏";
    return;
  }
  errorMsg.value = "";
  localStorage.setItem("memory-player", name.value);
  router.push({ name: "game", query: { difficulty: difficulty.value } });
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-purple-100 p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
      <h1 class="text-2xl font-bold text-purple-600 mb-4">🎴 Juego de Memoria</h1>

      <input
        v-model="name"
        placeholder="Tu nombre"
        class="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
      />

      <select
        v-model="difficulty"
        class="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
      >
        <option value="easy">Fácil (4x4)</option>
        <option value="medium">Medio (6x6)</option>
        <option value="hard">Difícil (12x12)</option>
      </select>

      <p v-if="errorMsg" class="text-red-500 text-sm mb-2">{{ errorMsg }}</p>

      <button
        @click="startGame"
        class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold cursor-pointer"
      >
        Iniciar Juego
      </button>

      <button
        @click="router.push({ name: 'scores' })"
        class="w-full mt-2 bg-purple-300 hover:bg-purple-400 text-white py-2 rounded-lg cursor-pointer"
      >
        Ver Puntajes
      </button>
    </div>
  </div>
</template>
