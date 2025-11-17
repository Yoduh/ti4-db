import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Player } from 'src/components/turnModels';
import { State } from '@/enums/turnState';

const testData: Player[] = [
  {
    id: 0,
    name: 'Alex',
    color: 'Red',
    strategy: { name: '1. Leadership', order: 1 },
    speaker: false,
    faction: { name: 'The Arborec', id: 1 },
    seat: 1,
  },
  {
    id: 1,
    name: 'Ben',
    color: 'Pink',
    strategy: { name: '7. Technology', order: 7 },
    speaker: false,
    faction: { name: 'The Embers of Muaat', id: 8 },
    seat: 2,
  },
  {
    id: 2,
    name: 'Chris',
    color: 'Green',
    strategy: { name: '2. Politics', order: 2 },
    speaker: true,
    faction: { name: 'The Deepwrought Scholarate', id: 27 },
    seat: 3,
  },
  {
    id: 3,
    name: 'Dan',
    color: 'Blue',
    strategy: { name: '5. Trade', order: 5 },
    speaker: false,
    faction: { name: 'The Crimson Rebellion', id: 26 },
    seat: 4,
  },
  {
    id: 4,
    name: 'Evan',
    color: 'Orange',
    strategy: { name: '4. Construction', order: 4 },
    speaker: false,
    faction: { name: 'Last Bastion', id: 30 },
    seat: 5,
  },
  {
    id: 5,
    name: 'Frank',
    color: 'Black',
    strategy: { name: '8. Imperial', order: 8 },
    speaker: false,
    faction: { name: 'The Clan of Saar', id: 7 },
    seat: 6,
  },
];

export const useTurnTrackerStore = defineStore('turnTracker', {
  state: () => ({
    // players: <Player[]>Array(6)
    //   .fill(null)
    //   .map((_, i) => ({
    //     id: i,
    //     name: '',
    //     color: '',
    //     strategy: { name: '', order: 1 },
    //     speaker: false,
    //     faction: '',
    //     seat: i + 1,
    //   })),
    players: testData,
    state: State.SETUP,
    currentTurn: 1,
  }),
  getters: {
    getSpeaker(state) {
      return state.players.find((p) => p.speaker) ?? null;
    },
  },
  actions: {
    setSpeaker(speakerId: number) {
      this.players.forEach((p) => {
        if (p.id === speakerId) p.speaker = true;
        else p.speaker = false;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTurnTrackerStore, import.meta.hot));
}
