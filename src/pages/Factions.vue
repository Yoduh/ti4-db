<template>
  <h3>Factions</h3>
  <div class="column">
    <div v-for="faction in factions" :key="faction.id">
      <RouterLink class="row items-center link" :to="`/factions/${faction.id}`">
        <div style="width: 60px" class="flex justify-center items-center">
          <img :src="getLogo(faction.id)" class="q-mr-sm" />
        </div>
        <div>{{ faction.name }}</div>
      </RouterLink>
      <q-separator class="q-my-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import type { Faction } from 'components/models';
import { ref } from 'vue';

const factions = ref<Faction[]>([]);
api.get('/faction/names').then((res) => {
  factions.value = res.data;
});

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
