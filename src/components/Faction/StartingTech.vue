<template>
  <section>
    <h5 class="q-mt-lg q-mb-sm">Starting Technologies</h5>
    <!-- Argent Flight -->
    <div v-if="factionId === 18" class="q-px-md">Choose TWO of the following:</div>
    <div class="row" v-if="startingTech.length > 0">
      <div v-for="tech in startingTech" :key="tech.id" class="q-px-md">
        <TI4Icon
          v-if="tech.techType !== 'Unit' && tech.techType !== 'Starting'"
          type="tech"
          :name="tech.techType"
        />
        {{ tech.name }}
      </div>
    </div>
    <div v-else class="q-px-md">N/A</div>
  </section>
</template>

<script setup lang="ts">
import type { Technology } from '@/components/models';
import TI4Icon from '@/components/ti4Icon.vue';

defineProps({
  startingTech: {
    type: Array<Technology>,
    default: () => [],
  },
  factionId: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped></style>
