<template>
  <h3>Factions</h3>
  <div class="column">
    <div v-for="faction in factions" :key="faction.id">
      <RouterLink :to="`/factions/${faction.id}`" class="link">{{
        faction.name
      }}</RouterLink>
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
</script>

<style scoped>
.link {
  color: #fff;
  text-decoration: none;
  font-size: 24px;
}
</style>
