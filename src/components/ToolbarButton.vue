<template>
  <q-btn-dropdown
    v-if="button.splitBtn"
    class="q-mr-md"
    split
    :to="`/${button.label.toLowerCase()}`"
    :color="button.color"
    rounded
    v-model="dropdown"
    :auto-close="false"
    :label="button.label"
    :disable="button.disabled"
  >
    <q-list>
      <q-item
        v-for="(listBtn, index) in listBtns"
        ref="qicon"
        :key="index"
        :to="`/${button.label.toLowerCase()}/${
          listBtn.id ?? listBtn.name.toLowerCase().replaceAll(' ', '-')
        }`"
      >
        <q-item-section class="row">
          <TI4Icon
            v-if="showTI4Icon(button, listBtn)"
            type="tech"
            :name="listBtn.name"
          /><q-item-label>{{ listBtn.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
  <q-btn
    v-else
    class="q-mr-md"
    :class="{ 'q-px-lg': button.label === 'Rules' || button.label === 'Units' }"
    split
    :to="`/${button.label.toLowerCase()}`"
    :color="button.color"
    rounded
    v-model="dropdown"
    :auto-close="false"
    :label="button.label"
    :disable="button.disabled"
  />
</template>

<script setup lang="ts">
import TI4Icon from 'components/ti4Icon.vue';
import { api } from 'boot/axios';
import type { NavButton } from './models';
import { ref } from 'vue';
import { QIcon } from 'quasar';

type ListButton = {
  id: string;
  name: string;
};

const qicon = ref<QIcon[]>([]);
const dropdown = ref(false);

const props = defineProps<{
  button: NavButton;
}>();

const listBtns = ref<ListButton[]>([]);

if (props.button.endpoint) {
  api.get(`${props.button.endpoint}`).then((res) => {
    listBtns.value = res.data;
  });
}

function showTI4Icon(button: NavButton, listBtn: ListButton) {
  return button.label === 'Technology' && !['Unit', 'Faction'].includes(listBtn.name);
}
</script>

<style lang="scss" scoped>
.row {
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
</style>
