<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import gsap from "gsap";
import LaunchModal from "./LaunchModal.vue";
import { fetchLaunches } from "../spaceXApi.ts";

const launches = ref<Launch[]>([]);
const filter = ref("all");
const selectedLaunch = ref<Launch | null>(null);

const getLaunches = async () => {
  launches.value = await fetchLaunches();
};

watch(filter, () => {
  gsap.fromTo(".launch-item",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out", stagger: 0.2 });
});

const filteredlaunches = computed(() => {
  let filtered = launches.value;
  if (filter.value !== 'all') {
    filtered = launches.value.filter((launch) =>
        filter.value === "success" ? launch.failures.length === 0 : launch.failures.length > 0
    );
  }
  filtered = filtered.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
  return filtered.slice(0, 10);
});

function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = "0";
  el.style.transform = "scale(0.8)";
}

function onEnter(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.in",
    onComplete: done,
  });
}

function onLeave(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    delay: 0.1,
    ease: "power2.out",
    onComplete: done,
  });
}

onMounted(getLaunches);
</script>

<template>
  <div>
    <div class="mb-4">
      <select v-model="filter" class="w-full max-w-xs p-3 rounded-md bg-gray-200 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-90000 transition-all">
        <option value="all" :class="{'bg-blue-900 text-white': filter === 'all', 'bg-gray-200 text-gray-700': filter !== 'all'}">Tous les Lancements</option>
        <option value="success" :class="{'bg-blue-900 text-white': filter === 'success', 'bg-gray-200 text-gray-700': filter !== 'success'}">Réussis</option>
        <option value="fail" :class="{'bg-blue-900 text-white': filter === 'fail', 'bg-gray-200 text-gray-700': filter !== 'fail'}">Échoués</option>
      </select>
    </div>
    <TransitionGroup
        tag="ul"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
    >
      <li
          v-for="(launch, index) in filteredlaunches"
          :key="launch.name"
          :data-index="index"
          class="launch-item bg-gray-200 mb-2 p-2 rounded"
          @click="selectedLaunch = launch"
      >
        <span class="font-semibold text-gray-800 mr-2">{{ launch.name }}  </span>
        <span>{{ new Date(launch.date_utc).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}</span>
      </li>
    </TransitionGroup>
  </div>
  <LaunchModal v-if="selectedLaunch" :launch="selectedLaunch" @close="selectedLaunch = null" />
</template>

<style scoped>
.launch-item {
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}
</style>
