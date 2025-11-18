<template>
  <div class="spinner row no-wrap border rounded overflow-hidden">
    <q-input
      v-model.number="value"
      type="number"
      dense
      borderless
      class="spinner-input"
      input-class="text-center"
    />

    <div class="column no-wrap spinner-buttons">
      <q-btn
        icon="keyboard_arrow_up"
        dense
        unelevated
        padding="xs"
        class="spinner-btn"
        @click="increment"
      />
      <q-btn
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
const value = defineModel<number>({ default: 0 });
function increment() {
  console.log(value.value);
  value.value++;
}
function decrement() {
  if (value.value > 0) {
    value.value--;
  }
}
</script>

<style scoped>
.spinner {
  border: 1px solid var(--q-color-grey-5);
  width: 110px;
}

.spinner-input {
  flex: 1;
  min-width: 0;
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
