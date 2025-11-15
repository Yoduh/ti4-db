import { reactive } from 'vue';
import { type Note } from '@/components/models';

type NoteInfo = {
  noteName: string;
  noteTexts: Note[] | undefined;
  noteDialog: boolean;
};

export const noteStore = reactive<NoteInfo>({
  noteName: '',
  noteTexts: undefined,
  noteDialog: false,
});
