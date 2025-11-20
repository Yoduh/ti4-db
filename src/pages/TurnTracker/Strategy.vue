<template>
  <div class="column items-center q-mt-lg relative-position">
    <div class="text-h4 text-center">Strategy Phase</div>
    <SpeakerSelect class="q-my-md" />
    <div class="row q-col-gutter-md q-mb-lg">
      <div
        v-for="player in speakerOrder"
        :key="player.id"
        class="column col-12 items-stretch"
        :class="playerColumns()"
      >
        <q-card class="full-width full-height">
          <q-card-section class="flex justify-center items-center" style="height: 200px">
            <div v-if="choosingPlayer === player.id" class="text-h3 text-center flash">
              CHOOSE NOW
            </div>
            <img
              v-if="player.strategy?.name"
              :src="getStrategyCardImage(player.strategy)"
              style="object-fit: contain; height: 200px"
            />
          </q-card-section>
          <q-card-section>
            <q-select
              :options="unselectedStrategyCards"
              v-model="player.strategy"
              @update:model-value="(s) => setPlayerStrategy(s, player)"
              clearable
              option-label="name"
              label="Strategy Card"
              emit-value
              map-options
            />
          </q-card-section>
          <q-card-section class="q-pt-none text-center">
            <div class="text-h4">{{ player.name }}</div>
            <div>{{ player.faction?.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-btn
      size="large"
      color="primary"
      label="Next"
      @click="next"
      class="q-mb-lg"
      :disable="!strategiesPicked"
    >
    </q-btn>
    <q-btn label="Change Setup" class="setup-btn" outline color="red" to="/turn-tracker" />
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import type { Strategy } from '@/components/turnModels';
import { type Player } from '@/components/turnModels';
import { computed } from 'vue';
import SpeakerSelect from '@/components/TurnTracker/SpeakerSelect.vue';
import { useRouter } from 'vue-router';
import { State } from '@/enums/turnState';

const turnStore = useTurnTrackerStore();
const { players, speakerOrder } = storeToRefs(turnStore);

function playerColumns() {
  if ([3, 5, 6].includes(players.value.length)) {
    return 'col-md-4';
  } else {
    return 'col-md-3';
  }
}

const strategyCards: Strategy[] = [
  { name: '1. Leadership', color: 'red-9', initiative: 1, popped: false },
  { name: '2. Diplomacy', color: 'orange', initiative: 2, popped: false },
  { name: '3. Politics', color: 'yellow-7', initiative: 3, popped: false },
  { name: '4. Construction', color: 'green-9', initiative: 4, popped: false },
  { name: '5. Trade', color: 'teal', initiative: 5, popped: false },
  { name: '6. Warfare', color: 'blue-6', initiative: 6, popped: false },
  { name: '7. Technology', color: 'blue-10', initiative: 7, popped: false },
  { name: '8. Imperial', color: 'purple', initiative: 8, popped: false },
];
const unselectedStrategyCards = computed(() => {
  const selectedCards = players.value
    .map((p) => p.strategy)
    .filter((c) => c?.name && c.name !== '');
  return strategyCards.filter((c) => selectedCards.findIndex((sc) => sc?.name === c.name) === -1);
});
function setPlayerStrategy(strategy: Strategy, sortedPlayer: Player) {
  const player = players.value.find((p) => p.id === sortedPlayer.id);
  if (player) {
    player.strategy = strategy;
  }
}
const choosingPlayer = computed(() => speakerOrder.value.find((p) => !p.strategy)?.id);

function getStrategyCardImage(card: Strategy | null) {
  if (card) {
    const name = card.name.split('. ')[1];
    return `${process.env.API_URL}/images/strategy-cards/${name?.toLowerCase()}.webp`;
  } else {
    return undefined;
  }
}

const strategiesPicked = computed(() => players.value.every((p) => p.strategy));

const router = useRouter();
function next() {
  players.value.forEach((p) => {
    p.passed = false;
    p.strategy!.popped = false;
  });
  router
    .push('/turn-tracker/actions')
    .then(() => (turnStore.gameState = State.ACTION))
    .catch((e) => console.error(e));
}
</script>

<style scoped>
.flash {
  animation: flash 1.5s ease-in-out infinite;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
