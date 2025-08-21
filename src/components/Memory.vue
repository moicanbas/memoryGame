<script setup>
import { ref, computed, onMounted, watch } from "vue";

// === ESTADOS ===
const step = ref("home"); // home | game | scores
const playerName = ref("");
const difficulty = ref("easy"); // easy | medium | hard
const gridSize = ref(3); // depende dificultad
const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref([]);
const timer = ref(0);
let interval = null;

// === HISTORIAL ===
const scores = ref([]);

// === CONFIG ===
const difficulties = {
  easy: 3,
  medium: 6,
  hard: 12,
};

// === GENERAR TABLERO ===
function generateBoard() {
  const size = difficulties[difficulty.value];
  gridSize.value = size;
  const totalCards = size * size;

  // Crear pares
  const base = Array.from({ length: totalCards / 2 }, (_, i) => i + 1);
  const allCards = [...base, ...base].sort(() => Math.random() - 0.5);

  cards.value = allCards.map((num, idx) => ({
    id: idx,
    value: num,
    flipped: false,
    matched: false,
  }));

  flippedCards.value = [];
  matchedCards.value = [];
  timer.value = 0;
  clearInterval(interval);
  interval = setInterval(() => (timer.value += 1), 1000);
}

// === MANEJAR CLIC EN CARTA ===
function flipCard(card) {
  if (flippedCards.value.length === 2 || card.flipped || card.matched) return;
  card.flipped = true;
  flippedCards.value.push(card);

  if (flippedCards.value.length === 2) {
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  const [a, b] = flippedCards.value;
  if (a.value === b.value) {
    a.matched = true;
    b.matched = true;
    matchedCards.value.push(a, b);
  } else {
    a.flipped = false;
    b.flipped = false;
  }
  flippedCards.value = [];

  // === GANASTE ===
  if (matchedCards.value.length === cards.value.length) {
    clearInterval(interval);
    saveScore();
    step.value = "scores";
  }
}

// === GUARDAR HISTORIAL ===
function saveScore() {
  const newScore = {
    name: playerName.value,
    difficulty: difficulty.value,
    time: timer.value,
    date: new Date().toLocaleString(),
  };
  scores.value.push(newScore);
  localStorage.setItem("memory-scores", JSON.stringify(scores.value));
}

onMounted(() => {
  const saved = localStorage.getItem("memory-scores");
  if (saved) scores.value = JSON.parse(saved);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-purple-100 text-gray-800 p-6">
    <!-- === HOME === -->
    <div v-if="step === 'home'" class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
      <h1 class="text-2xl font-bold text-purple-600 mb-4">🎴 Juego de Memoria</h1>
      <input
        v-model="playerName"
        placeholder="Tu nombre"
        class="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
      />
      <select
        v-model="difficulty"
        class="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
      >
        <option value="easy">Fácil (3x3)</option>
        <option value="medium">Medio (6x6)</option>
        <option value="hard">Difícil (12x12)</option>
      </select>
      <button
        @click="(playerName && (step='game', generateBoard()))"
        class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold"
      >
        Iniciar Juego
      </button>
      <button
        @click="step = 'scores'"
        class="w-full mt-2 bg-purple-300 hover:bg-purple-400 text-white py-2 rounded-lg"
      >
        Ver Puntajes
      </button>
    </div>

    <!-- === GAME === -->
    <div v-else-if="step === 'game'" class="flex flex-col items-center w-full">
      <div class="flex justify-between w-full max-w-3xl mb-4 text-purple-700 font-semibold">
        <span>Jugador: {{ playerName }}</span>
        <span>Tiempo: {{ timer }}s</span>
        <span>Dificultad: {{ difficulty }}</span>
      </div>
      <div
        class="grid gap-2 bg-purple-200 p-4 rounded-xl shadow-md"
        :style="`grid-template-columns: repeat(${gridSize}, minmax(0,1fr));`"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
          class="aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300"
          :class="card.flipped || card.matched ? 'bg-purple-500 text-white' : 'bg-purple-300'"
        >
          <span v-if="card.flipped || card.matched">{{ card.value }}</span>
        </div>
      </div>
      <button
        @click="step='home'; clearInterval(interval)"
        class="mt-4 bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg"
      >
        Salir
      </button>
    </div>

    <!-- === SCORES === -->
    <div v-else class="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-purple-600 mb-4">🏆 Mejores Puntajes</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-purple-200 text-purple-800">
            <th class="p-2">Jugador</th>
            <th class="p-2">Dificultad</th>
            <th class="p-2">Tiempo</th>
            <th class="p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in scores" :key="i" class="odd:bg-purple-50">
            <td class="p-2">{{ s.name }}</td>
            <td class="p-2 capitalize">{{ s.difficulty }}</td>
            <td class="p-2">{{ s.time }}s</td>
            <td class="p-2">{{ s.date }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between mt-4">
        <button
          @click="step='home'"
          class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg"
        >
          Volver al inicio
        </button>
        <button
          @click="scores=[]; localStorage.removeItem('memory-scores')"
          class="bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded-lg"
        >
          Limpiar Historial
        </button>
      </div>
    </div>
  </div>
</template>
