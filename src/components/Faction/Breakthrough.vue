<template>
  <section class="q-mb-xl">
    <h5 class="q-mt-lg q-mb-sm">Breakthrough</h5>
    <div class="row">
      <div
        v-for="breakthrough in breakthroughs"
        :key="breakthrough.id"
        class="col-12 col-md-8 q-mb-md"
      >
        <div class="items-center text-h6">
          <strong>{{ breakthrough.name }}</strong>
          <q-btn
            v-if="breakthrough.notes && breakthrough.notes.length > 0"
            @click="$emit('showNote', breakthrough)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <div class="row items-center">
          <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy1" />
          <div v-else class="text-h6">N/A</div>
          <q-icon name="sync_alt" size="lg" class="q-mx-sm" />
          <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy2" />
          <div v-else class="text-h6">N/A</div>
        </div>
        <div class="q-mb-sm">
          {{ breakthrough.description }}
        </div>
        <div v-if="breakthrough.unit" class="row q-mt-lg">
          <div class="col col-sm-9 col-md-8 col-lg-5">
            <strong class="text-h6">{{ breakthrough.name }} (Flipped)</strong>
            <div class="row">
              <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy1" />
              <div v-else class="text-h6">N/A</div>
              <q-icon name="sync_alt" size="lg" class="q-mx-sm" />
              <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy2" />
              <div v-else class="text-h6">N/A</div>
            </div>
            <UnitTable
              :unit="breakthrough.unit"
              :prereqs="getUnitPrereqs(breakthrough.unit)"
              @click="$emit('showNote', breakthrough.unit)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Breakthrough, Unit } from '@/components/models';
import TI4Icon from '@/components/ti4Icon.vue';
import UnitTable from '@/components/unitTable.vue';

const props = defineProps({
  breakthroughs: {
    type: Array<Breakthrough>,
    default: () => [],
  },
});

defineEmits(['showNote']);

function getUnitPrereqs(unit: Unit) {
  if (props.breakthroughs.some((b) => b.unitId === unit.id)) {
    return [{ quantity: 1, techType: 'Breakthrough' }];
  } else return [];
}
</script>

<style scoped></style>
