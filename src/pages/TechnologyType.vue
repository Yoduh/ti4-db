<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterTechs"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div v-for="(split, i) in splitTech" :key="i">
      <div class="row items-center">
        <h3 class="q-my-lg">
          <span v-if="i === 1">Faction </span>{{ toTitleCase(techType) }} Technologies
        </h3>
        <TI4Icon
          v-if="techType !== 'unit' && techType !== 'faction'"
          type="tech"
          :name="techType"
          size="56px"
        />
      </div>
      <div v-for="(techArrays, j) in split" :key="j">
        <h5 class="q-mb-sm text-bold" v-if="techArrays[0] && techArrays[0][0]">
          {{ techArrays[0][0].faction?.name }}
        </h5>
        <TechPanel
          v-for="(techArray, k) in techArrays"
          :key="k"
          :class="{ 'q-pl-lg': i > 0, 'q-mt-md': k > 0 }"
          :techs="techArray"
          @noteTrigger="(e) => showNote(e)"
        />
      </div>
      <q-separator class="q-mt-xl" />
    </div>
  </div>
  <NoteDialog v-model="noteDialog" :noteName="noteName" :noteTexts="noteTexts" />
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { computed, ref, watch } from 'vue';
import type { Technology, Unit, Note } from 'components/models';
import TI4Icon from '@/components/ti4Icon.vue';
import NoteDialog from '@/components/noteDialog.vue';
import TechPanel from '@/components/TechPanel.vue';

const props = defineProps<{
  techType: string;
}>();

const techs = ref<Technology[]>([]);
const filteredTechs = ref<Technology[]>([]);

watch(
  () => props.techType,
  (newType) => {
    api
      .get(`/technology/${newType}`)
      .then((res) => {
        techs.value = res.data as Technology[];
        filteredTechs.value = res.data as Technology[];
      })
      .catch((e) => console.error(e));
  },
  { immediate: true },
);

function groupTechnologies(
  techs: Technology[],
  prop1: 'name' | 'factionId' | 'faction',
  prop2: 'name' | null = null,
): Technology[][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: any = {};

  for (const tech of techs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = tech[`${prop1}`];
    if (val && prop2) {
      val = val[`${prop2}`];
    }
    if (!grouped[val]) {
      grouped[val] = [];
    }
    grouped[val].push(tech);
  }
  return Object.values(grouped);
}

const filter = ref('');
function filterTechs() {
  filteredTechs.value = techs.value;
  if (filter.value === '') return;

  filteredTechs.value = filteredTechs.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase()),
  );
}

const splitTech = computed<Array<Array<Array<Array<Technology>>>>>(() => {
  if (props.techType !== 'faction') {
    const nonFactionTech = filteredTechs.value.filter((t) => !t.factionId);
    return [
      groupTechnologies(nonFactionTech, 'name').map((o) => [o]),
      groupTechnologies(
        filteredTechs.value.filter((t) => t.factionId),
        'faction',
        'name',
      ).map((o) => {
        return groupTechnologies(o, 'name');
      }),
    ];
  } else
    return [
      groupTechnologies(
        filteredTechs.value.filter((t) => t.factionId),
        'faction',
        'name',
      ).map((o) => {
        return groupTechnologies(o, 'name');
      }),
    ];
});

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Technology | Unit) {
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
