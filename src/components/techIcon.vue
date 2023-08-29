<template>
  <q-img
    v-for="i in quantity"
    :key="i"
    :src="icon"
    :height="size"
    :width="size"
    fit="contain"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type: string;
  quantity?: number;
  size?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: '30px',
  quantity: 1,
});

const icon = computed(() => {
  return new URL(
    `../assets/tech-${props.type.toLowerCase()}.png`,
    import.meta.url
  ).href;
});
</script>

<style scoped></style>
