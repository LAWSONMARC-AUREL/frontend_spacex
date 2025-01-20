<script setup lang="ts">
import LaunchPlayer from "./LaunchPlayer.vue";

const props = defineProps({
  launch: {
    type: Object,
    required: false,
  },
  visible : {
    type : Boolean,
    required: false
  },
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div v-if="launch" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
            @click="emit('close')"
            class="absolute top-4 right-4 bg-blue-200 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out">
          ✖
        </button>
        <h2 class="text-xl font-bold">{{ launch.name }}</h2>
        <div class="overflow-auto max-h-96">
          <img :src="launch.image" alt="Pas d'image pour ce lancement" class="w-auto h-auto max-w-full">
        </div>


        <div class="mt-4">
          <h3 class="text-lg font-semibold">Détails</h3>
          <p>📝 {{ launch.details ? launch.details : 'Pas de description' }}</p>
          <p><strong>Date :</strong> {{ new Date(launch.date_utc).toLocaleString() }} 📅</p>
          <p><strong>Lieu :</strong> {{ launch.launchPad.name }} 📍</p>
          <a v-if="launch.wikipedia"   class="text-blue-500 hover:text-blue-700 font-semibold underline inline-flex items-center"
               :href="launch.wikipedia" target="_blank"
          >
            Article wikipedia ↗️
          </a>
          <p><strong>Chargement:</strong></p>
          <ul class="list-disc list-inside">
            <li v-for="payload in launch.payloads" :key="payload.id" >
              {{ payload.name }} (Clients: {{ payload.customers.join(", ") }})
            </li>
          </ul>
        </div>
        <LaunchPlayer v-if="launch.youtube_id" :videoId="launch.youtube_id" class="mt-4"></LaunchPlayer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

</style>
