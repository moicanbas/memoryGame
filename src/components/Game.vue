<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-purple-100 p-4"
  >
    <!-- Header -->
    <div class="w-full max-w-5xl flex justify-between items-center mb-4">
      <h1 class="text-xl sm:text-2xl font-bold text-purple-700">
        Juego de Memoria
      </h1>
      <button
        @click="goHome"
        class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition text-sm sm:text-base cursor-pointer"
      >
        Salir
      </button>
    </div>

    <!-- Validación nombre -->
    <div v-if="!playerName" class="text-center bg-white shadow p-6 rounded-lg">
      <p class="text-lg text-purple-700 mb-4">
        ⚠️ No puedes jugar sin ingresar tu nombre
      </p>
      <button
        @click="goHome"
        class="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
      >
        Ir al inicio
      </button>
    </div>

    <!-- Panel de juego -->
    <div v-else class="max-w-8xl">
      <!-- Info -->
      <div
        class="flex flex-wrap gap-3 justify-between items-center mb-4 text-purple-700"
      >
        <p class="font-medium">
          Jugador: <span class="font-bold">{{ playerName }}</span>
        </p>
        <p class="font-medium">
          Tiempo: <span class="font-bold">{{ time }}s</span>
        </p>
        <p class="font-medium">
          Dificultad: <span class="font-bold capitalize">{{ difficulty }}</span>
        </p>
      </div>

      <!-- Tablero -->
      <div
        class="grid justify-items-center items-center gap-1 sm:gap-2 bg-purple-200 p-3 sm:p-4 rounded-xl shadow-md"
        :style="{ gridTemplateColumns: `repeat(${gridSize}, auto)` }"
      >
        <div
          v-for="card in cards"
          :key="card.id"
          @click="flipCard(card)"
          class="flex items-center justify-center rounded-lg transition transform select-none w-12 h-12 sm:w-16 sm:h-16 lg:w-30 lg:h-30"
          :class="[
            card.matched
              ? 'bg-green-300 cursor-default'
              : 'cursor-pointer hover:scale-105 ' +
                (card.flipped ? 'bg-white' : 'bg-purple-400'),
          ]"
        >
          <span
            v-if="card.flipped || card.matched"
            :class="[
              'font-bold text-purple-700',
              gridSize === 4
                ? 'text-lg sm:text-xl'
                : gridSize === 6
                ? 'text-base sm:text-lg'
                : 'text-xs sm:text-sm',
            ]"
          >
            {{ card.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const playerName = ref(localStorage.getItem("memory-player") || "");
const difficulty = ref("easy"); // easy | medium | hard
const gridSize = ref(4);
const cards = ref([]);
const flipped = ref([]);
const time = ref(0);
let timer = null;

// Dificultades corregidas: todas pares
const DIFF_MAP = {
  easy: 4,
  medium: 6,
  hard: 12,
};

function initGame() {
  const rawQ =
    route.query.difficulty || localStorage.getItem("memory-difficulty");
  difficulty.value = normalizeDifficulty(rawQ);
  localStorage.setItem("memory-difficulty", difficulty.value);

  gridSize.value = DIFF_MAP[difficulty.value] || 4;

  const totalCards = gridSize.value * gridSize.value;
  const pairCount = totalCards / 2;

  const values = Array.from({ length: pairCount }, (_, i) => i + 1);
  const deck = [...values, ...values];

  cards.value = deck
    .sort(() => Math.random() - 0.5)
    .map((v, idx) => ({
      id: idx,
      value: v,
      flipped: false,
      matched: false,
    }));

  flipped.value = [];
  time.value = 0;

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    time.value += 1;
  }, 1000);
}

function normalizeDifficulty(raw) {
  const val = String(raw || "").toLowerCase();
  if (["easy", "medium", "hard"].includes(val)) return val;
  if (["facil", "medio", "dificil"].includes(val)) {
    return { facil: "easy", medio: "medium", dificil: "hard" }[val];
  }
  if (["4", "6", "12"].includes(val)) {
    return { 4: "easy", 6: "medium", 12: "hard" }[val];
  }
  return "easy";
}

function flipCard(card) {
  if (!card || card.matched || card.flipped) return;
  if (flipped.value.length === 2) return;

  card.flipped = true;
  flipped.value.push(card);

  if (flipped.value.length === 2) {
    setTimeout(checkMatch, 700);
  }
}

function checkMatch() {
  const [a, b] = flipped.value;
  if (!a || !b) return;

  if (a.value === b.value) {
    a.matched = true;
    b.matched = true;
  } else {
    a.flipped = false;
    b.flipped = false;
  }
  flipped.value = [];

  const allMatched = cards.value.every((c) => c.matched);
  if (allMatched) {
    clearInterval(timer);
    saveScore();
    alert(`🎉 ¡Felicidades ${playerName.value}! Tiempo: ${time.value}s`);
    goHome();
  }
}

function saveScore() {
  const scores = JSON.parse(localStorage.getItem("memory-scores") || "[]");
  scores.push({
    name: playerName.value,
    time: time.value,
    difficulty: difficulty.value,
    date: new Date().toLocaleString(),
  });
  localStorage.setItem("memory-scores", JSON.stringify(scores));
}

function goHome() {
  router.push({ name: "home" });
}

onMounted(() => {
  if (!playerName.value) return;
  initGame();
});

watch(
  () => route.query.difficulty,
  () => {
    if (playerName.value) initGame();
  }
);

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>
