<template>
  <span v-for="i in quantity" :key="i">
    <q-img v-if="icon" :src="icon" :height="size" :width="size" fit="contain" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const icons = import.meta.glob('../assets/*.{webp,svg}', { eager: true });

interface Props {
  type: 'tech' | 'trait';
  name: string;
  quantity?: number;
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: '30px',
  quantity: 1,
});

const icon = computed(() => {
  const name = props.name.toLowerCase();
  const ext =
    props.type === 'trait' && ['hazardous', 'cultural', 'industrial'].includes(name)
      ? 'svg'
      : 'webp';
  const path = `../assets/${props.type}-${name}.${ext}`;

  if (icons[path]) {
    return new URL(path, import.meta.url).href;
  } else {
    return null;
  }
});
</script>

<style scoped></style>
