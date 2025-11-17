<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <Toolbar
        @toggleLeftDrawer="toggleLeftDrawer"
        :buttons="buttons"
        :factionButtons="factionButtons"
      />
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
          <template v-for="(button, index) in mobileButtons" :key="index">
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
        <div class="col col-md-8 col-lg-7 q-px-md">
          <router-view />
        </div>
      </div>
    </q-page-container>
    <NoteDialog />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Toolbar from 'components/Toolbar.vue';
import { onClickOutside } from '@vueuse/core';
import type { NavButton } from '@/components/models';
import { useQuasar } from 'quasar';
import NoteDialog from '@/components/NoteDialog.vue';

const $q = useQuasar();
const drawer = ref(false);
const drawerTarget = ref();
onClickOutside(drawerTarget, (evt: PointerEvent) => {
  if (evt.target && !(evt.target as Element).classList.contains('q-icon')) {
    drawer.value = false;
  }
});

const factionButtons = reactive<NavButton[]>([
  {
    id: 0,
    label: 'Factions',
    color: 'red',
    endpoint: '/faction/names',
    disabled: false,
    splitBtn: true,
  },
]);
const buttons = reactive<NavButton[]>([
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
  {
    id: 6,
    label: 'Turn Tracker',
    color: 'orange',
    disabled: false,
    splitBtn: false,
  },
]);
const mobileButtons = [...factionButtons, ...buttons];

function toggleLeftDrawer() {
  drawer.value = !drawer.value;
}
</script>
