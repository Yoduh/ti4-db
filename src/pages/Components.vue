<template>
  <h3>Components</h3>
  <RouterLink
    :to="`/components/${url(component.name)}`"
    class="link"
    v-for="(component, idx) in components"
    :key="idx"
  >
    <div class="row items-center">
      <div class="col-2 col-sm-1 flex justify-end">
          <img :src="component.img" height="80px" />
      </div>
      <div class="col q-ml-md">
        {{ component.name }}
      </div>
      <hr class="full-width" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { ref } from 'vue';
import action from '@/assets/action.webp';
import agenda from '@/assets/agenda.webp';
import exploration from '@/assets/exploration-cards.webp';
import objective from '@/assets/objective.webp';
import promissory from '@/assets/promissory.webp';
import relic from '@/assets/relic.webp';
import strategy from '@/assets/strategy-cards.webp';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const images: any = {
  'Action Cards': action,
  Agendas: agenda,
  'Exploration Cards': exploration,
  'Strategy Cards': strategy,
  Objectives: objective,
  'Promissory Notes': promissory,
  Relics: relic,
};
console.log(images['actionCards']);

type Component = {
  name: string;
  img: string;
};
const components = ref<Component[]>([]);
api
  .get('/components')
  .then((res) => {
    components.value = res.data.map((d: { name: string }) => {
      return { name: d.name, img: images[d.name] ?? '' };
    });
  })
  .catch((e) => console.error(e));

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
