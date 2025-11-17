<template>
  <div class="row justify-center items-center q-mt-lg">
    <div class="column col-12">
      <div class="text-h4 text-center q-mb-lg">Action Phase</div>
      <q-card>
        <q-card-section class="text-h4"> Current Player </q-card-section>
        <q-card-section class="row items-center">
          <div class="shared-grid">
            <div class="top-grid" v-if="currentPlayer">
              <div class="left-col text-h4 q-pr-lg">
                <div>{{ currentPlayer.strategy?.name }}</div>
              </div>
              <div class="right-col">
                <div class="row">
                  <img :src="getImage('logo', currentPlayer.faction!.id)" class="logo" />
                  <div class="text-h5">{{ currentPlayer.name }}</div>
                  <div v-if="getSpeaker?.id === currentPlayer.id">(SPEAKER)</div>
                </div>
                <div>{{ currentPlayer.faction?.name }}</div>
              </div>
            </div>
            <div class="text-h4 text-italic" style="grid-column: 1 / -1">Coming up...</div>
            <transition-group name="shift-up" tag="div" class="main-grid">
              <div v-for="player in playerTurnOrder.slice(1)" :key="player.id" class="row-item">
                <div class="left-col text-h4 q-pr-lg">
                  <div>{{ player?.strategy?.name }}</div>
                </div>
                <div class="right-col">
                  <div class="row items-center">
                    <img :src="getImage('logo', player!.faction!.id)" class="logo" />
                    <div class="text-h5">{{ player?.name }}</div>
                    <div class="q-ml-sm" v-if="getSpeaker?.id === player.id">(SPEAKER)</div>
                  </div>
                  <div>{{ player?.faction?.name }}</div>
                </div>
              </div>
            </transition-group>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import { useGetImage } from '@/composables/useGetImage';
import { computed } from 'vue';

const turnStore = useTurnTrackerStore();
const { players, currentTurn, getSpeaker } = storeToRefs(turnStore);

const initiativeOrder = [...players.value].sort((a, b) => {
  if (a.strategy?.order && b.strategy?.order) return a.strategy.order - b.strategy.order;
  else return 0;
});

const playerTurnOrder = computed(() => {
  return [
    ...initiativeOrder.slice(currentTurn.value - 1),
    ...initiativeOrder.slice(0, currentTurn.value - 1),
  ];
});
const currentPlayer = computed(() => {
  return playerTurnOrder.value[0];
});

const { getImage } = useGetImage();
</script>

<style scoped>
.shared-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
}

.top-grid,
.main-grid,
.row-item {
  display: contents;
}

.left-col {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-weight: 600;
}

.shift-up-enter-active,
.shift-up-leave-active {
  transition: all 0.25s ease;
}

.shift-up-enter-from,
.shift-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.shift-up-move {
  transition: transform 0.25s ease;
}

.logo {
  height: 50px;
  width: 100%;
  object-fit: contain;
}
</style>
