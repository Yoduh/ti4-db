<template>
  <q-btn-dropdown
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
      <!-- Bookmarked factions -->
      <q-item
        v-for="(listBtn, index) in bookmarks"
        ref="qicon"
        :key="index"
        :to="`/${button.label.toLowerCase()}/${listBtn.id ?? listBtn.name}`"
      >
        <q-item-section class="row">
          <q-item-label>{{ listBtn.name }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="isFactionList" side>
          <q-icon
            @click="removeBookmark($event, listBtn, index)"
            name="star"
            color="amber-4"
          />
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Non-bookmarked factions and other dropdowns -->
      <q-item
        v-for="(listBtn, index) in listBtns"
        ref="qicon"
        :key="index"
        :to="`/${button.label.toLowerCase()}/${
          listBtn.id ?? listBtn.name.toLowerCase().replaceAll(' ', '-')
        }`"
      >
        <q-item-section class="row">
          <TechIcon
            v-if="showTechIcon(button, listBtn)"
            :type="listBtn.name"
          /><q-item-label>{{ listBtn.name }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="isFactionList" side>
          <q-icon
            @click.prevent="addBookmark($event, listBtn, index)"
            name="star_outline"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import TechIcon from 'components/techIcon.vue';
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

const isFactionList = ref(false);
const listBtns = ref<ListButton[]>([]);
if (props.button.endpoint) {
  api.get(`${props.button.endpoint}`).then((res) => {
    listBtns.value = res.data;
  });
}
if (props.button.endpoint === '/faction/names') {
  isFactionList.value = true;
}

function showTechIcon(button: NavButton, listBtn: ListButton) {
  return (
    button.label === 'Technology' && !['Unit', 'Faction'].includes(listBtn.name)
  );
}

const bookmarks = ref<ListButton[]>([]);
function addBookmark(evt: PointerEvent, btn: ListButton, index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  bookmarks.value.push(btn);
  listBtns.value.splice(index, 1);
  qicon.value[index].$el.blur();
  console.log(qicon.value[index]);
}
function removeBookmark(evt: PointerEvent, btn: ListButton, index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  const nextBtn = listBtns.value.findIndex(
    (b) => b.name.localeCompare(btn.name) > 0
  );
  listBtns.value.splice(nextBtn, 0, btn);
  bookmarks.value.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.row {
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
</style>
