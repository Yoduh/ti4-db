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
    <span class="q-mr-lg logo" style="font-size: 25px" @click="goHome"
      ><strong>TI4 DB</strong></span
    >
    <div class="gt-sm">
      <ToolbarButton
        v-for="button in buttons"
        :key="button.id"
        :button="button"
      />
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import ToolbarButton from 'components/ToolbarButton.vue';
import type { NavButton } from './models';
import { useRouter } from 'vue-router';

defineProps<{
  buttons: NavButton[];
}>();

const router = useRouter();
function goHome() {
  router.push('/');
}
</script>

<style lang="scss" scoped>
.logo {
  cursor: pointer;
}
</style>
