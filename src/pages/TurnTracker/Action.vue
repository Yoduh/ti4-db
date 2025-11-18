<template>
  <div class="row justify-center items-center q-mt-lg">
    <div class="column col-12">
      <div class="text-h3 text-center q-mb-lg">Action Phase</div>
      <SpeakerSelect class="q-mb-lg" />
      <div v-if="!allPassed" class="text-h4 text-center">Current Player</div>
      <div class="row justify-center items-center q-mb-md">
        <div class="shared-grid">
          <transition name="shift-down-up" mode="out-in">
            <PlayerTurn
              v-if="currentPlayer"
              :player="currentPlayer"
              @popped="popCard(currentPlayer)"
              @passed="pass(currentPlayer)"
              :key="currentPlayer.id"
            />
          </transition>
          <div v-if="!allPassed" class="text-h4 text-center" style="grid-column: 1 / -1">
            <q-btn label="End Turn" color="primary" @click="endTurn" />
            <div class="q-mt-xl text-italic">Coming up...</div>
          </div>
          <transition-group name="shift-up-down">
            <PlayerTurn
              v-for="player in waitingPlayers"
              :key="player.id"
              :player="player"
              @popped="popCard(player)"
              @passed="pass(player)"
              class="row-item"
            />
          </transition-group>
        </div>
      </div>
      <div v-if="allPassed" class="row justify-center items-center q-mb-xl">
        <div class="column">
          <div class="text-h4 q-mb-md">All players passed!</div>
          <q-btn v-if="allPassed" label="Next Phase" color="primary" to="/turn-tracker/agenda" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerTurn from '@/components/TurnTracker/PlayerTurn.vue';
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import type { Player } from '@/components/turnModels';
import { computed } from 'vue';
import SpeakerSelect from '@/components/TurnTracker/SpeakerSelect.vue';

const turnStore = useTurnTrackerStore();
const { players, currentTurn } = storeToRefs(turnStore);
turnStore.setFirstTurn();

const initiativeOrder = [...players.value].sort((a, b) => {
  if (a.strategy?.initiative && b.strategy?.initiative)
    return a.strategy.initiative - b.strategy.initiative;
  else return 0;
});

// const currentPlayer = ref();
const playerTurnOrder = computed(() => {
  const passedPlayers = initiativeOrder.filter((p) => p.passed);
  const unpassedPlayers = initiativeOrder.filter((p) => !p.passed);
  const currentIndex = unpassedPlayers.findIndex(
    (p) => p.strategy?.initiative === currentTurn.value,
  );
  if (currentIndex !== -1) {
    const turns = [
      ...unpassedPlayers.slice(currentIndex),
      ...unpassedPlayers.slice(0, currentIndex),
      ...passedPlayers,
    ];

    // currentPlayer.value = turns.splice(0, 1)[0];
    // console.log(currentPlayer.value);
    return turns;
  } else {
    // currentPlayer.value = null;
    return passedPlayers;
  }
});
const currentPlayer = computed(() => {
  if (playerTurnOrder.value[0]?.passed) return null;
  return playerTurnOrder.value[0];
});
const waitingPlayers = computed(() =>
  currentPlayer.value ? playerTurnOrder.value.slice(1) : playerTurnOrder.value,
);
const allPassed = computed(() => waitingPlayers.value.length === players.value.length);

function popCard(popPlayer: Player) {
  const player = players.value.find((p) => p.id === popPlayer.id);
  if (player && player.strategy) {
    player.strategy.popped = !player.strategy.popped;
  }
}
function pass(passPlayer: Player) {
  const player = players.value.find((p) => p.id === passPlayer.id);
  if (player) {
    // end turn first if currentPlayer
    if (player.id === currentPlayer.value?.id && !player.passed) {
      endTurn();
    }
    // if all players are passed and someone is unpassing, set to their turn
    if (players.value.every((p) => p.passed)) {
      currentTurn.value = player.strategy!.initiative;
    }
    player.passed = !player.passed;
  }
}

const initiative = computed(() =>
  players.value
    .filter((p) => !p.passed)
    .map((p) => p.strategy?.initiative)
    .sort(),
);
function endTurn() {
  const turnIndex = initiative.value.findIndex((i) => i === currentTurn.value);
  if (turnIndex !== -1) {
    currentTurn.value = initiative.value[(turnIndex + 1) % initiative.value.length] ?? 0;
  }
}
</script>

<style scoped>
.shared-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
  position: relative;
}

.row-item {
  display: grid; /* participates in grid cleanly */
  grid-template-columns: subgrid; /* (if supported) or just block */
  overflow: hidden; /* required for max-height collapse */
}

.shift-up-down-enter-active,
.shift-up-down-leave-active,
.shift-down-up-enter-active,
.shift-down-up-leave-active {
  transition: all 0.2s ease;
}

/* top transition: exit down then enter up */
.shift-down-up-enter-from {
  opacity: 0;
  transform: translateY(100px);
}
.shift-down-up-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* bottom transition group: exit up then enter from down */
.shift-up-down-leave-active {
  max-height: 310px;
}
.shift-up-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.shift-up-down-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.shift-up-down-enter-to {
  opacity: 1;
  transform: translateY(0);
  max-height: 999px;
}
</style>
