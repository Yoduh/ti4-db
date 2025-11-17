<template>
  <div class="row justify-center items-center q-mt-lg">
    <div class="column col-12">
      <div class="text-h4 text-center">Strategy Phase</div>
      <div class="q-mt-lg text-italic">Select Speaker</div>
      <q-select
        v-model="speaker"
        :options="players"
        :option-label="speakerName"
        @update:model-value="sortPlayers"
        dense
        emit-value
        map-options
        class="q-mb-xl"
      />
      <div class="row q-col-gutter-md q-mb-lg">
        <div
          v-for="player in sortedPlayers"
          :key="player.id"
          class="column col-12"
          :class="playerColumns()"
        >
          <q-card>
            <q-card-section class="flex justify-center" style="height: 200px">
              <img
                v-if="player.strategy"
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
                label="Selected Strategy Card"
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
    </div>
    <q-btn size="large" color="primary" label="Next" to="/turn-tracker/actions" class="q-mb-lg" />
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import type { Strategy } from '@/components/turnModels';
import { type Player } from '@/components/turnModels';
import { computed, ref } from 'vue';

const turnStore = useTurnTrackerStore();
const { players } = storeToRefs(turnStore);

function playerColumns() {
  if ([3, 5, 6].includes(players.value.length)) {
    return 'col-md-4';
  } else {
    return 'col-md-3';
  }
}

const speaker = ref<Player | null>(turnStore.getSpeaker);
function speakerName(player: Player) {
  return player.name + ' - ' + player.faction?.name;
}
const sortedPlayers = ref([...players.value]);
function sortPlayers(speaker: Player) {
  turnStore.setSpeaker(speaker.id);
  const start = speaker.seat;
  sortedPlayers.value = [...players.value.slice(start - 1), ...players.value.slice(0, start - 1)];
}

const strategyCards: Strategy[] = [
  { name: '1. Leadership', order: 1 },
  { name: '2. Diplomacy', order: 2 },
  { name: '3. Politics', order: 3 },
  { name: '4. Construction', order: 4 },
  { name: '5. Trade', order: 5 },
  { name: '6. Warfare', order: 6 },
  { name: '7. Technology', order: 7 },
  { name: '8. Imperial', order: 8 },
];
const unselectedStrategyCards = computed(() => {
  const selectedCards = sortedPlayers.value
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

function getStrategyCardImage(card: Strategy | null) {
  if (card) {
    const name = card.name.split('. ')[1];
    return `${process.env.API_URL}images/strategy-cards/${name?.toLowerCase()}.webp`;
  } else {
    return undefined;
  }
}
</script>

<style scoped></style>
