<template>
  <div class="row q-mt-lg justify-center items-center relative-position">
    <div class="column col-12 justify-center items-center">
      <div class="text-h4 text-center">Agenda Phase</div>
      <q-btn
        v-if="!mecatolClaimed"
        label="Skip"
        color="primary"
        size="xl"
        class="q-mt-md"
        @click="next"
        style="width: 150px"
      />
      <q-toggle v-model="mecatolClaimed" label="Mecatol Claimed" />
      <SpeakerSelect class="q-my-md" />
      <div class="row full-width">
        <div class="column col-6 items-center">
          <AgendaSelect v-model="agendas[0]" type="first" />
          <AgendaCard v-if="agendas[0]" :agenda="agendas[0]" />
        </div>
        <div class="column col-6 items-center">
          <AgendaSelect v-model="agendas[1]" type="second" />
          <AgendaCard v-if="agendas[1]" :agenda="agendas[1]" />
        </div>
      </div>

      <q-table
        :columns="columns"
        :rows="agendaRows"
        dense
        hide-bottom
        class="full-width q-my-lg agenda-table"
        row-key="id"
        :pagination="pagination"
      >
        <template #body-cell-influence="props">
          <q-td :props="props">
            <div class="flex justify-center items-center full-width">
              <InfluenceCounter
                v-model="props.row.influence"
                :playerId="props.row.id"
                type="influence"
              />
            </div>
          </q-td>
        </template>
        <template #body-cell-agenda1votes="props">
          <q-td :props="props">
            <AgendaVote v-if="agendas[0]" :agenda="agendas[0]" v-model="props.row" type="agenda1" />
          </q-td>
        </template>
        <template #body-cell-agenda2votes="props">
          <q-td :props="props">
            <AgendaVote v-if="agendas[1]" :agenda="agendas[1]" v-model="props.row" type="agenda2" />
          </q-td>
        </template>
      </q-table>
      <q-btn size="large" color="primary" label="Next" @click="next" class="q-mb-lg" />
    </div>
    <q-btn label="Change Setup" class="setup-btn" outline color="red" to="/turn-tracker" />
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import SpeakerSelect from '@/components/TurnTracker/SpeakerSelect.vue';
import { ref } from 'vue';
import InfluenceCounter from '@/components/TurnTracker/InfluenceCounter.vue';
import AgendaSelect from '@/components/TurnTracker/AgendaSelect.vue';
import AgendaVote from '@/components/TurnTracker/AgendaVote.vue';
import AgendaCard from '@/components/TurnTracker/AgendaCard.vue';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import { State } from '@/enums/turnState';

const mecatolClaimed = ref(false);

const turnStore = useTurnTrackerStore();
const { players, agendas, agendaRows } = storeToRefs(turnStore);

const columns = ref<QTableColumn[]>([
  {
    name: 'player',
    align: 'center',
    label: 'Player',
    field: 'name',
    sortable: false,
  },
  {
    name: 'influence',
    align: 'center',
    label: 'Influence',
    field: 'influence',
    sortable: false,
  },
  {
    name: 'agenda1votes',
    align: 'center',
    label: 'Agenda 1 Votes',
    field: 'agenda1votes',
    sortable: false,
  },
  {
    name: 'agenda2votes',
    align: 'center',
    label: 'Agenda 2 Votes',
    field: 'agenda2votes',
    sortable: false,
  },
]);
const pagination = {
  rowsPerPage: 0,
};

const router = useRouter();
function next() {
  players.value.forEach((p) => (p.strategy = null));
  router
    .push('/turn-tracker/strategy')
    .then(() => (turnStore.gameState = State.STRATEGY))
    .catch((e) => console.error(e));
}
</script>

<style scoped>
.agenda-table :deep(thead tr th) {
  font-size: 1.2rem; /* header font size */
  font-weight: 600;
}

.agenda-table :deep(tbody tr td:first-child) {
  font-size: 2rem; /* only first column cells */
  font-weight: 500;
}
</style>
