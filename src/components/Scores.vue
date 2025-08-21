<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const scores = ref([]);

const clearScores = () => {
  scores.value = [];
  localStorage.clear();
};

onMounted(() => {
  const saved = localStorage.getItem("memory-scores");
  const parsed = saved ? JSON.parse(saved) : [];
  // Ordenar por menor tiempo (mejor primero)
  scores.value = parsed.sort((a, b) => a.time - b.time);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-purple-100 p-6">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-purple-600 mb-4">
        🏆 Mejores Puntajes
      </h2>

      <table
        v-if="scores.length"
        class="w-full border-collapse text-sm sm:text-base"
      >
        <thead>
          <tr class="bg-purple-200 text-purple-800">
            <th class="p-2 text-left">#</th>
            <th class="p-2 text-left">Jugador</th>
            <th class="p-2 text-left">Dificultad</th>
            <th class="p-2 text-left">Tiempo</th>
            <th class="p-2 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in scores" :key="i" class="odd:bg-purple-50">
            <td class="p-2 font-bold text-purple-600">{{ i + 1 }}</td>
            <td class="p-2">{{ s.name }}</td>
            <td class="p-2 capitalize">{{ s.difficulty }}</td>
            <td class="p-2">{{ s.time }}s</td>
            <td class="p-2">{{ s.date }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-center text-gray-500">
        Aún no hay puntajes guardados 🙌
      </p>

      <div class="flex justify-between mt-4 flex-col sm:flex-row gap-2">
        <button
          @click="router.push({ name: 'home' })"
          class="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg cursor-pointer"
        >
          Volver al inicio
        </button>
        <button
          @click="clearScores()"
          class="w-full sm:w-auto bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded-lg cursor-pointer"
        >
          Limpiar Historial
        </button>
      </div>
    </div>
  </div>
</template>
