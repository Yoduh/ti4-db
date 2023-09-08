<template>
  <q-table
    :rows="planets"
    :columns="planetColumns"
    :pagination="{ rowsPerPage: 0 }"
    :filter="filter"
    hide-bottom
    class="planetTable q-mb-xl"
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
    <template v-slot:body-cell-trait="props">
      <q-td :props="props">
        <div>
          <Ti4Icon
            v-if="props.row.trait"
            type="trait"
            :name="props.row.trait"
          />
        </div>
        <div class="my-table-details">
          {{ props.row.trait }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-tech="props">
      <q-td :props="props">
        <div>
          <Ti4Icon v-if="props.row.tech" type="tech" :name="props.row.tech" />
        </div>
        <div class="my-table-details">
          {{ props.row.tech }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-features="props">
      <q-td :props="props">
        <div v-for="(feature, idx) in props.row.features" :key="idx">
          <div v-if="!feature.legendary">{{ feature.name }}</div>
          <div v-else>
            <div></div>
            <div>
              <strong class="q-mr-xs">{{ feature.legendary.ability }}</strong>
              <Ti4Icon type="trait" name="legendary" />
            </div>
            <div class="q-ml-sm">{{ feature.legendary.description }}</div>
          </div>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps } from 'quasar';
import type { Planet } from './models';
import Ti4Icon from '@/components/ti4Icon.vue';

defineProps<{
  planets: Planet[];
}>();

const filter = ref('');

const planetColumns = ref<QTableProps['columns']>([
  {
    name: 'name',
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
    name: 'trait',
    label: 'Trait',
    field: 'trait',
    align: 'center',
    sortable: true,
  },
  {
    name: 'tech',
    label: 'Tech Specialty',
    field: 'tech',
    align: 'center',
    sortable: true,
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

<style lang="sass">
.planetTable
  /* height or max-height is important */
  max-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #1d1d1d

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
