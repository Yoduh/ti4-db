<template>
  <div>
    <q-input
      v-model="search"
      filled
      type="search"
      hint="Search"
      class="q-my-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Exploration Cards</h3>
    <q-btn-toggle
      v-model="traitFilter"
      :options="traits"
      rounded
      push
      clearable
      :toggle-color="activeColor"
      toggle-text-color="white"
    />
    <div v-for="card in filteredCards" :key="card.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        <TI4Icon type="trait" :name="card.trait" /><span class="q-ml-sm">{{
          card.name
        }}</span>
        <q-btn
          v-if="card.notes && card.notes.length > 0"
          @click="showNote(card)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
      </h5>
      <div class="text-caption">
        Number in {{ card.trait }} deck: {{ card.numAvailable }}
      </div>
      <div v-if="!card.effect.includes('CROWN')">{{ card.effect }}</div>
      <div v-else>
        <span v-for="(half, i) in replaceCrown(card.effect)" :key="i">
          <q-img
            v-if="i === 1"
            src="../assets/CrownSymbol.webp"
            height="15px"
            width="15px"
            fit="contain"
          />
          {{ half }}
        </span>
      </div>
    </div>
  </div>
  <NoteDialog
    v-model="noteDialog"
    :noteName="noteName"
    :noteTexts="noteTexts"
  />
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { computed, ref } from 'vue';
import type { ExplorationCard, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';
import TI4Icon from '@/components/ti4Icon.vue';

const traits = ref([
  {
    label: 'Industrial',
    value: 'industrial',
    color: 'green-10',
  },
  {
    label: 'Hazardous',
    value: 'hazardous',
    color: 'red-10',
  },
  {
    label: 'Cultural',
    value: 'cultural',
    color: 'blue-10',
  },
  {
    label: 'Frontier',
    value: 'frontier',
    color: 'grey-10',
  },
]);

const cards = ref<ExplorationCard[]>([]);
api.get('/components/exploration').then((res) => {
  cards.value = res.data;
});

const search = ref('');
const traitFilter = ref(null);

const filteredCards = computed<ExplorationCard[]>(() => {
  return cards.value.filter(
    (a) =>
      a.name.toLowerCase().includes(search.value.toLowerCase()) &&
      (traitFilter.value === null
        ? true
        : a.trait.toLowerCase() === traitFilter.value)
  );
});

const activeColor = computed(() => {
  if (traitFilter.value) {
    switch (traitFilter.value) {
      case 'hazardous':
        return 'red';
      case 'industrial':
        return 'green';
      case 'cultural':
        return 'blue';
      default:
        return 'grey';
    }
  } else return undefined;
});

// function filterCards() {
//   filteredCards.value = cards.value;
//   if (search.value === '') return;

//   filteredCards.value = filteredCards.value.filter((a) =>
//     a.name.toLowerCase().includes(search.value.toLocaleLowerCase())
//   );
// }

function replaceCrown(effect: string) {
  return effect.split('CROWN');
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: ExplorationCard) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}
</script>

<style scoped></style>
