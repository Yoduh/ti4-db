<template>
  <div class="row items-center justify-center">
    <q-select
      v-model="speaker"
      :options="players"
      :option-label="speakerName"
      @update:model-value="sortPlayers"
      dense
      emit-value
      map-options
      outlined
      label="Speaker"
      class="q-ml-md"
      style="min-width: 150px"
    />
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import { type Player } from '@/components/turnModels';
import { ref } from 'vue';

const turnStore = useTurnTrackerStore();
const { players } = storeToRefs(turnStore);

const speaker = ref<Player | null>(turnStore.getSpeaker);
function speakerName(player: Player) {
  return player.name + ' - ' + player.faction?.name;
}
function sortPlayers(speaker: Player) {
  turnStore.setSpeaker(speaker.id);
}
</script>

<style scoped></style>
