<template>
  <section class="q-mb-xl">
    <h5 class="q-mt-lg q-mb-sm">Faction Abilities</h5>
    <div v-for="ability in abilities" :key="ability.id" class="q-mb-md">
      <div class="flex items-center text-h6">
        <strong>{{ ability.name }}<span v-if="ability.isOmega"> &Omega;</span></strong>
        <q-btn
          v-if="ability.notes && ability.notes.length > 0"
          @click="$emit('showNote', ability)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
      </div>
      <div class="q-mb-sm">
        {{ ability.description }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ability } from '@/components/models';

defineProps({
  abilities: {
    type: Array<Ability>,
    default: () => [],
  },
});

defineEmits(['showNote']);
</script>

<style lang="scss" scoped></style>
