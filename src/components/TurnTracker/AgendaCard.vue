<template>
  <div>
    <div class="text-h5 q-mb-none">
      {{ agenda.name }}
      <NoteButton :c="agenda" />
    </div>

    <div class="text-bold text-agenda-title">
      {{ agenda.type.toUpperCase() }}
    </div>
    <div v-if="agenda.elect">
      <strong class="text-italic">Elect {{ agenda.elect }}</strong>
    </div>
    <div v-if="agenda.effect">{{ agenda.effect }}</div>
    <div v-if="agenda.forOption">
      <span class="text-bold text-italic">FOR:</span> {{ agenda.forOption }}
    </div>
    <div v-if="agenda.againstOption">
      <span class="text-bold text-italic">AGAINST:</span>
      {{ agenda.againstOption }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Agenda } from '@/components/models';
import NoteButton from '@/components/NoteButton.vue';

defineProps<{
  agenda: Agenda;
}>();
</script>

<style scoped></style>
