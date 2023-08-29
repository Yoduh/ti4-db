<template>
  <q-toolbar class="bg-grey-9">
    <span class="q-mr-lg" style="font-size: 25px"><strong>TI4 DB</strong></span>
    <ToolbarButton
      v-for="button in buttons"
      :key="button.id"
      :button="button"
    />
    <q-btn to="/rules" color="black" label="Rules" rounded class="q-px-lg" />
  </q-toolbar>
</template>

<script setup lang="ts">
import ToolbarButton from 'components/ToolbarButton.vue';
import { reactive } from 'vue';

const buttons = reactive([
  {
    id: 0,
    label: 'Factions',
    color: 'red',
    endpoint: '/faction/names',
    disabled: false,
  },
  {
    id: 1,
    label: 'Technology',
    color: 'green',
    endpoint: '/technology/types',
    disabled: false,
  },
  {
    id: 2,
    label: 'Planets',
    color: 'blue',
    endpoint: '',
    // endpoint: '/planet/trait',
    disabled: true,
  },
  {
    id: 3,
    label: 'Units',
    color: 'purple',
    endpoint: '',
    // endpoint: '/unit/type',
    disabled: true,
  },
  {
    id: 4,
    label: 'Components',
    color: 'pink',
    endpoint: '/components',
    disabled: false,
  },
]);
</script>

<style lang="scss" scoped></style>
