<template>
  <div>
    <q-input
      v-model="filter"
      filled
      @update:model-value="filterTechs"
      type="search"
      hint="Search"
      class="q-mt-lg"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div v-for="(split, i) in splitTech" :key="i">
      <div class="row items-center">
        <h3 class="q-my-lg flex items-center">
          <span v-if="i === 1" class="whitespace-pre">Faction </span
          >{{ toTitleCase(techType) }} Technologies
          <TI4Icon
            v-if="techType !== 'unit' && techType !== 'faction'"
            type="tech"
            :name="techType"
            size="56px"
          />
        </h3>
      </div>
      <div v-for="(techArrays, j) in split" :key="j" class="q-mb-xl">
        <div class="row items-center" v-if="techArrays[0] && techArrays[0][0]">
          <div style="width: 35px" class="flex justify-center items-center q-mr-sm">
            <img
              v-if="techArrays[0][0].factionId"
              :src="getImage('logo', techArrays[0][0].factionId)"
              class="logo"
            />
          </div>
          <div class="text-bold text-h5">
            {{ techArrays[0][0].faction?.name }}
          </div>
        </div>
        <TechPanel
          v-for="(techArray, k) in techArrays"
          :key="k"
          :class="{ 'q-pl-lg': i > 0, 'q-mt-md': k > 0 }"
          :techs="techArray"
        />
      </div>
      <q-separator class="q-mt-xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/boot/axios';
import { computed, ref, watch } from 'vue';
import type { Technology } from '@/components/models';
import TI4Icon from '@/components/ti4Icon.vue';
import TechPanel from '@/components/TechPanel.vue';
import { useGetImage } from '@/composables/useGetImage';

const props = defineProps<{
  techType: string;
}>();

const { getImage } = useGetImage();
const techs = ref<Technology[]>([]);
const filteredTechs = ref<Technology[]>([]);

watch(
  () => props.techType,
  (newType) => {
    api
      .get(`/technology/${newType}`)
      .then((res) => {
        techs.value = res.data as Technology[];
        techs.value = techs.value.map((t) => {
          return { ...t, name: t.name.split(' Ω')[0] ?? '' };
        });
        filteredTechs.value = techs.value;
      })
      .catch((e) => console.error(e));
  },
  { immediate: true },
);

function groupTechnologies(
  techs: Technology[],
  prop1: 'name' | 'factionId' | 'faction',
  prop2: 'name' | null = null,
): Technology[][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: any = {};

  for (const tech of techs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = tech[`${prop1}`];
    if (val && prop2) {
      val = val[`${prop2}`];
    }
    if (!grouped[val]) {
      grouped[val] = [];
    }
    grouped[val].push(tech);
  }
  return Object.values(grouped);
}

const filter = ref('');
function filterTechs() {
  filteredTechs.value = techs.value;
  if (filter.value === '') return;

  filteredTechs.value = filteredTechs.value.filter((a) =>
    a.name.toLowerCase().includes(filter.value.toLocaleLowerCase()),
  );
}

const splitTech = computed<Array<Array<Array<Array<Technology>>>>>(() => {
  if (props.techType !== 'faction') {
    const nonFactionTech = filteredTechs.value.filter((t) => !t.factionId);
    return [
      groupTechnologies(nonFactionTech, 'name').map((o) => [o]),
      groupTechnologies(
        filteredTechs.value.filter((t) => t.factionId),
        'faction',
        'name',
      ).map((o) => {
        return groupTechnologies(o, 'name');
      }),
    ];
  } else
    return [
      groupTechnologies(
        filteredTechs.value.filter((t) => t.factionId),
        'faction',
        'name',
      ).map((o) => {
        return groupTechnologies(o, 'name');
      }),
    ];
});

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}
</script>

<style scoped>
.logo {
  height: 40px;
  width: 100%;
  object-fit: contain;
}
.whitespace-pre {
  white-space: pre;
}
</style>
