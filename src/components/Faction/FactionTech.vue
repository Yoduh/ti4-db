<template>
  <section class="q-mb-xl">
    <h5 class="q-mt-lg q-mb-sm">Faction Technology</h5>
    <div class="row" v-if="nonUnitTech.length > 0">
      <div v-for="tech in nonUnitTech" :key="tech.id" class="col-12 col-md-8 q-mb-md">
        <div v-if="tech.techType !== 'Unit'">
          <div class="row items-center text-h6">
            <TI4Icon v-if="tech.techType !== 'Unit'" type="tech" :name="tech.techType" />
            <strong>{{ tech.name }}<span v-if="tech.isOmega"> &Omega;</span></strong>
            <q-btn
              v-if="tech.notes && tech.notes.length > 0"
              @click="$emit('showNote', tech)"
              color="amber-4"
              round
              dense
              size="12px"
              flat
              icon="help_outline"
            />
          </div>
          <div class="q-mb-sm">
            {{ tech.description }}
          </div>
          <div class="q-mb-sm">
            Pre-requisites:
            <span v-for="(prereq, idx) in tech.prereqs" :key="idx">
              <TI4Icon
                type="tech"
                :name="tech.techType === 'Unit' ? prereq.techType : tech.techType"
                :quantity="prereq?.quantity"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <strong class="text-h6">None</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Technology } from '@/components/models';
import TI4Icon from '@/components/ti4Icon.vue';
import { computed } from 'vue';

const props = defineProps({
  factionTech: {
    type: Array<Technology>,
    default: () => [],
  },
});

defineEmits(['showNote']);

const nonUnitTech = computed(
  () =>
    props.factionTech.filter((t) => t.techType !== 'Unit' && t.techType !== 'Breakthrough') ?? [],
);
</script>

<style scoped></style>
