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
          <span v-if="i === 1">Faction </span
          >{{ toTitleCase(techType) }} Technologies
        </h3>
        <TI4Icon
          v-if="techType !== 'unit' && techType !== 'faction'"
          type="tech"
          :name="techType"
          size="56px"
        />
      </div>
      <div v-for="(techArray, j) in split" :key="j">
        <h5 class="q-mb-sm text-bold">{{ techArray[0].faction?.name }}</h5>
        <div
          v-for="(tech, k) in techArray"
          :key="tech.id"
          :class="{ 'q-pl-lg': i > 0 }"
        >
          <h5 class="q-my-none" :class="{ 'q-mt-md': k > 0 }" v-if="!tech.unit">
            {{ tech.name }}<span v-if="tech.isOmega"> &Omega;</span>
            <q-btn
              v-if="tech.notes && tech.notes.length > 0"
              @click="showNote(tech)"
              color="amber-4"
              round
              dense
              size="12px"
              flat
              icon="help_outline"
            />
          </h5>
          <div v-if="tech.unit" class="q-mb-lg row">
            <UnitTable
              :unit="tech.unit"
              :prereqs="tech.prereqs"
              class="col col-sm-9 col-md-8 col-lg-5"
            />
          </div>
          <div v-else>
            <div>{{ tech.description }}</div>
            <div class="text-italic">
              Pre-requisites: <span v-if="!tech.prereqs">None</span>
              <span v-else v-for="(prereq, idx) in tech.prereqs" :key="idx">
                <TI4Icon
                  type="tech"
                  :name="
                    tech.techType === 'Unit' ? prereq.techType : tech.techType
                  "
                  :quantity="prereq?.quantity"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-xl" />
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
import { computed, ref, watch } from 'vue';
import type { Technology, Unit, Note } from 'components/models';
import TI4Icon from 'components/ti4Icon.vue';
import NoteDialog from 'components/noteDialog.vue';
import UnitTable from 'components/unitTable.vue';
import { groupBy } from 'lodash';

const props = defineProps<{
  techType: string;
}>();

const techs = ref<Technology[]>([]);
const filteredTechs = ref<Technology[]>([]);

watch(
  () => props.techType,
  (newType) => {
    api.get(`/technology/${newType}`).then((res) => {
      techs.value = res.data;
      filteredTechs.value = res.data;
    });
  },
  { immediate: true }
);

const filter = ref('');
function filterTechs() {
  filteredTechs.value = techs.value;
  if (filter.value === '') return;

  filteredTechs.value = filteredTechs.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase())
  );
}

const splitTech = computed(() => {
  if (props.techType !== 'faction')
    return [
      filteredTechs.value.filter((t) => !t.factionId).map((t) => [t]),
      Object.entries(
        groupBy(
          filteredTechs.value.filter((t) => t.factionId),
          'factionId'
        )
      ).map((o) => o[1]),
    ];
  else
    return [
      Object.entries(
        groupBy(
          filteredTechs.value.filter((t) => t.factionId),
          'factionId'
        )
      ).map((o) => o[1]),
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
