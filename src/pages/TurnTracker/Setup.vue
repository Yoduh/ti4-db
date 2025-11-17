<template>
  <div class="row justify-center items-center q-mt-lg">
    <div class="column col-12 col-md-6 items-center">
      <div class="text-h4 text-center">Set Players</div>
      <q-select
        :options="counts"
        v-model="playerCount"
        @update:model-value="updatePlayers"
        label="Player Count"
        class="q-my-lg"
        style="width: 150px"
      />
      <div class="q-my-sm text-italic">Please add players in seated order</div>
      <FactionSelect
        v-for="(player, i) in players"
        :key="player.id"
        class="q-mb-md"
        :factions="factions"
        v-model="players[i]"
      />
      <q-btn label="Next" color="primary" size="large" @click="next" class="q-mt-md q-mb-xl" />
      <div>{{ players }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FactionSelect from '@/components/TurnTracker/FactionSelect.vue';
import type { Faction } from '@/components/models';
import { ref } from 'vue';
import { api } from '@/boot/axios';
import { useRouter } from 'vue-router';
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';

const factions = ref([]);
api
  .get('/faction/names')
  .then((res) => {
    factions.value = res.data.map((f: Faction) => {
      return { name: f.name, id: f.id };
    });
  })
  .catch((e) => console.error(e));

const playerCount = ref(6);
const counts = ref([1, 2, 3, 4, 5, 6, 7, 8]);

const turnTrackerStore = useTurnTrackerStore();
const { players } = storeToRefs(turnTrackerStore);

function updatePlayers(count: number) {
  if (count < players.value.length) {
    players.value = players.value.slice(0, count);
  } else {
    while (count > players.value.length) {
      players.value.push({
        id: players.value.length,
        name: '',
        color: '',
        strategy: null,
        speaker: false,
        faction: null,
        seat: players.value.length + 1,
      });
    }
  }
}

const router = useRouter();
async function next() {
  await router.push('/turn-tracker/strategy').catch((e) => console.error(e));
}
</script>

<style scoped></style>
