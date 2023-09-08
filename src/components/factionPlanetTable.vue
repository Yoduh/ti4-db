<template>
  <q-table
    :rows="factionSystems"
    :columns="planetColumns"
    :pagination="{ rowsPerPage: 0 }"
    :filter="filter"
    hide-bottom
    class="planetTable q-mb-xl"
    ref="factionPlanetTable"
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-features="props">
      <q-td :props="props">
        <div v-for="(feature, idx) in props.row.features" :key="idx">
          <div>{{ feature.name }}</div>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-factionName="props">
      <q-td
        :props="props"
        :class="{
          factionRow: isFirstFactionRow(props.row.id, props.row.factionId),
        }"
      >
        {{
          isFirstFactionRow(props.row.id, props.row.factionId)
            ? props.row.faction
            : ''
        }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTableProps } from 'quasar';
import type { Planet } from './models';

type FactionPlanets = { faction: string; planets: Planet[] }[];

defineProps<{
  factionSystems: FactionPlanets;
}>();

const factionPlanetTable = ref();
const filter = ref('');

const sortedRows = ref<any[]>([]);
watch(
  () => factionPlanetTable.value?.filteredSortedRows,
  (rows) => {
    sortedRows.value = rows;
  }
);
function isFirstFactionRow(rowId: number, factionId: number) {
  const firstFactionRow = sortedRows.value.find(
    (r) => r.factionId === factionId
  );
  if (firstFactionRow.id === rowId) return true;
  return false;
}

const planetColumns = ref<QTableProps['columns']>([
  {
    name: 'factionName',
    label: 'Faction',
    field: 'faction',
    align: 'left',
    style: 'font-size: 18px',
    sortable: true,
  },
  {
    name: 'planetName',
    label: 'Name',
    field: 'name',
    align: 'left',
    style: 'font-size: 18px',
    sortable: true,
  },
  {
    name: 'resources',
    label: 'Resources',
    field: 'resource',
    align: 'center',
    style: 'font-size: 18px',
    sortable: true,
    classes: 'resource',
  },
  {
    name: 'influence',
    label: 'Influence',
    field: 'influence',
    align: 'center',
    style: 'font-size: 18px',
    sortable: true,
    classes: 'influence',
  },
  {
    name: 'features',
    label: 'Features',
    field: 'features',
    align: 'left',
    style: 'white-space: normal; max-width: 300px',
    sortable: true,
  },
]);
</script>

<style scoped>
.planetTable :deep(td) {
  border: 0;
}
.factionRow {
  border-top: 1px rgba(255, 255, 255, 0.28) solid !important;
}
.factionRow ~ :deep(td) {
  border-top: 1px rgba(255, 255, 255, 0.28) solid !important;
}
tr:first-child > td {
  border-top-width: 0px !important;
}
tr:first-child .factionRow ~ :deep(td) {
  border-top-width: 0px !important;
}
</style>
