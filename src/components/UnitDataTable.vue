<template>
  <q-table
    v-if="rows"
    title="Unit Comparison Table"
    :rows="rows"
    :columns="columns"
    row-key="name"
    wrap-cells
    hide-bottom
    class="sticky-header-table"
    :rows-per-page-options="[0]"
  >
    <template #body-cell-faction="props">
      <q-td :props="props">
        <div class="column justify-center items-center">
          <q-img v-if="props.row.faction" :src="getLogo(props.row.factionId)" width="40px" />
          <div>{{ props.row.faction?.name }}</div>
        </div>
      </q-td>
    </template>
    <template #body-cell-name="props">
      <q-td :props="props">
        <div class="column justify-center items-center">
          <q-img
            :src="getUnitImage(props.row.type, props.row.subtype, props.row.name)"
            width="60px"
          />
          <div>{{ props.row.name }}</div>
        </div>
      </q-td>
    </template>
    <template #body-cell-unitAbility="props">
      <q-td :props="props">
        <ul class="column">
          <li v-for="ability in props.row.unitAbility" :key="ability.id">
            <span v-if="!ability.description">{{ ability.name }}</span>
            <span v-else>{{ ability.description }}</span>
          </li>
        </ul>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { Unit } from '@/components/models';
import { computed, ref } from 'vue';
import { useGetImage } from '@/composables/useGetImage';
import { QTableColumn } from 'quasar';

const props = defineProps<{
  units: Unit[];
}>();
const { getUnitImage } = useGetImage();

const rows = computed(() => props.units);
const columns = ref<QTableColumn[]>([
  { name: 'faction', label: 'Faction', field: 'faction', align: 'center', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'center', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true },
  { name: 'unitAbility', label: 'Abilities', field: 'unitAbility', align: 'left', sortable: true },
  { name: 'cost', label: 'Cost', field: 'cost', style: 'width: 70px', sortable: true },
  { name: 'combat', label: 'Combat', field: 'combat', sortable: true },
  { name: 'move', label: 'Move', field: 'move', sortable: true },
  { name: 'capacity', label: 'Capacity', field: 'capacity', sortable: true },
]);

function getLogo(id: number) {
  return `${process.env.API_URL}/images/${id}/logo.webp`;
}
</script>

<style lang="scss" scoped>
.sticky-header-table {
  height: 800px;

  .q-table__top,
  .q-table__middle,
  :deep(thead tr:first-child th) {
    background-color: #1d1d1d;
  }

  :deep(thead tr th) {
    position: sticky;
    z-index: 1;
  }

  :deep(thead tr:first-child th) {
    top: 0;
  }

  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
