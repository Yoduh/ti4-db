<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ noteName }}</div>
      </q-card-section>

      <q-card-section>
        <ol class="parentNotes">
          <li class="q-pt-none" v-for="note in noteArrays" :key="note.id">
            {{ note.text }}
            <ol v-if="note.children" class="subNotes">
              <li v-for="subnote in note.children" :key="subnote.id">
                {{ subnote.text }}
              </li>
            </ol>
          </li>
        </ol>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Note } from './models';
import { computed } from 'vue';

const props = defineProps<{
  noteName: string;
  noteTexts: Note[] | undefined;
}>();
const dialog = defineModel<boolean>({ default: false });

const noteArrays = computed<Note[]>(() => {
  if (props.noteTexts) {
    const parents = props.noteTexts.filter((n) => !n.parentNote);
    return parents.map((p) => {
      return { ...p, children: props.noteTexts?.filter((n) => n.parentNote === p.id) ?? [] };
    });
  } else return [];
});
</script>

<style scoped>
ol {
  list-style-position: outside;
  padding-inline-start: 25px;
}
.parentNotes {
  list-style-type: upper-roman;
}
.subNotes {
  list-style-type: lower-roman;
}

li {
  margin-bottom: 14px;
  padding-left: 25px;
}
</style>
