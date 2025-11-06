<template>
  <q-carousel
    v-model="slide"
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    control-color="white"
    navigation
    padding
    arrows
    height="100%"
  >
    <q-carousel-slide name="front">
      <q-img
        :src="getImage('sheetFront', factionId)"
        @click="openImageDialog('sheetFront', factionId)"
      />
    </q-carousel-slide>
    <q-carousel-slide name="back">
      <q-img
        :src="getImage('sheetBack', factionId)"
        @click="openImageDialog('sheetBack', factionId)"
      />
    </q-carousel-slide>
    <q-carousel-slide name="components" v-if="factionId !== 25">
      <q-img
        :src="getImage('components', factionId)"
        @click="openImageDialog('components', factionId)"
      />
    </q-carousel-slide>
  </q-carousel>

  <q-dialog v-model="imageDialog">
    <img
      :src="carouselImage"
      style="overflow-y: hidden; height: 100%; object-fit: contain"
      :v-close-popup="false"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGetImage } from '@/composables/useGetImage';

const props = defineProps({
  factionId: {
    type: Number,
    default: 0,
  },
});

const { getImage } = useGetImage();

const slide = ref('front');

const imageDialog = ref(false);
const carouselImage = ref('');
function openImageDialog(type: string, id: number) {
  carouselImage.value = `${process.env.API_URL}/images/${id}/${type}.jpg`;
  imageDialog.value = true;
}

watch(
  () => props.factionId,
  () => {
    slide.value = 'front';
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
