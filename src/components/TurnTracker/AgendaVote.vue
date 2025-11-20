<template>
  <div class="column items-center" :class="{ abstained: row[f.abstain] }">
    <div class="row justify-center">
      <q-btn
        size="small"
        flat
        rounded
        dense
        color="grey-6"
        class="text-caption"
        :label="abstainLabel"
        @click="toggleAbstain"
      />
    </div>
    <div class="row justify-center items-center full-width">
      <div class="column items-center">
        <InfluenceCounter
          :disable="row[f.abstain]"
          v-model="row[f.agendaVotes]"
          :playerId="row.id"
          :type="f.agendaVotes"
        />
      </div>
      <div v-if="agenda?.elect" class="flex column justify-between">
        <q-input
          :disable="row[f.abstain]"
          v-model="row[f.electing]"
          type="text"
          label="Electing"
          style="max-width: 100px"
          class="q-ml-sm q-mb-sm"
        />
      </div>
      <div v-else-if="agenda?.forOption" class="flex column justify-between">
        <q-chip
          :disable="row[f.abstain]"
          v-model:selected="row[f.for]"
          @update:selected="row[f.against] = false"
          dense
          :color="row[f.for] ? 'green' : ''"
          text-color="white"
          icon="thumb_up"
          icon-selected="thumb_up"
        >
          FOR
        </q-chip>
        <q-chip
          :disable="row[f.abstain]"
          v-model:selected="row[f.against]"
          @update:selected="row[f.for] = false"
          dense
          :color="row[f.against] ? 'red' : ''"
          text-color="white"
          icon="thumb_down"
          icon-selected="thumb_down"
        >
          AGAINST
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Agenda } from '@/components/models';
import InfluenceCounter from '@/components/TurnTracker/InfluenceCounter.vue';
import { computed, nextTick } from 'vue';
import type { AgendaRow, VoteFieldGroup } from '@/components/turnModels';

const props = defineProps<{
  agenda: Agenda;
  type: 'agenda1' | 'agenda2';
}>();

const row = defineModel<AgendaRow>({ required: true });

const fieldMap: Record<'agenda1' | 'agenda2', VoteFieldGroup> = {
  agenda1: {
    abstain: 'abstain1',
    for: 'for1',
    against: 'against1',
    electing: 'electing1',
    agendaVotes: 'agenda1votes',
  },
  agenda2: {
    abstain: 'abstain2',
    for: 'for2',
    against: 'against2',
    electing: 'electing2',
    agendaVotes: 'agenda2votes',
  },
};
const f = fieldMap[props.type];

async function toggleAbstain() {
  row.value[f.abstain] = !row.value[f.abstain];
  await nextTick();
  if (row.value[f.abstain]) {
    row.value[f.for] = false;
    row.value[f.against] = false;
    row.value[f.electing] = '';
  }
}
const abstainLabel = computed(() => (row.value[f.abstain] ? 'Un-Abstain' : 'Abstain'));
</script>

<style scoped>
.q-btn :deep(.q-icon) {
  margin-right: 4px;
}

.abstained {
  opacity: 0.3;
  background: repeating-linear-gradient(
    45deg,
    rgba(99, 99, 99, 1) 0,
    rgba(0, 0, 0, 0.12) 2px,
    /* stripe thickness */ transparent 2px,
    transparent 10px /* gap between stripes */
  ) !important;
}
</style>
