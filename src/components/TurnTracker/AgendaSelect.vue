<template>
  <q-select
    filled
    v-model="selection"
    @update:model-value="selectAgenda"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="options"
    option-label="name"
    :emit-value="false"
    map-options
    clearable
    @filter="filterFn"
    :hint="`Select ${type} Agenda`"
    style="width: 250px; padding-bottom: 32px"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { api } from '@/boot/axios';
import type { Agenda } from 'src/components/models';

defineProps<{
  type: string;
}>();

const model = defineModel<Agenda | undefined>();
const selection = ref(model.value?.name ?? '');
const options = ref<string[]>([]);

const agendas = ref<Agenda[]>([]);
api
  .get('/agenda')
  .then((res) => {
    agendas.value = res.data;
    options.value = agendas.value.map((a) => a.name);
  })
  .catch((e) => console.error(e));
const agendaNames = computed(() => agendas.value.map((a) => a.name));

function filterFn(val: string, update: (callback: () => void) => void) {
  update(() => {
    const needle = val.toLocaleLowerCase();
    options.value = agendaNames.value.filter((a) => a.toLocaleLowerCase().indexOf(needle) > -1);
  });
}

function selectAgenda() {
  const matchingAgenda = agendas.value.find((a) => a.name === selection.value);
  if (matchingAgenda) {
    model.value = matchingAgenda;
  } else {
    model.value = undefined;
  }
}

watch(model, (newVal) => {
  if (!newVal) {
    selection.value = '';
  }
});
</script>

<style scoped></style>
