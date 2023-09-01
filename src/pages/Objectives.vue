<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterObjectives"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Objectives</h3>
    <div
      v-for="objective in filteredObjectives"
      :key="objective.id"
      class="q-mb-xl"
    >
      <h5 class="q-mb-none">
        {{ objective.name }}<span v-if="objective.isOmega"> &Omega;</span>
        <q-btn
          v-if="objective.notes && objective.notes.length > 0"
          @click="showNote(objective)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
      </h5>
      <div>
        <strong
          >{{ toTitleCase(objective.type) }} Objective<span
            v-if="objective.stage"
          >
            - Stage {{ objective.stage }}</span
          >
          ({{ objective.points }} VP)</strong
        >
      </div>
      <div>
        <em>{{ toTitleCase(objective.phase) }} Phase</em>
      </div>
      <div>{{ objective.condition }}</div>
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
import type { Objective, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';

const objectives = ref<Objective[]>([]);
const filteredObjectives = ref<Objective[]>([]);
api.get('/objective').then((res) => {
  objectives.value = res.data;
  filteredObjectives.value = res.data;
});
const filter = ref('');
function filterObjectives() {
  filteredObjectives.value = objectives.value;
  if (filter.value === '') return;

  filteredObjectives.value = filteredObjectives.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase())
  );
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Objective) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
</script>

<style scoped></style>
