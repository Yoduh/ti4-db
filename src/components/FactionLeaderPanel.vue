<template>
  <div class="q-mb-md leader-panel" v-for="(leaderGroup, i) in groupedLeaders" :key="i">
    <q-tabs
      v-show="leaderGroup.length > 1"
      v-model="tabs[i]"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab
        v-for="leader in leaderGroup"
        :key="leader.id"
        :name="leader.id"
        :label="leader.name"
      />
    </q-tabs>
    <q-tab-panels v-model="tabs[i]" animated class="leader-tab-panels">
      <q-tab-panel v-for="(leader, j) in leaderGroup" :key="leader.id" :name="leader.id">
        <div class="flex items-center text-h6">
          <strong style="text-transform: uppercase">{{ leader.type }}</strong
          >: {{ leader.name }}
          <q-btn
            v-if="leader.notes && leader.notes.length > 0"
            @click="emit('noteTrigger', leader)"
            color="amber-4"
            round
            dense
            size="12px"
            flat
            icon="help_outline"
          />
        </div>
        <img :src="getImage(leader.type.toLowerCase(), leader.factionId, j)" />
        <div>UNLOCK: {{ leader.criteria }}</div>
        <div class="q-mb-sm" style="white-space: pre-wrap">
          {{ leader.effect }}
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Leader } from './models';
import { useGetImage } from '@/composables/useGetImage';

const props = defineProps({
  leaders: {
    type: Array<Leader>,
    required: true,
  },
});
const { getImage } = useGetImage();
const emit = defineEmits(['noteTrigger']);

const tabs = ref<Array<number>>([]);
const groupedLeaders = ref<Array<Array<Leader>>>([]);
function groupLeaders() {
  tabs.value = [];
  const grouped: any = {};

  for (let i = 0; i < props.leaders.length; i++) {
    const leader = props.leaders[i];
    const type = leader.type;
    if (!grouped[type]) {
      grouped[type] = [];
      tabs.value.push(leader.id);
    }
    grouped[type].push(leader);
  }
  groupedLeaders.value = Object.values(grouped);
}
watch(
  () => props.leaders,
  () => {
    groupLeaders();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.leader-panel {
  border: 3px solid #212121;
  border-radius: 10px;
}
.leader-tab-panels {
  background-color: #121212;
  border-radius: 10px;
}
</style>
