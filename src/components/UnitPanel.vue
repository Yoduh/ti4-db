<template>
  <div class="row" v-for="(unitGroup, i) in groupedUnits" :key="i">
    <div class="q-mb-md unit-panel col col-sm-9 col-lg-8">
      <q-tabs
        v-show="unitGroup.length > 1"
        v-model="tabs[i]"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab v-for="unit in unitGroup" :key="unit.id" :name="unit.id" :label="unit.name" />
      </q-tabs>
      <q-tab-panels v-model="tabs[i]" animated class="unit-tab-panels">
        <q-tab-panel v-for="unit in unitGroup" :key="unit.id" :name="unit.id" class="q-px-none">
          <UnitTable
            :unit="unit"
            :prereqs="getUnitPrereqs(unit)"
            @showNote="$emit('showNote', unit)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { type Technology, type Unit } from './models';
import UnitTable from '@/components/unitTable.vue';

const props = defineProps({
  units: {
    type: Array<Unit>,
    required: true,
  },
  tech: {
    type: Array<Technology>,
    required: true,
  },
});
defineEmits(['showNote']);

const tabs = ref<Array<number>>([]);
const groupedUnits = ref<Array<Array<Unit>>>([]);
function groupUnits() {
  tabs.value = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: any = {};

  for (let i = 0; i < props.units.length; i++) {
    const unit = props.units[i];
    const type = unit?.type;
    if (type && !grouped[type]) {
      grouped[type] = [];
    }
    if (type) {
      grouped[type].push(unit);
    }
  }
  groupedUnits.value = Object.values(grouped);
  groupedUnits.value.forEach((g: Unit[]) => {
    g.sort((a: Unit, b: Unit) => {
      if (b.name.includes('Ω') || a.name.includes('Ω')) return b.name.localeCompare(a.name);
      else return 0;
    });
    if (g[0]) {
      tabs.value.push(g[0].id);
    }
  });
}

function getUnitPrereqs(unit: Unit) {
  const tech = props.tech.find((ft) => {
    return ft.name === unit.name;
  });
  if (tech) return tech.prereqs;
  else return [];
}

watch(
  () => props.units,
  () => {
    groupUnits();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.unit-tab-panels {
  background-color: #121212;
}
</style>
