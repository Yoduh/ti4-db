<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <Toolbar @toggleLeftDrawer="toggleLeftDrawer" />
    </q-header>
    <q-page-container>
      <div class="row justify-center">
        <div class="col-md-8">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Toolbar from 'components/Toolbar.vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
