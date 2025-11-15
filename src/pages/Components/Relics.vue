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
        <NoteButton :c="card" />
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
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref } from 'vue';
import type { Relic } from '@/components/models';
import NoteButton from '@/components/NoteButton.vue';

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
</script>

<style scoped></style>
