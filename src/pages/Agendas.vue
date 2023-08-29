<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterAgendas"
      type="search"
      hint="Filter"
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
        <q-btn
          v-if="agenda.notes && agenda.notes.length > 0"
          @click="showNote(agenda)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
      </h5>

      <div>{{ agenda.type.toUpperCase() }}</div>
      <div v-if="agenda.elect">
        <strong>Elect {{ agenda.elect }}</strong>
      </div>
      <div v-if="agenda.effect">{{ agenda.effect }}</div>
      <div v-if="agenda.forOption">FOR: {{ agenda.forOption }}</div>
      <div v-if="agenda.againstOption">Against: {{ agenda.againstOption }}</div>
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
import type { Agenda, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';

const agendas = ref<Agenda[]>([]);
const filteredAgendas = ref<Agenda[]>([]);
api.get('/agenda').then((res) => {
  agendas.value = res.data;
  filteredAgendas.value = res.data;
});
const filter = ref('');
function filterAgendas() {
  filteredAgendas.value = agendas.value;
  if (filter.value === '') return;

  filteredAgendas.value = filteredAgendas.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase())
  );
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Agenda) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}
</script>

<style scoped></style>
