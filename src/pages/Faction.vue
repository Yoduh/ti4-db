<template>
  <div v-if="faction">
    <h3>{{ faction.name }}</h3>

    <section class="q-mb-xl">
      <h5 class="q-mb-sm">Commodities: {{ faction.commodities }}</h5>

      <h5 class="q-mt-lg q-mb-sm">Starting Planets</h5>
      <div class="row">
        <div v-for="(planetTile, idx) in startingPlanets" :key="idx">
          <div v-if="planetTile[0].tile === 2" class="q-px-md">
            The Xxcha Kingdom
          </div>
          <div v-else-if="planetTile[0].tile === 14" class="q-px-md">
            The Mentak Coalition
          </div>
          <div v-else-if="planetTile[0].tile === 58" class="q-px-md">
            The Argent Flight
          </div>
          <div v-for="planet in planetTile" :key="planet.id" class="q-px-md">
            <strong>
              {{ planet.name }}
              <span v-if="planet.resource || planet.influence"
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
                contains {{ feature.name }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <h5 class="q-mt-lg q-mb-sm">Starting Technologies</h5>
      <!-- Argent Flight -->
      <div v-if="faction.id === 18" class="q-px-md">
        Choose TWO of the following:
      </div>
      <div class="row">
        <!-- Sardakk -->
        <div v-if="faction.id === 13" class="row q-px-md">None</div>
        <!-- Winnu -->
        <div v-else-if="faction.id === 15" class="q-px-md">
          Choose any 1 technology that has no prerequisites.
        </div>
        <!-- Council Keleres -->
        <div v-else-if="faction.id === 25" class="q-px-md">
          Choose 2 non-faction technologies owned by other players
        </div>
        <div
          v-for="tech in faction.startingTech"
          :key="tech.id"
          class="q-px-md"
        >
          <TI4Icon
            v-if="tech.techType !== 'Unit'"
            type="tech"
            :name="tech.techType"
          />
          {{ tech.name }}
        </div>
      </div>

      <h5 class="q-mt-lg q-mb-sm">Starting Units</h5>
      <div class="row">
        <div
          v-for="unit in faction.startingUnits"
          :key="unit.id"
          class="q-px-md"
        >
          {{ unit.starting_units.quantity }} {{ unit.name }}
        </div>
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Abilities</h5>
      <div
        v-for="ability in faction.abilities"
        :key="ability.id"
        class="q-mb-md"
      >
        <div class="flex items-center">
          <strong
            >{{ ability.name
            }}<span v-if="ability.isOmega"> &Omega;</span></strong
          ><q-btn
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
      <div
        v-for="promissory in faction.promissory_notes"
        :key="promissory.id"
        class="q-mb-md"
      >
        <div class="flex items-center">
          <strong
            >{{ promissory.name
            }}<span v-if="promissory.isOmega"> &Omega;</span></strong
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
      <h5 class="q-mt-lg q-mb-sm">Faction Leaders</h5>
      <div v-for="leader in faction.leaders" :key="leader.id" class="q-mb-md">
        <div class="flex items-center">
          <strong style="text-transform: uppercase">{{ leader.type }}</strong
          >: {{ leader.name }} <span v-if="leader.isOmega"> &Omega;</span>
          <q-btn
            v-if="leader.notes && leader.notes.length > 0"
            @click="showNote(leader)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <div>UNLOCK: {{ leader.criteria }}</div>
        <div class="q-mb-sm">
          {{ leader.effect }}
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
          @showNote="showNote"
        />
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Technology</h5>
      <div v-for="tech in faction.factionTech" :key="tech.id" class="q-mb-md">
        <div v-if="tech.techType !== 'Unit'">
          <div class="row items-center">
            <TI4Icon
              v-if="tech.techType !== 'Unit'"
              type="tech"
              :name="tech.techType"
            /><strong
              >{{ tech.name }}<span v-if="tech.isOmega"> &Omega;</span></strong
            ><q-btn
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
                :name="
                  tech.techType === 'Unit' ? prereq.techType : tech.techType
                "
                :quantity="prereq?.quantity"
              />
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="faction.id === 25" class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Planet</h5>
      <div class="row flex items-center">
        <TI4Icon type="trait" name="legendary" />
        <strong class="q-ml-xs">
          Custodia Vigilia (<span class="resource">2</span>/<span
            class="influence"
            >3</span
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
          While you control Mecatol Rex, it gains SPACE CANNON 5 and PRODUCTION
          3. Gain 2 command tokens when another player socres VP using Imperial.
        </div>
      </div>
    </section>
  </div>
  <NoteDialog
    v-model="noteDialog"
    :noteName="noteName"
    :noteTexts="noteTexts"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  Faction,
  Technology,
  Planet,
  Unit,
  Ability,
  Leader,
  PromissoryNote,
  Note,
} from 'components/models';
import { api } from '@/boot/axios';
import TI4Icon from 'components/ti4Icon.vue';
import NoteDialog from 'components/noteDialog.vue';
import UnitTable from '@/components/unitTable.vue';

const props = defineProps<{
  id: number;
}>();

const faction = ref<Faction | undefined>(undefined);

watch(
  () => props.id,
  (newId) => {
    api.get(`/faction/${newId}`).then((res) => {
      faction.value = res.data;
    });
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

function getUnitPrereqs(unit: Unit) {
  const tech = faction.value?.factionTech.find((ft) => {
    return ft.name === unit.name;
  });
  if (tech) return tech.prereqs;
}

const noteDialog = ref(false);
const noteName = ref('');
const noteTexts = ref<Note[] | undefined>([]);
function showNote(item: Ability | Technology | Unit | Leader | PromissoryNote) {
  noteName.value = item.name;
  noteTexts.value = item.notes;
  noteDialog.value = true;
}

const keleresNote = {
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
      text: "The Ul player's Terraform faction promissory note and the Nanoforge relic may be attached to Custodia Vigilia.",
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
