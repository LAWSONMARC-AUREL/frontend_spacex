<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import gsap from "gsap";
import {fetchNextLaunch} from "../spaceXApi.ts";

const launch = ref();
const countdown = ref(0);
const countdownFormatted = ref({ hours: 0, minutes: 0, seconds: 0 });
const rocketLaunched = ref(false);
const launchExpired = ref(false);

const fetchUpcomingLaunch = async () => {
  const data = await fetchNextLaunch();
  if (data) {
    launch.value = data;
    countdown.value = launch.value.date_unix - Math.floor(Date.now() / 1000);
    if (countdown.value > 0) {
      startCountdown();
      updateFormattedCountdown();
    } else {
      launchExpired.value = true;
      countdownFormatted.value = { hours: 0, minutes: 0, seconds: 0 };
    }
  } else {
    console.log("Aucune donnée de lancement trouvée ou erreur API");
  }
};

const startCountdown = () => {
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
      updateFormattedCountdown();
    } else {
      clearInterval(timer);
      rocketLaunched.value = true;
    }
  }, 1000);
};

const updateFormattedCountdown = () => {
  const hours = Math.floor(countdown.value / 3600);
  const minutes = Math.floor((countdown.value % 3600) / 60);
  const seconds = countdown.value % 60;

  countdownFormatted.value = { hours, minutes, seconds };
};

watch(rocketLaunched, (newVal) => {
  if (newVal) {
    gsap.to(".rocket", {
      y: -500,
      opacity: 0,
      duration: 3,
      ease: "power2.out"
    });
  }
});

onMounted(fetchUpcomingLaunch);
</script>

<template>
  <div class="bg-blue-900 text-white rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-bold text-center mb-4">Prochain Lancement</h2>

    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="data w-full md:w-1/2 text-left">
        <p v-if="launch" class="text-lg font-medium">{{ launch.name }}</p>
        <p v-if="launch" class="text-sm text-gray-400">{{ launch.date_local }}</p>

        <div class="mt-4">
          <p class="text-lg font-medium">Décompte :</p>
          <div v-if="!launchExpired" class="flex space-x-4 text-4xl font-bold">
            <span class="time">{{ countdownFormatted.hours }}h</span>
            <span class="time">{{ countdownFormatted.minutes }}m</span>
            <span class="time">{{ countdownFormatted.seconds }}s</span>
          </div>
          <p v-else class="text-red-500 font-medium">Le lancement est déjà passé.</p>
        </div>
      </div>

      <div class="scene w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
        <div class="relative w-24 h-auto rocket">
          <img src="/src/assets/rocket_icon.png" alt="Rocket">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rocket {
  position: relative;
  bottom: 0;
}
</style>
