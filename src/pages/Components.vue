<template>
  <h3>Components</h3>
  <div class="column">
    <div v-for="(component, idx) in components" :key="idx">
      <RouterLink :to="`/components/${url(component)}`" class="link">{{
        component
      }}</RouterLink>
      <q-separator class="q-my-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref } from 'vue';

const components = ref<string[]>([]);
api.get('/components').then((res) => {
  components.value = res.data.map((d: { name: string }) => d.name);
});

function url(component: string) {
  return component.replaceAll(' ', '-').toLowerCase();
}
</script>

<style scoped>
.link {
  color: #fff;
  text-decoration: none;
  font-size: 24px;
}
</style>
