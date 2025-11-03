<template>
  <div>
    <q-input v-model="search" filled type="search" hint="Search" class="q-my-lg">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Exploration Cards</h3>
    <div class="q-ml-sm q-mb-xs text-caption">Filters:</div>
    <q-btn-group rounded glossy>
      <q-btn
        v-for="(button, index) in traitToggles"
        :key="index"
        :color="button.color"
        :label="button.label"
        rounded
        glossy
        @click="toggle(button)"
      ></q-btn>
    </q-btn-group>
    <div v-for="card in filteredCards" :key="card.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        <TI4Icon type="trait" :name="card.trait" /><span class="q-ml-sm">{{ card.name }}</span>
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
      <div class="text-caption">Number in {{ card.trait }} deck: {{ card.numAvailable }}</div>
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
  <NoteDialog v-model="noteDialog" :noteName="noteName" :noteTexts="noteTexts" />
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { computed, ref } from 'vue';
import type { ExplorationCard, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';
import TI4Icon from '@/components/ti4Icon.vue';

type toggleBtn = {
  label: string;
  trait: string;
  color: string;
  onColor: string;
};
const traitToggles = ref([
  {
    label: 'Industrial',
    trait: 'industrial',
    color: 'green-10',
    onColor: 'green-10',
  },
  {
    label: 'Hazardous',
    trait: 'hazardous',
    color: 'red-10',
    onColor: 'red-10',
  },
  {
    label: 'Cultural',
    trait: 'cultural',
    color: 'blue-10',
    onColor: 'blue-10',
  },
  {
    label: 'Frontier',
    trait: 'frontier',
    color: 'grey-10',
    onColor: 'grey-10',
  },
]);
const offColor = 'blue-grey-10';

const cards = ref<ExplorationCard[]>([]);
api
  .get('/components/exploration')
  .then((res) => {
    cards.value = res.data;
  })
  .catch((e) => console.error(e));

const search = ref('');

const filteredCards = computed<ExplorationCard[]>(() => {
  return cards.value.filter(
    (a) =>
      a.name.toLowerCase().includes(search.value.toLowerCase()) &&
      activeFilters.value.find((f) => f === a.trait.toLowerCase()) !== undefined,
  );
});

const activeFilters = ref<string[]>(['industrial', 'hazardous', 'cultural', 'frontier']);

function toggle(option: toggleBtn) {
  if (activeFilters.value.length === 1 && activeFilters.value[0] === option.trait) {
    activeFilters.value = ['industrial', 'hazardous', 'cultural', 'frontier'];
    traitToggles.value.forEach((t) => (t.color = t.onColor));
  } else {
    activeFilters.value = [option.trait];
    traitToggles.value.forEach((t) =>
      t.trait === option.trait ? (t.color = t.onColor) : (t.color = offColor),
    );
  }
}

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
