<template>
  <section class="q-mb-xl">
    <h5 class="q-mt-lg q-mb-sm">Faction Promissory Note</h5>
    <div class="row">
      <div
        v-for="promissory in promissoryNotes"
        :key="promissory.id"
        class="col-12 col-md-8 q-mb-md"
      >
        <div class="flex items-center text-h6">
          <strong>{{ promissory.name }}</strong>
          <NoteButton :c="promissory" />
        </div>
        <div class="q-mb-sm">
          {{ promissory.description }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PromissoryNote } from '@/components/models';
import NoteButton from '@/components/NoteButton.vue';

defineProps({
  promissoryNotes: {
    type: Array<PromissoryNote>,
    default: () => [],
  },
});
</script>

<style scoped></style>
