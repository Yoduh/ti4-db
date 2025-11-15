<template>
  <q-btn
    v-if="c.notes && c.notes.length > 0"
    @click="showNote(c)"
    color="amber-4"
    round
    dense
    size="12px"
    flat
    icon="help_outline"
  />
</template>

<script setup lang="ts">
import type { NoteSupportingComponent } from '@/components/models';
import { noteStore } from '@/store';

defineProps<{
  c: NoteSupportingComponent;
}>();

function showNote(item: NoteSupportingComponent) {
  noteStore.noteName = item.name;
  noteStore.noteTexts = item.notes;
  noteStore.noteDialog = true;
}
</script>

<style scoped></style>
