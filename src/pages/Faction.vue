<template>
  <div v-if="faction">
    <h3>{{ faction.name }}</h3>

    <section class="q-mb-xl">
      <h5 class="q-mb-sm">Commodities: {{ faction.commodities }}</h5>

      <h5 class="q-mt-lg q-mb-sm">Starting Planets</h5>
      <div class="row">
        <div v-for="planet in faction.planets" :key="planet.id" class="q-px-md">
          <strong>
            {{ planet.name }} (<span class="resource">{{
              planet.resource
            }}</span
            >/<span class="influence">{{ planet.influence }}</span
            >)</strong
          >
          <template v-if="planet.features">
            <ul>
              <li v-for="(feature, index) in planet.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </template>
        </div>
      </div>

      <h5 class="q-mt-lg q-mb-sm">Starting Technologies</h5>
      <div class="row">
        <div v-if="faction.startingTech.length === 0">None</div>
        <div
          v-for="tech in faction.startingTech"
          :key="tech.id"
          class="q-px-md"
        >
          <TechIcon v-if="tech.techType !== 'Unit'" :type="tech.techType" />
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
          >: {{ leader.name }}<span v-if="leader.isOmega"> &Omega;</span>
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
      <div v-for="unit in faction.units" :key="unit.id" class="q-mb-lg">
        <UnitTable :unit="unit" :prereqs="getUnitPrereqs(unit)" />
      </div>
    </section>

    <section class="q-mb-xl">
      <h5 class="q-mt-lg q-mb-sm">Faction Technology</h5>
      <div v-for="tech in faction.factionTech" :key="tech.id" class="q-mb-md">
        <div v-if="tech.techType !== 'Unit'">
          <div class="row items-center">
            <TechIcon
              v-if="tech.techType !== 'Unit'"
              :type="tech.techType"
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
              <TechIcon
                :type="
                  tech.techType === 'Unit' ? prereq.techType : tech.techType
                "
                :quantity="prereq?.quantity"
              />
            </span>
          </div>
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
import { ref, watch } from 'vue';
import type {
  Faction,
  Technology,
  Unit,
  Ability,
  Leader,
  PromissoryNote,
  Note,
} from 'components/models';
import { api } from '@/boot/axios';
import TechIcon from 'components/techIcon.vue';
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
</script>

<style scoped>
.q-table {
  min-width: 30rem;
  max-width: 30rem;
}

.q-table :deep(tbody td) {
  font-size: 18px;
}

section > div {
  padding-left: 2rem;
}
</style>
