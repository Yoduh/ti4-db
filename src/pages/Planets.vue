<template>
  <div>
    <h3>Non-Home Systems</h3>
    <PlanetTable :planets="planetSystems" />

    <h3>Home Systems</h3>
    <FactionPlanetTable :factionSystems="factionSystems" />
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { computed, ref } from 'vue';
import type { Planet, Faction } from 'components/models';
import PlanetTable from '@/components/planetTable.vue';
import FactionPlanetTable from '@/components/factionPlanetTable.vue';

const planets = ref<Planet[]>([]);
api.get('/planet').then((res) => {
  planets.value = res.data;
});

const factionSystems = computed(() =>
  planets.value
    .filter((p) => p.factionId !== null)
    .map((p) => {
      return { ...p, faction: (p.faction as Faction).name };
    })
);
const planetSystems = computed<Planet[]>(() =>
  planets.value.filter((p) => p.factionId === null && p.resource !== null)
);
const anomalySystems = computed<Planet[]>(() =>
  planets.value.filter((p) => p.factionId === null && p.resource === null)
);
</script>

<style scoped></style>
