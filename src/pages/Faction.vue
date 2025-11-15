<template>
  <div v-if="faction">
    <div class="row items-center q-mt-lg">
      <img :src="getImage('logo', faction.id)" class="q-mr-sm" style="height: 100%; width: 55px" />
      <h3 class="q-ma-none">{{ faction.name }}</h3>
    </div>
    <section class="q-mb-xl">
      <div class="row items-space-between" :style="{ paddingLeft: 0 }">
        <div class="col-12 col-md-6">
          <StartingInfo :commodities="faction.commodities" :planets="faction.planets" />
          <StartingTech :faction-id="faction.id" :starting-tech="faction.startingTech" />

          <h5 class="q-mt-lg q-mb-sm">Starting Units</h5>
          <div class="row q-pl-md">
            <template v-if="faction.startingUnits.length > 0">
              <div v-for="unit in faction.startingUnits" :key="unit.id" class="q-px-md">
                {{ unit.starting_units.quantity }} {{ unit.name }}
              </div>
            </template>
            <div else class="q-px-md">N/A</div>
          </div>
        </div>
        <div class="col-12 col-md-6 q-mt-lg">
          <ImageCarousel :faction-id="faction.id" />
        </div>
      </div>
    </section>

    <FactionAbilities :abilities="faction.abilities" />
    <FactionPromissoryNote :promissory-notes="faction.promissory_notes" />
    <FactionTech :faction-tech="faction.factionTech" />
    <Breakthrough :breakthroughs="faction.breakthroughs" />

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Leaders</h5>
      <div class="row">
        <div class="col col-sm-9 col-lg-8">
          <FactionLeaderPanel :leaders="faction.leaders" />
        </div>
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Units</h5>
      <UnitPanel :units="faction.units" :tech="faction.factionTech" />
    </section>
    <FactionComponents :components="faction.components" />

    <q-btn
      id="firmamentObsidianToggle"
      v-if="faction.id === 28 || faction.id === 29"
      size="35px"
      round
      :to="`/factions/${faction.id === 28 ? 29 : 28}`"
      icon="cached"
    >
      <q-tooltip v-if="faction.id === 28" class="text-body2">Switch to The Obsidian</q-tooltip>
      <q-tooltip v-else class="text-body2">Switch to The Firmament</q-tooltip>
      <q-img :src="getImage('logo', faction.id === 28 ? 29 : 28)" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Faction } from 'components/models';
import { api } from '@/boot/axios';
import FactionLeaderPanel from '@/components/FactionLeaderPanel.vue';
import { useGetImage } from '@/composables/useGetImage';
import { useScrollMemory } from '@/composables/useScrollMemory';
import StartingInfo from '@/components/Faction/StartingInfo.vue';
import StartingTech from 'src/components/Faction/StartingTech.vue';
import ImageCarousel from 'src/components/Faction/ImageCarousel.vue';
import FactionAbilities from 'src/components/Faction/FactionAbilities.vue';
import FactionPromissoryNote from 'src/components/Faction/FactionPromissoryNote.vue';
import FactionTech from 'src/components/Faction/FactionTech.vue';
import Breakthrough from 'src/components/Faction/Breakthrough.vue';
import FactionComponents from 'src/components/Faction/FactionComponents.vue';
import UnitPanel from 'src/components/UnitPanel.vue';

useScrollMemory();
const props = defineProps<{
  id: number;
}>();

const faction = ref<Faction | undefined>(undefined);

watch(
  () => props.id,
  (newId) => {
    api
      .get(`/faction/${newId}`)
      .then((res) => {
        faction.value = res.data;
      })
      .catch((e) => console.error(e));
  },
  { immediate: true },
);

const { getImage } = useGetImage();
</script>

<style lang="scss" scoped>
#firmamentObsidianToggle {
  position: fixed;
  bottom: 20px;
  right: 200px;

  @media (max-width: $breakpoint-md-max) {
    right: 100px;
  }

  @media (max-width: $breakpoint-xs-max) {
    right: 20px;
  }

  :deep(.q-icon) {
    position: absolute;
    z-index: 999;
    font-size: 2.2em;
    filter: drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.8));
  }
}
</style>
