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
    <h3>Action Cards</h3>
    <div v-for="card in filteredCards" :key="card.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        {{ card.name }}
        <NoteButton :c="card" />
      </h5>
      <div class="text-caption">Number in deck: {{ card.numAvailable }}</div>
      <div>
        <strong>{{ card.play }}</strong>
      </div>
      <div>{{ card.effect }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref } from 'vue';
import type { ActionCard } from 'components/models';
import NoteButton from '@/components/NoteButton.vue';

const cards = ref<ActionCard[]>([]);
const filteredCards = ref<ActionCard[]>([]);
api
  .get('/actioncard')
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
</script>

<style scoped></style>
