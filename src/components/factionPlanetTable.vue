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
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-tile="props">
      <q-td :props="props">
        <div class="flex items-center">
          <div class="my-table-details">
            {{ props.row.tile < 10 ? '0' + props.row.tile : props.row.tile }}
          </div>
          <q-btn
            size="md"
            class="q-ml-xs"
            round
            flat
            @click="openImageDialog(props.row.tile, props.row.name)"
            icon="image"
          />
        </div>
      </q-td>
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
        {{ isFirstFactionRow(props.row.id, props.row.factionId) ? props.row.faction : '' }}
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="imageDialog">
    <img
      :src="dialogImage"
      style="overflow-y: hidden; height: 100%; object-fit: contain"
      :v-close-popup="false"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { QTableProps } from 'quasar';
import type { Planet } from './models';

defineProps<{
  factionSystems: Planet[];
}>();

const factionPlanetTable = ref();
const filter = ref('');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortedRows = ref<any[]>([]);
watch(
  () => factionPlanetTable.value?.filteredSortedRows,
  (rows) => {
    sortedRows.value = rows;
  },
);
function isFirstFactionRow(rowId: number, factionId: number) {
  const firstFactionRow = sortedRows.value.find((r) => r.factionId === factionId);
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
    name: 'tile',
    label: 'Tile',
    field: 'tile',
    align: 'left',
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

const imageDialog = ref(false);
const dialogImage = ref('');
function openImageDialog(tile: number | string, name: string) {
  if (!tile && name === 'Mirage') {
    tile = 'mirage';
  }
  dialogImage.value = `${process.env.API_URL}/images/systems/${tile}.png`;
  imageDialog.value = true;
}
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
