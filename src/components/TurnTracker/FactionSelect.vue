<template>
  <q-card v-if="player">
    <q-card-section>
      <div class="text-h6">SEAT {{ seat + 1 }}</div>
      <q-input v-model="player.name" label="Player Name" dense />
      <q-select v-model="player.color" :options="colors" label="Color" dense clearable>
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
        clearable
        dense
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Player, SimpleFaction } from '@/components/turnModels';

defineProps<{
  factions: SimpleFaction[];
  colors: string[];
  seat: number;
}>();
const player = defineModel<Player | undefined>();

function bgClass(name: string | null) {
  return `bg-${name?.toLowerCase()}`;
}
</script>

<style scoped></style>
