<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterAgendas"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Agendas</h3>
    <div v-for="agenda in filteredAgendas" :key="agenda.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        {{ agenda.name }}
        <NoteButton :c="agenda" />
      </h5>

      <div class="text-bold text-agenda-title">
        {{ agenda.type.toUpperCase() }}
      </div>
      <div v-if="agenda.elect">
        <strong>Elect {{ agenda.elect }}</strong>
      </div>
      <div v-if="agenda.effect">{{ agenda.effect }}</div>
      <div v-if="agenda.forOption">
        <span class="text-bold text-italic">FOR:</span> {{ agenda.forOption }}
      </div>
      <div v-if="agenda.againstOption">
        <span class="text-bold text-italic">AGAINST:</span>
        {{ agenda.againstOption }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref } from 'vue';
import type { Agenda } from 'components/models';
import NoteButton from '@/components/NoteButton.vue';

const agendas = ref<Agenda[]>([]);
const filteredAgendas = ref<Agenda[]>([]);
api
  .get('/agenda')
  .then((res) => {
    agendas.value = res.data;
    filteredAgendas.value = res.data;
  })
  .catch((e) => console.error(e));
const filter = ref('');
function filterAgendas() {
  filteredAgendas.value = agendas.value;
  if (filter.value === '') return;

  filteredAgendas.value = filteredAgendas.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase()),
  );
}
</script>

<style scoped>
.text-agenda-title {
  color: #f3eb61 !important;
}
</style>
