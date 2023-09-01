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
  return new URL(
    `../assets/${props.type}-${name.toLowerCase()}.${
      props.type === 'tech' || name === 'frontier' ? 'png' : 'svg'
    }`,
    import.meta.url
  ).href;
});
</script>

<style scoped></style>
