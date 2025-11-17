import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Player } from 'src/components/turnModels';
import { State } from '@/enums/turnState';

// const testData: Player[] = [
//   {
//     id: 0,
//     name: 'Alex',
//     color: 'Red',
//     strategy: { name: '1. Leadership', color: 'red', initiative: 1, popped: false },
//     speaker: false,
//     passed: false,
//     faction: { name: 'The Arborec', id: 1 },
//     seat: 1,
//   },
//   {
//     id: 1,
//     name: 'Ben',
//     color: 'Pink',
//     strategy: { name: '7. Technology', color: 'blue-10', initiative: 7, popped: false },
//     speaker: false,
//     passed: false,
//     faction: { name: 'The Embers of Muaat', id: 8 },
//     seat: 2,
//   },
//   {
//     id: 2,
//     name: 'Chris',
//     color: 'Green',
//     strategy: { name: '3. Politics', color: 'yellow-7', initiative: 3, popped: false },
//     speaker: true,
//     passed: false,
//     faction: { name: 'The Deepwrought Scholarate', id: 27 },
//     seat: 3,
//   },
//   {
//     id: 3,
//     name: 'Dan',
//     color: 'Blue',
//     strategy: { name: '5. Trade', color: 'teal', initiative: 5, popped: false },
//     speaker: false,
//     passed: false,
//     faction: { name: 'The Crimson Rebellion', id: 26 },
//     seat: 4,
//   },
//   {
//     id: 4,
//     name: 'Evan',
//     color: 'Orange',
//     strategy: { name: '4. Construction', color: 'green-9', initiative: 4, popped: false },
//     speaker: false,
//     passed: false,
//     faction: { name: 'Last Bastion', id: 30 },
//     seat: 5,
//   },
//   {
//     id: 5,
//     name: 'Frank',
//     color: 'Black',
//     strategy: { name: '8. Imperial', color: 'purple', initiative: 8, popped: false },
//     speaker: false,
//     passed: false,
//     faction: { name: 'The Clan of Saar', id: 7 },
//     seat: 6,
//   },
// ];

export const useTurnTrackerStore = defineStore('turnTracker', {
  state: () => ({
    players: <Player[]>Array(6)
      .fill(null)
      .map((_, i) => ({
        id: i,
        name: '',
        color: '',
        strategy: { name: '', color: '', initiative: 1, popped: false },
        speaker: false,
        passed: false,
        faction: null,
        seat: i + 1,
      })),
    // players: testData,
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
      this.putInSpeakerOrder();
    },
    setFirstTurn() {
      let lowestInitiative = 9999;
      this.players.forEach((p) => {
        if (p.strategy && p.strategy.initiative < lowestInitiative)
          lowestInitiative = p.strategy?.initiative;
      });
      this.currentTurn = lowestInitiative;
    },
    putInSpeakerOrder() {
      const start = this.getSpeaker?.seat;
      if (start) {
        const seatOrder = this.players.sort((a, b) => a.seat - b.seat);
        this.players = [...seatOrder.slice(start - 1), ...seatOrder.slice(0, start - 1)];
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTurnTrackerStore, import.meta.hot));
}
