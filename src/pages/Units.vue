<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterUnits"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Units</h3>
    <div class="row">
      <div
        v-for="unit in splitUnits[0]"
        :key="unit.id"
        class="q-mb-lg col col-12 col-md-6 q-px-lg"
      >
        <UnitTable :unit="unit" @showNote="showNote(unit)" />
      </div>
    </div>
    <h3>Faction Units</h3>
    <div
      v-for="factionUnits in splitUnits[1]"
      :key="factionUnits.faction"
      class="q-mb-xl"
    >
      <h4>{{ factionUnits.faction }}</h4>
      <div
        v-for="unit in factionUnits.units"
        :key="unit.id"
        class="q-mb-lg row"
      >
        <UnitTable
          :unit="unit"
          class="col col-sm-9 col-md-8 col-lg-5"
          @showNote="showNote(unit)"
        />
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
import { ref, computed } from 'vue';
import type { Unit, Note, Faction } from 'components/models';
import NoteDialog from 'components/noteDialog.vue';
import UnitTable from '@/components/unitTable.vue';

const Units = ref<Unit[]>([]);
const filteredUnits = ref<Unit[]>([]);
api.get('/unit').then((res) => {
  Units.value = res.data;
  filteredUnits.value = res.data;
});
const filter = ref('');
function filterUnits() {
  filteredUnits.value = Units.value;
  if (filter.value === '') return;

  filteredUnits.value = filteredUnits.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase())
  );
}

const splitUnits = computed<[Unit[], { faction: string; units: Unit[] }[]]>(
  () => {
    const factionUnits = [];
    const nonFactionUnits = [];
    for (const unit of filteredUnits.value) {
      if (unit.factionId === null) nonFactionUnits.push(unit);
      else {
        const idx = factionUnits.findIndex(
          (fu) => fu.faction === (unit.faction as Faction)?.name
        );
        if (idx !== -1) {
          factionUnits[idx].units.push(unit);
        } else {
          factionUnits.push({
            faction: (unit.faction as Faction)?.name,
            units: [unit],
          });
        }
      }
    }
    return [nonFactionUnits, factionUnits];
  }
);

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Partial<{ name: string; notes: Note[] }>) {
  noteName.value = item.name as string;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}
</script>

<style scoped></style>
