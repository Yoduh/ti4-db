<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterCards"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Relics</h3>
    <div v-for="card in filteredCards" :key="card.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        {{ card.name }}
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
import { ref } from 'vue';
import type { Relic, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';

const cards = ref<Relic[]>([]);
const filteredCards = ref<Relic[]>([]);
api
  .get('/relic')
  .then((res) => {
    cards.value = res.data;
    filteredCards.value = res.data;
  })
  .catch((e) => console.error(e));
const filter = ref('');
function filterCards() {
  filteredCards.value = cards.value;
  if (filter.value === '') return;

  filteredCards.value = filteredCards.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase()),
  );
}

function replaceCrown(effect: string) {
  return effect.split('CROWN');
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Relic) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}
</script>

<style scoped></style>
