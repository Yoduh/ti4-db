<template>
  <div>
    <q-input v-model="search" filled type="search" hint="Search" class="q-my-lg">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <h3>Promissory Notes</h3>
    <div class="row">
      <div v-for="note in nonFactionNotes" :key="note.id" class="col-12 col-md-8 q-mb-md">
        <div class="flex items-center text-h6">
          {{ note.name }}
          <NoteButton :c="note" />
        </div>
        <div class="q-mb-sm">
          {{ note.description }}
        </div>
      </div>
    </div>
    <q-separator class="q-mt-xl" />

    <h3 class="q-mb-md">Faction Promissory Notes</h3>
    <div class="row">
      <div v-for="(faction, i) in factionNotes" :key="i" class="col-12 col-md-8 q-mb-md">
        <div class="row items-center">
          <div style="width: 35px" class="flex justify-center items-center q-mr-sm">
            <img :src="getImage('logo', faction.id)" class="logo" />
          </div>
          <div class="text-bold text-h5">{{ faction.name }}</div>
        </div>
        <div class="row q-pl-lg">
          <div v-for="note in faction.notes" :key="note.id" class="row">
            <div class="q-my-none text-h6">{{ note.name }}</div>
            <NoteButton :c="note" />
            <div class="q-mb-sm">
              {{ note.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { type PromissoryNote } from 'src/components/models';
import NoteButton from '@/components/NoteButton.vue';
import { useGetImage } from '@/composables/useGetImage';
import { ref, computed } from 'vue';

const promissoryNotes = ref<PromissoryNote[]>([]);
const search = ref('');
const { getImage } = useGetImage();

type FactionNote = {
  name: string;
  id: number;
  notes: PromissoryNote[];
};

api
  .get('/components/promissory-notes')
  .then((res) => {
    promissoryNotes.value = res.data;
  })
  .catch((e) => console.error(e));

const filteredNotes = computed<PromissoryNote[]>(() => {
  return promissoryNotes.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const nonFactionNotes = computed<PromissoryNote[]>(() => {
  return filteredNotes.value.filter((d: PromissoryNote) => !d.factionId);
});
const factionNotes = computed<FactionNote[]>(() => {
  return groupNotes(filteredNotes.value.filter((d: PromissoryNote) => d.factionId));
});

function groupNotes(notes: PromissoryNote[]): FactionNote[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: any = {};

  for (const note of notes) {
    const val = note.faction!.name;
    if (!grouped[val]) {
      grouped[val] = [];
    }
    grouped[val].push(note);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.values(grouped).map((g: any) => {
    return { name: g[0].faction.name, id: g[0].faction.id, notes: g };
  });
}
</script>

<style scoped>
.logo {
  height: 40px;
  width: 100%;
  object-fit: contain;
}
</style>
