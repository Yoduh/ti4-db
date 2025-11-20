<template>
  <div class="column items-center q-mt-lg">
    <div class="text-h4 text-center">Set Players</div>
    <q-select
      :options="counts"
      v-model="playerCount"
      @update:model-value="updatePlayers"
      stack-label
      label="Player Count"
      class="q-my-lg full-heigh"
      style="width: auto"
    >
      <template v-slot:selected>
        <div class="text-h4">{{ playerCount }}</div>
      </template>
    </q-select>
    <q-btn label="Reset All" outline color="secondary" @click="turnStore.resetPlayers" />
    <div class="q-mt-sm text-italic">Please add players in seated order</div>
    <div class="row full-width">
      <div v-for="(player, i) in players" :key="player.id" class="column col-4">
        <FactionSelect
          class="q-ma-md"
          :factions="availableFactions"
          :seat="i"
          :colors="availableColors"
          v-model="players[i]"
        />
      </div>
    </div>
    <q-btn
      label="Next"
      color="primary"
      size="large"
      @click="next"
      class="q-mt-md q-mb-xl"
      :disable="!playersFilledOut"
    >
      <q-tooltip v-if="!playersFilledOut"
        >Fill out all player information to continue (name, color, faction)</q-tooltip
      ></q-btn
    >
  </div>
</template>

<script setup lang="ts">
import FactionSelect from '@/components/TurnTracker/FactionSelect.vue';
import type { Faction } from '@/components/models';
import type { SimpleFaction } from '@/components/turnModels';
import { computed, ref } from 'vue';
import { api } from '@/boot/axios';
import { useRouter } from 'vue-router';
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import { State } from '@/enums/turnState';

const turnStore = useTurnTrackerStore();
const { players, gameState } = storeToRefs(turnStore);
gameState.value = State.SETUP;
players.value.sort((a, b) => a.seat - b.seat);

const counts = ref([3, 4, 5, 6, 7, 8]);
const playerCount = ref(players.value.length ?? 6);

const factions = ref<SimpleFaction[]>([]);
api
  .get('/faction/names')
  .then((res) => {
    factions.value = res.data.map((f: Faction) => {
      return { name: f.name, id: f.id };
    });
  })
  .catch((e) => console.error(e));
const availableFactions = computed(() =>
  factions.value.filter((f) => !players.value.some((p) => p.faction?.id === f.id)),
);

const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Black'];
const availableColors = computed(() =>
  colors.filter((c) => !players.value.some((p) => p.color === c)),
);

function updatePlayers(count: number) {
  let maxId = players.value.reduce((max, p) => (p.id > max ? p.id : max), 0);
  if (count < players.value.length) {
    players.value = players.value.slice(0, count);
  } else {
    while (count > players.value.length) {
      players.value.push({
        id: ++maxId,
        name: '',
        color: '',
        strategy: null,
        speaker: false,
        faction: null,
        passed: false,
        influence: 0,
        agenda1votes: 0,
        agenda2votes: 0,
        seat: players.value.length + 1,
      });
    }
  }
}

const playersFilledOut = computed(() => {
  return players.value.every((p) => p.name && p.color && p.faction);
});

const router = useRouter();
async function next() {
  await router
    .push('/turn-tracker/strategy')
    .then(() => (turnStore.gameState = State.STRATEGY))
    .catch((e) => console.error(e));
}
</script>

<style scoped>
.q-select :deep(.ellipsis) {
  overflow: visible;
}
</style>
