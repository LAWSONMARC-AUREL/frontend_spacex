<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
});

const player = ref(null);
const playerElementId = ref(`player-${props.videoId}`);
const isVisible = ref(false);

function loadYouTubeAPI() {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

function createPlayer() {
  if (window.YT && window.YT.Player) {
    player.value = new YT.Player(playerElementId.value, {
      height: '390',
      width: '640',
      videoId: props.videoId,
      playerVars: {
        'playsinline': 1,
        'controls': 1,
      },
    });
  } else {
    window.onYouTubeIframeAPIReady = () => createPlayer();
  }
}

function destroyPlayer() {
  if (player.value) {
    player.value.destroy();
    player.value = null;
  }
}

onMounted(async () => {
  loadYouTubeAPI();
  await nextTick();
  createPlayer();
});

watch(() => props.videoId, async () => {
  if (player.value) {
    player.value.loadVideoById(props.videoId);
  } else {
    await nextTick();
    createPlayer();
  }
});

watch(isVisible, async (newValue) => {
  if (newValue) {
    await nextTick();
    createPlayer();
  } else {
    destroyPlayer();
  }
});

onUnmounted(() => {
  destroyPlayer();
});
</script>

<template>
  <div>
    <label class="relative inline-flex items-center cursor-pointer mb-4">
      <input type="checkbox" v-model="isVisible" class="sr-only peer">
      <div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ isVisible ? 'Masquer' : 'Afficher' }} la vidéo</span>
    </label>
    <div v-if="isVisible" :id="playerElementId" class="w-full h-96"></div>
  </div>
</template>
