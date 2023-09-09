<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <Toolbar @toggleLeftDrawer="toggleLeftDrawer" :buttons="buttons" />
    </q-header>
    <q-drawer
      ref="drawerTarget"
      v-model="drawer"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(button, index) in buttons" :key="index">
            <q-item
              clickable
              @click="drawer = false"
              :disable="button.disabled"
              :to="`/${button.label.toLowerCase()}`"
              :active="button.label === 'Outbox'"
              v-ripple
            >
              <q-item-section>
                {{ button.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <div class="row justify-center">
        <div class="col col-md-8 q-px-md">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Toolbar from 'components/Toolbar.vue';
import { onClickOutside } from '@vueuse/core';
import type { NavButton } from '@/components/models';

const drawer = ref(false);
const drawerTarget = ref();
onClickOutside(drawerTarget, (evt: PointerEvent) => {
  if (evt.target && !(evt.target as Element).classList.contains('q-icon')) {
    drawer.value = false;
  }
});

const buttons = reactive<NavButton[]>([
  {
    id: 0,
    label: 'Factions',
    color: 'red',
    endpoint: '/faction/names',
    disabled: false,
    splitBtn: true,
  },
  {
    id: 1,
    label: 'Technology',
    color: 'green',
    endpoint: '/technology/types',
    disabled: false,
    splitBtn: true,
  },
  {
    id: 2,
    label: 'Planets',
    color: 'blue',
    disabled: false,
    splitBtn: false,
  },
  {
    id: 3,
    label: 'Units',
    color: 'purple',
    // endpoint: '/unit/type',
    disabled: false,
    splitBtn: false,
  },
  {
    id: 4,
    label: 'Components',
    color: 'pink',
    endpoint: '/components',
    disabled: false,
    splitBtn: true,
  },
  {
    id: 5,
    label: 'Rules',
    color: 'black',
    disabled: false,
    splitBtn: false,
  },
]);

function toggleLeftDrawer() {
  drawer.value = !drawer.value;
}
</script>
