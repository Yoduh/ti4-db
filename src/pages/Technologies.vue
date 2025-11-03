<template>
  <h3>Technologies</h3>
  <div class="column">
    <div v-for="technology in technologies" :key="technology.id">
      <div class="row items-center">
        <RouterLink :to="`/technology/${technology.name.toLowerCase()}`" class="link">
          <TI4Icon
            v-if="technology.name !== 'Unit' && technology.name !== 'Faction'"
            type="tech"
            :name="technology.name"
            size="56px"
          />{{ technology.name }}
        </RouterLink>
      </div>
      <q-separator class="q-my-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import TI4Icon from 'components/ti4Icon.vue';
import type { Technology } from 'components/models';
import { ref } from 'vue';

const technologies = ref<Technology[]>([]);
api
  .get('/technology/types')
  .then((res) => {
    technologies.value = res.data;
  })
  .catch((e) => console.error(e));
</script>

<style scoped>
.link {
  color: #fff;
  text-decoration: none;
  font-size: 24px;
}
</style>
