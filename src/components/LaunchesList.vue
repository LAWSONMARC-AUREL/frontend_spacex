<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import gsap from "gsap";
import LaunchModal from "./LaunchModal.vue";


interface Payload {
  id: string;
  name: string;
  customers: string[];
}

interface LaunchPad {
  id: string;
  name: string;
}

interface Launch {
  name: string;
  details: string;
  date_utc: string;
  youtube_id: string;
  wikipedia: string,
  images : string[];
  payloads: Payload[];
  launchPad: LaunchPad;
  failures: any[];
}

const launches = ref<Launch[]>([]);
const filter = ref("all");
const selectedLaunch = ref<Launch | null>(null);

console.log(selectedLaunch);

const fetchLaunches = async () => {
  const launchesData = await (await fetch("https://api.spacexdata.com/v5/launches/past")).json();

  launches.value = await Promise.all(
      launchesData.map(async (launch: any) => {
        const launchPadResponse = await fetch(`https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`);
        const launchPadData = await launchPadResponse.json();
        const launchPad: LaunchPad = {
          id: launchPadData.id,
          name: launchPadData.name,
        };

        const payloads = await Promise.all(
            (launch.payloads as string[]).map(async (payloadId: string) => {
              const payloadData = await (await fetch(`https://api.spacexdata.com/v4/payloads/${payloadId}`)).json();
              return {
                id: payloadData.id,
                name: payloadData.name,
                customers: payloadData.customers,
              } as Payload;
            })
        );
        return {
          name: launch.name,
          details: launch.details,
          date_utc: launch.date_utc,
          youtube_id:launch.links.youtube_id,
          wikipedia: launch.links.wikipedia,
          failures: launch.failures,
          images: launch.links.flickr.original,
          payloads,
          launchPad,
        };
      })
  );
};

const filteredlaunches = computed(() => {
  let filtered = launches.value;
  if(filter.value !=='all'){
    filtered = launches.value.filter((launch) =>
        filter.value === "success" ? launch.failures.length === 0 : launch.failures.length > 0
    );
  }
  filtered = filtered.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
  filtered.map((launch)=>{
    console.log(launch);
  })
  return filtered.slice(0, 10);
});


function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = "0";
  el.style.transform = "translateY(-10px)";
}

function onEnter(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    onComplete: done,
  });
}

function onLeave(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    y: -10,
    duration: 0.5,
    onComplete: done,
  });
}

onMounted(fetchLaunches);
</script>

<template>
  <div>
    <div class="mb-4">
      <select v-model="filter" class="w-full max-w-xs p-3 rounded-md bg-gray-200 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-90000 transition-all">
        <option value="all" :class="{'bg-blue-900 text-white': filter === 'all', 'bg-gray-200 text-gray-700': filter !== 'all'}">Tous les Lancement </option>
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
          class="bg-gray-200 mb-2 p-2 rounded"
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

</style>
