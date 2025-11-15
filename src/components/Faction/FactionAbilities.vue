<template>
  <section class="q-mb-xl">
    <h5 class="q-mt-lg q-mb-sm">Faction Abilities</h5>
    <div class="row">
      <div v-for="ability in abilities" :key="ability.id" class="col-12 col-md-8 q-mb-md">
        <div class="flex items-center text-h6">
          <strong>{{ ability.name }}<span v-if="ability.isOmega"> &Omega;</span></strong>
          <NoteButton :c="ability" />
        </div>
        <div class="q-mb-sm">
          {{ ability.description }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Ability } from '@/components/models';
import NoteButton from '@/components/NoteButton.vue';

defineProps({
  abilities: {
    type: Array<Ability>,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped></style>
