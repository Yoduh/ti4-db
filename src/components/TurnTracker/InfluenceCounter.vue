<template>
  <div class="spinner row no-wrap border rounded overflow-hidden">
    <q-input
      v-model.number="value"
      type="number"
      class="spinner-input text-h4"
      :disable="disable"
    />

    <div class="column no-wrap spinner-buttons">
      <q-btn
        :disable="disable"
        icon="keyboard_arrow_up"
        dense
        unelevated
        padding="xs"
        class="spinner-btn"
        @click="increment"
      />
      <q-btn
        :disable="disable"
        icon="keyboard_arrow_down"
        dense
        unelevated
        padding="xs"
        class="spinner-btn"
        @click="decrement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTurnTrackerStore } from 'src/stores/turnTracker';
import { watch } from 'vue';

const props = defineProps<{
  disable?: boolean;
  playerId: number;
  type: 'influence' | 'agenda1votes' | 'agenda2votes';
}>();

const value = defineModel<number>({ default: 0 });
function increment() {
  value.value++;
}
function decrement() {
  if (value.value > 0) {
    value.value--;
  }
}

watch(
  () => props.disable,
  (val) => {
    if (val) {
      value.value = 0;
    }
  },
);

const turnStore = useTurnTrackerStore();
const { players } = storeToRefs(turnStore);
// "string | number | null" comes from Quasar's update event and must be used
function updatePlayerInfluence(val: string | number | null) {
  const player = players.value.find((p) => p.id === props.playerId);
  if (player) {
    const influence = Number(val);
    player[props.type] = influence;
  }
}
watch(value, (newVal) => updatePlayerInfluence(newVal));
</script>

<style scoped>
.spinner {
  border: 1px solid var(--q-color-grey-5);
}

.spinner-input {
  flex: 1;
  max-width: 50px;
}
/* Chrome, Safari, Edge, Opera */
.q-input :deep(input::-webkit-outer-spin-button),
.q-input :deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.q-input :deep(input[type='number']) {
  -moz-appearance: textfield;
}

.spinner-buttons {
  width: 28px;
  border-left: 1px solid var(--q-color-grey-5);
}

.spinner-btn {
  height: 50%;
  border-radius: 0;
}
</style>
