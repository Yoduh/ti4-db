<template>
  <div class="player-turn row-card" :class="{ passed: player.passed }">
    <div class="left-col text-h4 q-pr-lg" :class="!player.passed ? strategyColor : ''">
      <div :class="{ popped: player.strategy?.popped }">{{ player.strategy?.name }}</div>
      <q-btn size="small" :label="popLabel" color="#fff" outline @click="$emit('popped')" />
    </div>
    <div class="right-col">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <img :src="getImage('logo', player.faction!.id)" class="logo" />
          <div class="text-h5">{{ player.name }}</div>
          <div v-if="getSpeaker?.id === player.id" class="q-ml-sm">(SPEAKER)</div>
        </div>
        <q-btn class="q-ml-md" :label="passLabel" outline color="red-10" @click="$emit('passed')" />
      </div>
      <div>{{ player.faction?.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@/components/turnModels';
import { useGetImage } from '@/composables/useGetImage';
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps<{
  player: Player;
}>();

const { getImage } = useGetImage();

const turnStore = useTurnTrackerStore();
const { getSpeaker } = storeToRefs(turnStore);

const strategyColor = computed(() => `bg-${props.player.strategy?.color}`);

const popLabel = computed(() => (props.player.strategy?.popped ? 'Un-Pop' : 'Pop'));
const passLabel = computed(() => (props.player.passed ? 'Un-Pass' : 'Pass'));
</script>

<style scoped>
.player-turn {
  border: 1px solid #eee;
  border-radius: 20px;
}
.row-card {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid; /* fallback below */
}
.left-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
  font-weight: 600;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  padding: 10px;
}
.right-col {
  padding: 10px 20px 10px 0;
}
.logo {
  height: 50px;
  object-fit: contain;
  margin-right: 8px;
}
.popped {
  text-decoration: line-through;
}
.passed {
  opacity: 0.3;
  background: repeating-linear-gradient(
    45deg,
    rgba(99, 99, 99, 1) 0,
    rgba(0, 0, 0, 0.12) 2px,
    /* stripe thickness */ transparent 2px,
    transparent 10px /* gap between stripes */
  ) !important;
}
</style>
