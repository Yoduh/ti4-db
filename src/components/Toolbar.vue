<template>
  <q-toolbar class="bg-grey-9">
    <q-btn
      id="drawerBtn"
      @click="$emit('toggleLeftDrawer')"
      flat
      round
      dense
      icon="menu"
      class="lt-md q-mr-sm"
    />
    <span class="q-mr-lg" style="font-size: 25px"><strong>TI4 DB</strong></span>
    <div class="gt-sm">
      <ToolbarButton
        v-for="button in dropdownBtns"
        :key="button.id"
        :button="button"
      />
      <q-btn to="/rules" color="black" label="Rules" rounded class="q-px-lg" />
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import ToolbarButton from 'components/ToolbarButton.vue';
import type { NavButton } from './models';
import { computed } from 'vue';

const props = defineProps<{
  buttons: NavButton[];
}>();

const dropdownBtns = computed(() =>
  props.buttons.filter((b) => b.label !== 'Rules')
);
</script>

<style lang="scss" scoped></style>
