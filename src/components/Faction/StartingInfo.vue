<template>
  <div>
    <h5 class="q-mb-sm">Commodities: {{ props.commodities }}</h5>

    <h5 class="q-mt-lg q-mb-sm">Home Planets</h5>
    <div class="row">
      <div v-for="(planetTile, idx) in startingPlanets" :key="idx">
        <div v-if="isMentak && planetTile[0]" class="q-px-md">
          {{ getMentakSystem(planetTile[0]) }}
        </div>
        <div v-for="planet in planetTile" :key="planet.id" class="q-px-md">
          <strong>
            {{ planet.name }}
            <span v-if="!!planet.resource || !!planet.influence"
              >(<span class="resource">{{ planet.resource }}</span
              >/<span class="influence">{{ planet.influence }}</span
              >)</span
            ></strong
          >
          <template v-if="planet.features">
            <div v-for="(feature, index) in planet.features" :key="index" class="text-caption">
              <span v-if="'name' in feature && feature.name !== 'Space Station'"
                >contains {{ feature.name }}</span
              >
              <span v-else-if="'name' in feature && feature.name === 'Space Station'">{{
                feature.name
              }}</span>
              <span v-else-if="'legendary' in feature">Legendary system</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Planet } from '@/components/models';

const props = defineProps({
  planets: {
    type: Array<Planet>,
    default: () => [],
  },
  commodities: {
    type: Number,
    default: 0,
  },
});

const startingPlanets = computed(() => {
  return Object.values(
    props.planets
      .map((p) => {
        return { ...p, tile: Number(p.tile) };
      })
      .reduce<Planet[][]>((acc, current: Planet) => {
        acc[current.tile] = acc[current.tile] ?? [];
        acc[current.tile]?.push(current);
        return acc;
      }, []),
  );
});
const isMentak = computed(() => {
  return props.planets[0]?.factionId === 25;
});
function getMentakSystem(planet: Planet) {
  switch (planet.tile) {
    case 2:
      return 'The Xxcha Kingdom';
    case 14:
      return 'The Mentak Coalition';
    case 58:
      return 'The Argent Flight';
  }
}
</script>

<style lang="scss" scoped></style>
