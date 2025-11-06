<template>
  <section class="q-mb-xl" v-if="components.length > 0">
    <h5 class="q-mt-lg q-mb-sm">Faction Components</h5>
    <q-table
      v-if="mergedRows.length > 0"
      :rows="mergedRows"
      :columns="columns"
      row-key="name"
      flat
      bordered
      wrap-cells
      hide-bottom
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- "type" column (conditionally rendered for rowspan) -->
          <q-td
            v-if="props.row.showType"
            :rowspan="props.row.rowspan"
            style="vertical-align: middle"
            :props="props"
            key="type"
            no-hover
          >
            {{ props.row.type }}
          </q-td>
          <!-- Other columns -->
          <q-td :props="props" key="name">{{ props.row.name }}</q-td>
          <q-td :props="props" key="description" style="white-space: pre-wrap">
            {{ props.row.description }}
          </q-td>
          <q-td :props="props" key="quantity">{{ props.row.quantity }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>

<script setup lang="ts">
import type { FactionComponent } from '@/components/models';
import type { QTableColumn } from 'quasar';
import { computed } from 'vue';

const props = defineProps({
  components: {
    type: Array<FactionComponent>,
    default: () => [],
  },
});

defineEmits(['showNote']);

const allColumns: QTableColumn[] = [
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'center',
    sortable: true,
    headerStyle: 'white-space: nowrap;',
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    align: 'center',
    sortable: true,
    headerStyle: 'white-space: nowrap;',
  },
];
const noQuantities = computed(() => !props.components.some((c) => c.quantity !== null));
const columns = computed<QTableColumn[]>(() => {
  if (noQuantities.value) return allColumns.slice(0, -1);
  else return allColumns;
});

// Compute merged rows info (adds showType + rowspan flags)
const mergedRows = computed(() => {
  const rows = props.components;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];

  let i = 0;
  while (i < rows.length) {
    const currentType = rows[i]?.type;
    let rowspan = 1;

    // count how many adjacent rows share the same type
    while (i + rowspan < rows.length && rows[i + rowspan]?.type === currentType) {
      rowspan++;
    }

    for (let j = 0; j < rowspan; j++) {
      result.push({
        ...rows[i + j],
        showType: j === 0, // show only on first occurrence
        rowspan,
      });
    }

    i += rowspan;
  }

  return result;
});
</script>
<style scoped></style>
