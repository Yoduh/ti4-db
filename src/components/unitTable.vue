<template>
  <q-table
    :rows="unitRows(unit)"
    :columns="unitColumns(unit)"
    hide-bottom
    :table-style="{
      display: unitColumns(unit).length === 0 ? 'none' : 'block',
    }"
    class="q-table q-mb-xl"
  >
    <template v-slot:top>
      <div class="flex column col">
        <div class="row">
          <div class="column col-auto">
            <q-img
              :src="getUnitImage(unit.type, unit.subtype, unit.name)"
              width="50px"
              class="q-mr-sm"
            />
          </div>
          <div class="column col-auto">
            <div class="row items-center">
              <div class="text-h6">{{ unit.name }}</div>
              <q-btn
                v-if="unit.notes && unit.notes.length > 0"
                @click="$emit('showNote')"
                color="amber-4"
                round
                dense
                size="12px"
                flat
                icon="help_outline"
              />
            </div>
            <div class="text-caption text-italic">
              {{ unit.subtype ? unit.subtype : unit.type }}
            </div>
            <div class="q-mb-sm" v-if="prereqs.length > 0">
              Pre-requisites:
              <span v-if="prereqs[0]?.techType === 'Breakthrough'" class="text-bold"
                >Breakthrough</span
              >
              <template v-else>
                <span v-for="(prereq, idx) in prereqs" :key="idx">
                  <TI4Icon type="tech" :name="prereq.techType" :quantity="prereq?.quantity" />
                </span>
              </template>
            </div>
          </div>
        </div>
        <div>
          <ul v-if="unit.unitAbility && unit.unitAbility.length > 0" class="q-ma-none">
            <li v-for="ability in unit.unitAbility" :key="ability.id">
              <span v-if="!ability.description">{{ ability.name }}</span>
              <span v-else>{{ ability.description }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { Unit } from 'components/models';
import type { QTableProps } from 'quasar';
import TI4Icon from 'components/ti4Icon.vue';
import { useGetImage } from '@/composables/useGetImage';

withDefaults(
  defineProps<{
    unit: Unit;
    prereqs?: { quantity: number; techType: string }[];
  }>(),
  {
    prereqs: () => [],
  },
);

const { getUnitImage } = useGetImage();

function unitColumns(unit: Unit) {
  const columns: QTableProps['columns'] = [];
  Object.entries(unit).forEach(([key, value]) => {
    if (columns && ['cost', 'combat', 'move', 'capacity'].includes(key) && value !== null) {
      columns.push({
        name: key,
        field: key,
        label: toTitleCase(key),
        align: 'center',
      });
    }
  });

  return columns;
}

function unitRows(unit: Unit) {
  return [
    {
      cost: unit.cost,
      combat: unit.combat,
      move: unit.move,
      capacity: unit.capacity,
    },
  ];
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
</script>

<style scoped>
.q-table :deep(tbody td) {
  font-size: 18px;
}
</style>
