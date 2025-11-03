<template>
  <div v-if="faction">
    <div class="row items-center q-mt-lg">
      <img :src="getImage('logo', faction.id)" class="q-mr-sm" style="height: 100%" />
      <h3 class="q-ma-none">{{ faction.name }}</h3>
    </div>

    <section class="q-mb-xl">
      <div class="row items-space-between" :style="{ paddingLeft: 0 }">
        <div class="col-12 col-md-6">
          <h5 class="q-mb-sm">Commodities: {{ faction.commodities }}</h5>

          <h5 class="q-mt-lg q-mb-sm">Home Planets</h5>
          <div class="row">
            <div v-for="(planetTile, idx) in startingPlanets" :key="idx">
              <div v-if="Number(planetTile[0].tile) === 2" class="q-px-md">The Xxcha Kingdom</div>
              <div v-else-if="Number(planetTile[0].tile) === 14" class="q-px-md">
                The Mentak Coalition
              </div>
              <div v-else-if="Number(planetTile[0].tile) === 58" class="q-px-md">
                The Argent Flight
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
                  <div
                    v-for="(feature, index) in planet.features"
                    :key="index"
                    class="text-caption"
                  >
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

          <h5 class="q-mt-lg q-mb-sm">Starting Technologies</h5>
          <!-- Argent Flight -->
          <div v-if="faction.id === 18" class="q-px-md">Choose TWO of the following:</div>
          <div class="row" v-if="faction.startingTech.length > 0">
            <div v-for="tech in faction.startingTech" :key="tech.id" class="q-px-md">
              <TI4Icon
                v-if="tech.techType !== 'Unit' && tech.techType !== 'Starting'"
                type="tech"
                :name="tech.techType"
              />
              {{ tech.name }}
            </div>
          </div>
          <div v-else class="q-px-md">N/A</div>

          <h5 class="q-mt-lg q-mb-sm">Starting Units</h5>
          <div class="row">
            <template v-if="faction.startingUnits.length > 0">
              <div v-for="unit in faction.startingUnits" :key="unit.id" class="q-px-md">
                {{ unit.starting_units.quantity }} {{ unit.name }}
              </div>
            </template>
            <div else class="q-px-md">N/A</div>
          </div>
        </div>
        <div class="col-12 col-md-6 q-mt-lg">
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
                :src="getImage('sheetFront', faction.id)"
                @click="openImageDialog('sheetFront', faction.id)"
              />
            </q-carousel-slide>
            <q-carousel-slide name="back">
              <q-img
                :src="getImage('sheetBack', faction.id)"
                @click="openImageDialog('sheetBack', faction.id)"
              />
            </q-carousel-slide>
            <q-carousel-slide name="components" v-if="faction.id !== 25">
              <q-img
                :src="getImage('components', faction.id)"
                @click="openImageDialog('components', faction.id)"
              />
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </section>
    <q-dialog v-model="imageDialog">
      <img
        :src="carouselImage"
        style="overflow-y: hidden; height: 100%; object-fit: contain"
        :v-close-popup="false"
      />
    </q-dialog>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Abilities</h5>
      <div v-for="ability in faction.abilities" :key="ability.id" class="q-mb-md">
        <div class="flex items-center text-h6">
          <strong>{{ ability.name }}<span v-if="ability.isOmega"> &Omega;</span></strong>
          <q-btn
            v-if="ability.notes && ability.notes.length > 0"
            @click="showNote(ability)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <div class="q-mb-sm">
          {{ ability.description }}
        </div>
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Promissory Note</h5>
      <div v-for="promissory in faction.promissory_notes" :key="promissory.id" class="q-mb-md">
        <div class="flex items-center text-h6">
          <strong>{{ promissory.name }}<span v-if="promissory.isOmega"> &Omega;</span></strong
          ><q-btn
            v-if="promissory.notes && promissory.notes.length > 0"
            @click="showNote(promissory)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <div class="q-mb-sm">
          {{ promissory.description }}
        </div>
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Technology</h5>
      <template v-if="nonUnitTech.length > 0">
        <div v-for="tech in nonUnitTech" :key="tech.id" class="q-mb-md">
          <div v-if="tech.techType !== 'Unit'">
            <div class="row items-center text-h6">
              <TI4Icon v-if="tech.techType !== 'Unit'" type="tech" :name="tech.techType" />
              <strong>{{ tech.name }}<span v-if="tech.isOmega"> &Omega;</span></strong>
              <q-btn
                v-if="tech.notes && tech.notes.length > 0"
                @click="showNote(tech)"
                color="amber-4"
                round
                dense
                size="12px"
                flat
                icon="help_outline"
              />
            </div>
            <div class="q-mb-sm">
              {{ tech.description }}
            </div>
            <div class="q-mb-sm">
              Pre-requisites:
              <span v-for="(prereq, idx) in tech.prereqs" :key="idx">
                <TI4Icon
                  type="tech"
                  :name="tech.techType === 'Unit' ? prereq.techType : tech.techType"
                  :quantity="prereq?.quantity"
                />
              </span>
            </div>
          </div>
        </div>
      </template>
      <div v-else><strong class="text-h6">None</strong></div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Breakthrough</h5>
      <div v-for="breakthrough in faction.breakthroughs" :key="breakthrough.id" class="q-mb-md">
        <div class="row items-center text-h6">
          <strong>{{ breakthrough.name }}</strong>
          <q-btn
            v-if="breakthrough.notes && breakthrough.notes.length > 0"
            @click="showNote(breakthrough)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <div class="row items-center">
          <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy1" />
          <div v-else class="text-h6">N/A</div>
          <q-icon name="sync_alt" size="lg" class="q-mx-sm" />
          <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy2" />
          <div v-else class="text-h6">N/A</div>
        </div>
        <div class="q-mb-sm">
          {{ breakthrough.description }}
        </div>
        <div v-if="breakthrough.unit" class="row q-mt-lg">
          <div class="col col-sm-9 col-md-8 col-lg-5">
            <strong class="text-h6">{{ breakthrough.name }} (Flipped)</strong>
            <div class="row">
              <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy1" />
              <div v-else class="text-h6">N/A</div>
              <q-icon name="sync_alt" size="lg" class="q-mx-sm" />
              <TI4Icon v-if="breakthrough.synergy1" type="tech" :name="breakthrough.synergy2" />
              <div v-else class="text-h6">N/A</div>
            </div>
            <UnitTable
              :unit="breakthrough.unit"
              prereqs="Breakthrough"
              @showNote="showNote(breakthrough.unit)"
            />
          </div>
        </div>
      </div>
    </section>

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
      <div v-for="unit in faction.units" :key="unit.id" class="q-mb-lg row">
        <UnitTable
          :unit="unit"
          :prereqs="getUnitPrereqs(unit)"
          class="col col-sm-9 col-md-8 col-lg-5"
          @showNote="showNote(unit)"
        />
      </div>
    </section>

    <section v-if="faction.id === 25" class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Planet</h5>
      <div class="row flex items-center">
        <TI4Icon type="trait" name="legendary" />
        <strong class="q-ml-xs">
          Custodia Vigilia (<span class="resource">2</span>/<span class="influence">3</span
          >)</strong
        ><q-btn
          @click="showNote(keleresNote)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
        <div>
          While you control Mecatol Rex, it gains SPACE CANNON 5 and PRODUCTION 3. Gain 2 command
          tokens when another player scores VP using Imperial.
        </div>
      </div>
    </section>
  </div>
  <NoteDialog v-model="noteDialog" :noteName="noteName" :noteTexts="noteTexts" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Faction, Planet, Unit, Note } from 'components/models';
import { api } from '@/boot/axios';
import TI4Icon from 'components/ti4Icon.vue';
import NoteDialog from '@/components/noteDialog.vue';
import UnitTable from '@/components/unitTable.vue';
import FactionLeaderPanel from '@/components/FactionLeaderPanel.vue';
import { useGetImage } from '@/composables/useGetImage';

const props = defineProps<{
  id: number;
}>();

const faction = ref<Faction | undefined>(undefined);
const slide = ref('front');

watch(
  () => props.id,
  (newId) => {
    api.get(`/faction/${newId}`).then((res) => {
      faction.value = res.data;
    });
    slide.value = 'front';
  },
  { immediate: true }
);

const startingPlanets = computed(() => {
  if (!faction.value) return [];
  return Object.values(
    faction.value.planets.reduce<Planet[][]>((acc, current: Planet) => {
      acc[current.tile] = acc[current.tile] ?? [];
      acc[current.tile].push(current);
      return acc;
    }, [])
  );
});

const nonUnitTech = computed(
  () => faction.value?.factionTech.filter((t) => t.techType !== 'Unit') ?? []
);

function getUnitPrereqs(unit: Unit) {
  const tech = faction.value?.factionTech.find((ft) => {
    return ft.name === unit.name;
  });
  if (tech) return tech.prereqs;
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Partial<{ name: string; notes: Note[] }>) {
  noteName.value = item.name as string;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}

const { getImage } = useGetImage();

const imageDialog = ref(false);
const carouselImage = ref('');
function openImageDialog(type: string, id: number) {
  carouselImage.value = `${process.env.API_URL}/images/${id}/${type}.jpg`;
  imageDialog.value = true;
}

// Dammit Keleres, only for you...
const keleresNote: { name: string; notes: Note[] } = {
  name: 'Custodia Vigilia',
  notes: [
    {
      id: 1,
      parentNote: null,
      text: 'The Custodia Vigilia planet card is gained exhausted.',
    },
    {
      id: 2,
      parentNote: null,
      text: 'Units cannot be placed on Custodia Vigilia.',
    },
    {
      id: 3,
      parentNote: null,
      text: 'Custodia Vigilia is not adjacent to any system, unit, player or other planet.',
    },
    {
      id: 4,
      parentNote: null,
      text: 'The Keleres player cannot lose control of Custodia Vigilia.',
      children: [
        {
          id: 100,
          parentNote: 4,
          text: 'The Keleres player cannot be eliminated once they control Custodia Vigilia.',
        },
      ],
    },
    {
      id: 5,
      parentNote: null,
      text: 'Custodia Vigilia may be used to qualify for objectives, if it meets any other requirements listed.',
      children: [
        {
          id: 101,
          parentNote: 5,
          text: 'Custodia Vigilia cannot be used to qualify for any objective that requires planets in a system.',
        },
      ],
    },
    {
      id: 6,
      parentNote: null,
      text: 'Custodia Vigilia may be elected by any "elect planet" agendas. However, Custodia Vigilia may be immune to the effects of the agenda.',
    },
    {
      id: 7,
      parentNote: null,
      text: 'A player gains victory points from the Imperial strategy card only if they control Mecatol Rex. If they use the Imperial strategy card to score an objective, then they gain victory points from that objective, and not the Imperial strategy card.',
    },
    {
      id: 8,
      parentNote: null,
      text: 'The Keleres player may use a command token to perform the secondary of Imperial during the same strategic action that they gained that token.',
    },
    {
      id: 9,
      parentNote: null,
      text: 'When the Keleres player uses the Production ability of Custodia Vigilia, it is treated as though the Keleres player was using the Production abilitiy of one of their units on Mecatol Rex.',
      children: [
        {
          id: 102,
          parentNote: 9,
          text: 'This may trigger the abilities of the Sarween Tools technology, and other similar abilities.',
        },
        {
          id: 103,
          parentNote: 9,
          text: 'Custodia Vigilia counts towards scoring the Produce en Masse objective within the Mecatol Rex system.',
        },
      ],
    },
    {
      id: 10,
      parentNote: null,
      text: "The Ul player's Terraform faction promissory note may be attached to Custodia Vigilia.",
      children: [
        {
          id: 104,
          parentNote: 10,
          text: 'If Terraform is attached to Custodia Vigilia, it may be explored. However, Custodia Vigilia may be immune to the effects of some exploration cards.',
        },
      ],
    },
  ],
};
</script>

<style scoped>
section > div {
  padding-left: 2rem;
}
</style>
