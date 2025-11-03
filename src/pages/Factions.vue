<template>
  <h3>Factions</h3>
  <div class="column">
    <div v-for="faction in factions" :key="faction.id">
      <RouterLink
        v-if="faction.id !== 28"
        class="row items-center link"
        :to="`/factions/${faction.id}`"
      >
        <div style="width: 60px" class="flex justify-center items-center">
          <img :src="getLogo(faction.id)" class="q-mr-sm" />
        </div>
        <div>{{ faction.name }}</div>
      </RouterLink>
      <div v-else class="row items-center">
        <RouterLink :to="`/factions/${faction.id}`" class="link row items-center">
          <div style="width: 60px" class="flex justify-center items-center">
            <img :src="getLogo(faction.id)" class="q-mr-sm" width="55" />
          </div>
          <div>{{ faction.name }}</div>
        </RouterLink>
        <span style="font-size: 24px" class="q-mx-md">/</span>
        <RouterLink :to="`/factions/29`" class="link row items-center">
          <div style="width: 60px" class="flex justify-center items-center">
            <img :src="getLogo(29)" class="q-mr-sm" width="55" />
          </div>
          <div>The Obsidian</div>
        </RouterLink>
      </div>
      <q-separator class="q-my-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import type { Faction } from 'components/models';
import { ref } from 'vue';

const factions = ref<Faction[]>([]);
const firmament = ref<Faction[]>([]);
api
  .get('/faction/names')
  .then((res) => {
    factions.value = res.data;
    firmament.value = factions.value.filter((f) => f.id === 28 || f.id === 29);
    factions.value = factions.value.filter((f) => f.id !== 29);
  })
  .catch((e) => console.error(e));

function getLogo(id: number) {
  return `${process.env.API_URL}/images/${id}/logo.webp`;
}
</script>

<style scoped>
.link {
  color: #fff;
  text-decoration: none;
  font-size: 24px;
}
</style>
