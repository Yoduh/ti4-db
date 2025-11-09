<template>
  <div>
    <q-input v-model="search" filled type="search" hint="Search" class="q-mt-lg">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Objectives</h3>
    <div class="q-ml-sm q-mb-xs text-caption">Filters:</div>
    <q-btn-group rounded glossy>
      <q-btn
        v-for="(button, index) in objectiveToggles"
        :key="index"
        :color="button.color"
        :label="button.label"
        rounded
        glossy
        @click="toggle(button)"
      ></q-btn>
    </q-btn-group>
    <div v-for="objective in filteredObjectives" :key="objective.id" class="q-mb-xl">
      <h5 class="q-mb-none">
        {{ objective.name }}
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
          >{{ toTitleCase(objective.type) }} Objective<span v-if="objective.stage">
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
  <NoteDialog v-model="noteDialog" :noteName="noteName" :noteTexts="noteTexts" />
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref, computed } from 'vue';
import type { Objective, Note } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';

const objectives = ref<Objective[]>([]);
api
  .get('/objective')
  .then((res) => {
    objectives.value = res.data;
  })
  .catch((e) => console.error(e));
const search = ref('');
const filteredObjectives = computed<Objective[]>(() => {
  return objectives.value.filter(
    (o) =>
      o.name.toLowerCase().includes(search.value.toLocaleLowerCase()) &&
      activeFilters.value.find((f) => f === o.stage.toLowerCase()) !== undefined,
  );
});

type toggleBtn = {
  label: string;
  stage: string;
  color: string;
  onColor: string;
};
const objectiveToggles = ref<toggleBtn[]>([
  {
    label: 'Public I',
    stage: 'i',
    color: 'amber-9',
    onColor: 'amber-9',
  },
  {
    label: 'Public II',
    stage: 'ii',
    color: 'blue-9',
    onColor: 'blue-9',
  },
  {
    label: 'Secret',
    stage: '',
    color: 'red-7',
    onColor: 'red-7',
  },
]);
const offColor = 'blue-grey-10';

const activeFilters = ref<string[]>(['i', 'ii', '']);

function toggle(option: toggleBtn) {
  if (activeFilters.value.length === 1 && activeFilters.value[0] === option.stage) {
    activeFilters.value = ['i', 'ii', ''];
    objectiveToggles.value.forEach((t) => (t.color = t.onColor));
  } else {
    activeFilters.value = [option.stage];
    objectiveToggles.value.forEach((t) =>
      t.stage === option.stage ? (t.color = t.onColor) : (t.color = offColor),
    );
  }
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
