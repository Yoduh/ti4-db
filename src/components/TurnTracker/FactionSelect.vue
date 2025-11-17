<template>
  <q-card class="full-width" v-if="player">
    <q-card-section>
      <q-input v-model="player.name" label="Player Name" dense />
      <q-select v-model="player.color" :options="colors" label="Color" dense>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section class="text-center">
              <q-item-label :class="bgClass(scope.opt)">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:selected>
          <div :class="bgClass(player.color)" class="q-pl-sm full-width">{{ player.color }}</div>
        </template>
      </q-select>
      <q-select
        label="Faction"
        v-model="player.faction"
        option-label="name"
        :options="factions"
        dense
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Player } from '@/components/turnModels';

defineProps<{
  factions: string[];
}>();
const player = defineModel<Player | undefined>();
const colors = ref(['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Black']);

function bgClass(name: string) {
  return `bg-${name.toLowerCase()}`;
}
</script>

<style scoped></style>
