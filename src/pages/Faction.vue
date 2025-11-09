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

    <FactionAbilities :abilities="faction.abilities" @show-note="showNote" />
    <FactionPromissoryNote :promissory-notes="faction.promissory_notes" @show-note="showNote" />
    <FactionTech :faction-tech="faction.factionTech" @show-note="showNote" />
    <Breakthrough :breakthroughs="faction.breakthroughs" @show-note="showNote" />

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Leaders</h5>
      <div class="row">
        <div class="col col-sm-9 col-lg-8">
          <FactionLeaderPanel :leaders="faction.leaders" @noteTrigger="(e) => showNote(e)" />
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
  <NoteDialog v-model="noteDialog" :noteName="noteName" :noteTexts="noteTexts" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Faction, Note } from 'components/models';
import { api } from '@/boot/axios';
import NoteDialog from '@/components/noteDialog.vue';
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

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Partial<{ name: string; notes: Note[] }>) {
  noteName.value = item.name as string;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}

const { getImage } = useGetImage();

// Dammit Keleres, only for you...
// const keleresNote: { name: string; notes: Note[] } = {
//   name: 'Custodia Vigilia',
//   notes: [
//     {
//       id: 1,
//       parentNote: null,
//       text: 'The Custodia Vigilia planet card is gained exhausted.',
//     },
//     {
//       id: 2,
//       parentNote: null,
//       text: 'Units cannot be placed on Custodia Vigilia.',
//     },
//     {
//       id: 3,
//       parentNote: null,
//       text: 'Custodia Vigilia is not adjacent to any system, unit, player or other planet.',
//     },
//     {
//       id: 4,
//       parentNote: null,
//       text: 'The Keleres player cannot lose control of Custodia Vigilia.',
//       children: [
//         {
//           id: 100,
//           parentNote: 4,
//           text: 'The Keleres player cannot be eliminated once they control Custodia Vigilia.',
//         },
//       ],
//     },
//     {
//       id: 5,
//       parentNote: null,
//       text: 'Custodia Vigilia may be used to qualify for objectives, if it meets any other requirements listed.',
//       children: [
//         {
//           id: 101,
//           parentNote: 5,
//           text: 'Custodia Vigilia cannot be used to qualify for any objective that requires planets in a system.',
//         },
//       ],
//     },
//     {
//       id: 6,
//       parentNote: null,
//       text: 'Custodia Vigilia may be elected by any "elect planet" agendas. However, Custodia Vigilia may be immune to the effects of the agenda.',
//     },
//     {
//       id: 7,
//       parentNote: null,
//       text: 'A player gains victory points from the Imperial strategy card only if they control Mecatol Rex. If they use the Imperial strategy card to score an objective, then they gain victory points from that objective, and not the Imperial strategy card.',
//     },
//     {
//       id: 8,
//       parentNote: null,
//       text: 'The Keleres player may use a command token to perform the secondary of Imperial during the same strategic action that they gained that token.',
//     },
//     {
//       id: 9,
//       parentNote: null,
//       text: 'When the Keleres player uses the Production ability of Custodia Vigilia, it is treated as though the Keleres player was using the Production abilitiy of one of their units on Mecatol Rex.',
//       children: [
//         {
//           id: 102,
//           parentNote: 9,
//           text: 'This may trigger the abilities of the Sarween Tools technology, and other similar abilities.',
//         },
//         {
//           id: 103,
//           parentNote: 9,
//           text: 'Custodia Vigilia counts towards scoring the Produce en Masse objective within the Mecatol Rex system.',
//         },
//       ],
//     },
//     {
//       id: 10,
//       parentNote: null,
//       text: "The Ul player's Terraform faction promissory note may be attached to Custodia Vigilia.",
//       children: [
//         {
//           id: 104,
//           parentNote: 10,
//           text: 'If Terraform is attached to Custodia Vigilia, it may be explored. However, Custodia Vigilia may be immune to the effects of some exploration cards.',
//         },
//       ],
//     },
//   ],
// };
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
