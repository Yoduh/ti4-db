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
const dialog = defineModel<boolean>();

const noteArrays = computed<Note[]>(() => {
  if (props.noteTexts) {
    const arrs = [...props.noteTexts];
    return arrs
      .map((nt) => {
        if (nt.parentNote) {
          const parent = arrs.find((p) => {
            return p.id === nt.parentNote;
          });
          if (parent && !parent.children) {
            parent.children = [nt];
          } else if (parent && parent.children) {
            parent.children.push(nt);
          }
        }
        if (!nt.parentNote) return nt;
        else return undefined;
      })
      .filter((nt): nt is Note => !!nt);
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
