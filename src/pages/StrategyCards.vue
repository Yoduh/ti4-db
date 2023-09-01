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
    <h3>Strategy Cards</h3>
    <div v-for="card in filteredCards" :key="card.id" class="q-mb-xl">
      <h5 class="q-mb-none" :class="`text-${card.name.toLowerCase()}`">
        {{ card.initiative }}. {{ card.name }}
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
      <div class="q-ml-lg">PRIMARY</div>
      <div
        class="q-ml-xl"
        v-for="(effect, idx) in splitEffects(card.primary)"
        :key="idx"
      >
        &#10022; {{ effect }}
      </div>
      <div class="q-ml-lg">SECONDARY</div>
      <div
        class="q-ml-xl"
        v-for="(effect, idx) in splitEffects(card.secondary)"
        :key="idx"
      >
        &#10022; {{ effect }}
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
import { ref } from 'vue';
import type { StrategyCard, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';

const cards = ref<StrategyCard[]>([]);
const filteredCards = ref<StrategyCard[]>([]);
api.get('/strategycard').then((res) => {
  cards.value = res.data;
  filteredCards.value = res.data;
});
const filter = ref('');
function filterCards() {
  filteredCards.value = cards.value;
  if (filter.value === '') return;

  filteredCards.value = filteredCards.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase())
  );
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: StrategyCard) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}

function splitEffects(effect: string) {
  return effect.split('\n');
}
</script>

<style scoped></style>
