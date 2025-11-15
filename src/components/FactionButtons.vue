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
    content-style="min-width: 342px"
  >
    <q-list>
      <!-- Bookmarked factions -->
      <q-item v-for="(factionBtn, index) in bookmarks" ref="qicon" :key="index" class="q-pa-none">
        <q-item-section>
          <RouterLink
            v-for="btn in factionBtn"
            clickable
            :key="btn.id"
            class="link row q-pa-sm hoverable"
            :to="`/${button.label.toLowerCase()}/${
              btn.id ?? btn.name.toLowerCase().replaceAll(' ', '-')
            }`"
          >
            <div style="width: 35px" class="flex justify-center items-center q-mr-xs">
              <img :src="getImage('logo', btn.id)" class="logo" />
            </div>
            <TI4Icon v-if="showTI4Icon(button, btn)" type="tech" :name="btn.name" />
            <q-item-label>{{ btn.name }}</q-item-label>
          </RouterLink>
        </q-item-section>
        <q-item-section side>
          <q-icon
            @click="removeBookmark($event, factionBtn, index)"
            color="amber-4"
            name="star"
            class="full-height hoverable"
          />
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Non-bookmarked factions -->
      <q-item v-for="(factionBtn, index) in factionBtns" ref="qicon" :key="index" class="q-pa-none">
        <q-item-section>
          <RouterLink
            v-for="btn in factionBtn"
            clickable
            :key="btn.id"
            class="link row q-pa-sm hoverable"
            :to="`/${button.label.toLowerCase()}/${
              btn.id ?? btn.name.toLowerCase().replaceAll(' ', '-')
            }`"
          >
            <div style="width: 35px" class="flex justify-center items-center q-mr-xs">
              <img :src="getImage('logo', btn.id)" class="logo" />
            </div>
            <TI4Icon v-if="showTI4Icon(button, btn)" type="tech" :name="btn.name" />
            <q-item-label>{{ btn.name }}</q-item-label>
          </RouterLink>
        </q-item-section>
        <q-item-section side>
          <q-icon
            @click.prevent="addBookmark($event, factionBtn, index)"
            name="star_outline"
            class="full-height hoverable"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import TI4Icon from 'components/ti4Icon.vue';
import { api } from 'boot/axios';
import type { NavButton } from './models';
import { ref } from 'vue';
import { QIcon } from 'quasar';
import type { Faction } from '@/components/models';
import { useGetImage } from '@/composables/useGetImage';

type ListButton = {
  id: number;
  name: string;
};

const qicon = ref<QIcon[]>([]);
const dropdown = ref(false);

const props = defineProps<{
  button: NavButton;
}>();

const bookmarks = ref<ListButton[][]>([]);
const factionBtns = ref<ListButton[][]>([]);

const { getImage } = useGetImage();

if (props.button.endpoint) {
  api
    .get(`${props.button.endpoint}`)
    .then((res) => {
      factionBtns.value = res.data.map((f: Faction) => [f]);
      const firmamentIdx = factionBtns.value.findIndex((f) => f[0]?.id === 28);
      const obsidianIdx = factionBtns.value.findIndex((f) => f[0]?.id === 29);
      const obsidian = factionBtns.value.splice(obsidianIdx, 1)[0];
      if (obsidian && obsidian[0]) {
        factionBtns.value[firmamentIdx]?.push(obsidian[0]);
      }

      const loadedBookmarks = localStorage.getItem('bookmarks');
      if (loadedBookmarks) {
        bookmarks.value = JSON.parse(loadedBookmarks);
        if (factionBtns.value.length > 0) {
          factionBtns.value = factionBtns.value.filter(
            (btn) => !bookmarks.value.find((bk) => bk[0]?.id === btn[0]?.id),
          );
        }
      }
    })
    .catch((e) => console.error(e));
}

function showTI4Icon(button: NavButton, listBtn: ListButton) {
  return button.label === 'Technology' && !['Unit', 'Faction'].includes(listBtn.name);
}

function addBookmark(evt: PointerEvent, btn: ListButton[], index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  bookmarks.value.push(btn);
  factionBtns.value.splice(index, 1);
  qicon.value[index]?.$el.blur();
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
}
function removeBookmark(evt: PointerEvent, btn: ListButton[], index: number) {
  evt.stopPropagation();
  evt.preventDefault();
  const nextBtn = factionBtns.value.findIndex((b) => {
    if (b && b[0] && btn[0]) {
      return b[0].name.localeCompare(btn[0].name) > 0;
    }
  });
  factionBtns.value.splice(nextBtn, 0, btn);
  bookmarks.value.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
}
</script>

<style lang="scss" scoped>
.row {
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.link {
  color: white;
  text-decoration: none;
  width: 100%;
}
.q-item__section--side {
  padding-left: 0 !important;
  align-self: stretch;
  display: flex;
  align-items: center;
}

.hoverable {
  cursor: pointer;
  border-radius: var(--q-border-radius-md, 4px);
  transition: background-color 0.3s ease;
}
.hoverable:hover {
  background: rgba(0, 0, 0, 0.05);
}
.body--dark .hoverable:hover {
  background: rgba(255, 255, 255, 0.1);
}
.logo {
  height: 30px;
  width: 100%;
  object-fit: contain;
}
</style>
