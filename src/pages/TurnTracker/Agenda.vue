<template>
  <div class="row q-mt-lg justify-center items-center">
    <div class="column col-12 col-md-8 justify-center items-center">
      <div class="text-h4 text-center">Agenda Phase</div>
      <q-btn
        label="Skip"
        color="primary"
        size="xl"
        class="q-mt-md"
        to="/turn-tracker/strategy"
        style="width: 150px"
      />
      <SpeakerSelect class="q-my-md" />
      <div v-for="player in votingOrder" :key="player?.id">
        <q-card v-if="player" class="row">
          <q-card-section class="column">
            <div class="text-h4">{{ player.name }}</div>
            <div>{{ player.faction?.name }}</div>
          </q-card-section>
          <q-card-section class="column">
            <div>Influence</div>
            <InfluenceCounter v-model="player.influence" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTurnTrackerStore } from '@/stores/turnTracker';
import { storeToRefs } from 'pinia';
import SpeakerSelect from '@/components/TurnTracker/SpeakerSelect.vue';
import { computed } from 'vue';
import InfluenceCounter from 'src/components/TurnTracker/InfluenceCounter.vue';

const turnStore = useTurnTrackerStore();
const { players } = storeToRefs(turnStore);

const votingOrder = computed(() => {
  return [...players.value.slice(1), players.value[0]];
});
</script>

<style scoped></style>
