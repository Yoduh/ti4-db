<template>
  <div v-if="techs.length > 1">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab v-for="tech in renamedTechs" :key="tech.id" :name="tech.id" :label="tech.name" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel v-for="tech in renamedTechs" :key="tech.id" :name="tech.id">
        <h5 class="q-my-none" v-if="!tech.unit">
          {{ tech.name }}
          <q-btn
            v-if="tech.notes && tech.notes.length > 0"
            @click="emit('noteTrigger', tech)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </h5>
        <div v-if="tech.unit" class="q-mb-lg row">
          <UnitTable
            :unit="tech.unit"
            :prereqs="tech.prereqs"
            class="col col-sm-9 col-md-8 col-lg-5"
            @click="emit('noteTrigger', tech.unit)"
          />
        </div>
        <div v-else>
          <div style="white-space: pre-wrap">
            {{ tech.description }}
          </div>
          <div class="text-italic">
            Pre-requisites: <span v-if="!tech.prereqs">None</span>
            <span v-else v-for="(prereq, idx) in tech.prereqs" :key="idx">
              <TI4Icon
                type="tech"
                :name="tech.techType === 'Unit' ? prereq.techType : tech.techType"
                :quantity="prereq?.quantity"
              />
            </span>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <div v-else>
    <div v-for="tech in techs" :key="tech.id">
      <h5 class="q-my-none" v-if="!tech.unit">
        {{ tech.name }}
        <q-btn
          v-if="tech.notes && tech.notes.length > 0"
          @click="emit('noteTrigger', tech)"
          color="amber-4"
          round
          dense
          size="12px"
          flat
          icon="help_outline"
        />
      </h5>
      <div v-if="tech.unit" class="q-mb-lg row">
        <UnitTable
          :unit="tech.unit"
          :prereqs="tech.prereqs"
          class="col col-sm-9 col-md-8 col-lg-5"
          @click="emit('noteTrigger', tech.unit)"
        />
      </div>
      <div v-else>
        <div style="white-space: pre-wrap">
          {{ tech.description }}
        </div>
        <div class="text-italic">
          Pre-requisites: <span v-if="!tech.prereqs">None</span>
          <span v-else v-for="(prereq, idx) in tech.prereqs" :key="idx">
            <TI4Icon
              type="tech"
              :name="tech.techType === 'Unit' ? prereq.techType : tech.techType"
              :quantity="prereq?.quantity"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Technology } from './models';
import TI4Icon from '@/components/ti4Icon.vue';
import UnitTable from '@/components/unitTable.vue';

const props = defineProps({
  techs: {
    type: Array<Technology>,
    required: true,
  },
});
const emit = defineEmits(['noteTrigger']);

const tab = ref<number>();
const renamedTechs = computed(() => {
  return props.techs.map((t) => {
    const suffix = t.isDoubleOmega ? ' ΩΩ' : t.isOmega ? ' Ω' : '';

    return {
      ...t,
      name: t.name + suffix,
    };
  });
});

watch(
  () => props.techs,
  (techs) => {
    tab.value = techs[0].id;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
