<template>
  <div>
    <q-input
      v-model="searchFilter"
      filled
      @update:model-value="filterUnits"
      type="search"
      hint="Search by unit name"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Units</h3>
    <div>
      <q-expansion-item
        switch-toggle-side
        label="Filter by Unit Type"
        header-class="bg-grey-10"
        style="border: 3px solid #212121"
      >
        <q-btn
          :label="typeSelectLabel"
          @click="typeFilterModelToggle"
          color="light-blue-10"
          size="small"
          class="q-ml-md q-mt-md"
        ></q-btn>
        <div class="row q-col-gutter-sm q-pa-md">
          <div v-for="t in types" :key="t.type" class="column col-12 col-sm-3">
            <q-checkbox
              :label="t.type"
              :val="t.type"
              v-model="typesFilterModel"
              @update:model-value="filterType(t.type, t.subtypes)"
              dense
              color="green"
            />
            <q-checkbox
              v-for="subtype in t.subtypes"
              :key="subtype"
              :label="subtype"
              :val="subtype"
              v-model="typesFilterModel"
              @update:model-value="filterSubType(t.type, subtype, t.subtypes)"
              class="q-ml-md"
              dense
              color="teal"
            />
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        switch-toggle-side
        label="Filter by Faction"
        class="q-my-md"
        header-class="bg-grey-10"
        style="border: 3px solid #212121"
      >
        <q-btn
          :label="factionSelectLabel"
          @click="factionFilterModelToggle"
          color="light-blue-10"
          size="small"
          class="q-ml-md q-mt-md"
        ></q-btn>
        <div class="row q-col-gutter-sm q-pa-md">
          <div
            v-for="faction in factions"
            :key="faction.label"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-checkbox
              :label="faction.label"
              :val="faction.value"
              v-model="factionFilterModel"
              @update:model-value="filterUnits"
              dense
              color="green"
            />
          </div>
        </div>
      </q-expansion-item>
    </div>
    <div class="row q-mb-xl">
      <UnitDataTable :units="filteredUnits" />
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 * TO-DO:
 * Refactor this page to show everything on one table to easily compare all values
 * Include filters for "Common Units" and "Faction Units"
 * Include further filtering for each type to compare all dreadnaughts, or destroyers, etc.
 * Include further filtering for each property: cost, movement, attack, unit ability, etc.
 */
import { api } from '@/boot/axios';
import { ref } from 'vue';
import type { Unit } from 'components/models';
import UnitDataTable from '@/components/UnitDataTable.vue';

const factionFilterModel = ref<Array<number | null>>([null]);
type factionFilter = {
  value: number | null;
  label: string;
};

const Units = ref<Unit[]>([]);
const filteredUnits = ref<Unit[]>([]);
const factions = ref<factionFilter[]>([{ value: null, label: 'NON-FACTION' }]);
api
  .get('/unit')
  .then((res) => {
    Units.value = res.data.sort((a: Unit, b: Unit) => {
      if (a.faction && b.faction) {
        return a.faction.name
          .replace(/^The\s+/i, '')
          .localeCompare(b.faction.name.replace(/^The\s+/i, ''));
      } else {
        return;
      }
    });
    filteredUnits.value = res.data;
    const unitMap = new Map();
    for (const u of Units.value) {
      if (u.factionId && u.faction?.name) {
        unitMap.set(u.faction.name, u.factionId);
      }
    }
    unitMap.forEach((v, k) => {
      factions.value.push({ value: v, label: k });
      factionFilterModel.value.push(v);
    });
  })
  .catch((e) => {
    console.error(e);
  });

const searchFilter = ref('');
const deselectedTypes = ref<string[]>([]);
function filterUnits() {
  if (searchFilter.value === '') {
    filteredUnits.value = Units.value;
  }
  // search filter
  filteredUnits.value = Units.value.filter((a) =>
    a.name.toLowerCase().includes(searchFilter.value.toLocaleLowerCase()),
  );

  // faction filter
  filteredUnits.value = filteredUnits.value.filter((u) =>
    factionFilterModel.value.includes(u.factionId),
  );

  // type filter
  deselectedTypes.value = typeValues.filter((t) => !typesFilterModel.value.includes(t));
  filteredUnits.value = filteredUnits.value.filter((u) => {
    return !deselectedTypes.value.some(
      (t) => u.name.startsWith(t) || u.type?.startsWith(t) || u.subtype?.startsWith(t),
    );
  });
}

const factionSelectLabel = ref('Deselect All');
function factionFilterModelToggle() {
  if (factionSelectLabel.value === 'Select All') {
    factionFilterModel.value = factions.value.map((f) => f.value);
    factionSelectLabel.value = 'Deselect All';
  } else {
    factionFilterModel.value = [];
    factionSelectLabel.value = 'Select All';
  }
  filterUnits();
}

const types = ref([
  {
    type: 'Ship',
    subtypes: ['Carrier', 'Cruiser', 'Destroyer', 'Dreadnought', 'Fighter', 'War Sun', 'Flagship'],
  },
  {
    type: 'Structure',
    subtypes: ['Space Dock', 'PDS'],
  },
  {
    type: 'Ground Force',
    subtypes: ['Infantry', 'Mech'],
  },
]);
const typeValues = types.value.map((t) => [t.type, ...t.subtypes]).flat();
const typesFilterModel = ref(typeValues);

const typeSelectLabel = ref('Deselect All');
function typeFilterModelToggle() {
  if (typeSelectLabel.value === 'Select All') {
    typesFilterModel.value = typeValues;
    typeSelectLabel.value = 'Deselect All';
  } else {
    typesFilterModel.value = [];
    typeSelectLabel.value = 'Select All';
  }
  filterUnits();
}

function filterType(val: string, subtypes: string[]) {
  // if selecting type, also add all related subtypes
  if (!typesFilterModel.value.includes(val)) {
    typesFilterModel.value = typesFilterModel.value.filter(
      (t) => t !== val && !subtypes.includes(t),
    );
    // if deselecting type, also deselect all related subtypes
  } else {
    const set = new Set(typesFilterModel.value);
    subtypes.forEach((t) => set.add(t));
    typesFilterModel.value = [...set];
  }
  filterUnits();
}

function filterSubType(type: string, subtype: string, siblingSubtypes: string[]) {
  // if type is deselected when subtype is selected, also select type
  if (typesFilterModel.value.includes(subtype) && !typesFilterModel.value.includes(type)) {
    typesFilterModel.value.push(type);
    // if the last subtype of type is deselected, also deselect type
  } else if (!typesFilterModel.value.some((t) => siblingSubtypes.includes(t))) {
    typesFilterModel.value = typesFilterModel.value.filter((t) => t !== type);
  }
  filterUnits();
}
</script>

<style scoped></style>
