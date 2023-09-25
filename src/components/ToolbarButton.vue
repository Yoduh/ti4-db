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
      <!-- Bookmarked factions -->
      <q-item
        v-for="(listBtn, index) in bookmarks"
        ref="qicon"
        :key="index"
        :to="`/${button.label.toLowerCase()}/${listBtn.id ?? listBtn.name}`"
      >
        <q-item-section class="row">
          <div
            style="width: 35px"
            class="flex justify-center items-center q-mr-md"
          >
            <img :src="getLogo(listBtn.id)" style="height: 30px" />
          </div>
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
          <div
            v-if="isFactionList"
            style="width: 35px"
            class="flex justify-center items-center q-mr-md"
          >
            <img :src="getLogo(listBtn.id)" style="height: 30px" />
          </div>
          <TI4Icon
            v-if="showTI4Icon(button, listBtn)"
            type="tech"
            :name="listBtn.name"
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

const isFactionList = ref(false);
console.log('created');
const bookmarks = ref<ListButton[]>([]);
const listBtns = ref<ListButton[]>([]);

if (props.button.endpoint) {
  api.get(`${props.button.endpoint}`).then((res) => {
    listBtns.value = res.data;
    if (isFactionList.value) {
      const loadedBookmarks = localStorage.getItem('bookmarks');
      if (loadedBookmarks) {
        bookmarks.value = JSON.parse(loadedBookmarks);
        if (listBtns.value.length > 0) {
          listBtns.value = listBtns.value.filter(
            (btn) => !bookmarks.value.find((bk) => bk.id === btn.id)
          );
        }
      }
    }
  });
}
if (props.button.endpoint === '/faction/names') {
  isFactionList.value = true;
}

function showTI4Icon(button: NavButton, listBtn: ListButton) {
  return (
    button.label === 'Technology' && !['Unit', 'Faction'].includes(listBtn.name)
  );
}

function addBookmark(evt: PointerEvent, btn: ListButton, index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  bookmarks.value.push(btn);
  listBtns.value.splice(index, 1);
  qicon.value[index].$el.blur();
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
}
function removeBookmark(evt: PointerEvent, btn: ListButton, index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  const nextBtn = listBtns.value.findIndex(
    (b) => b.name.localeCompare(btn.name) > 0
  );
  listBtns.value.splice(nextBtn, 0, btn);
  bookmarks.value.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
}

function getLogo(id: string) {
  return `${process.env.API_URL}/images/${id}/logo.webp`;
}
</script>

<style lang="scss" scoped>
.row {
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
</style>
