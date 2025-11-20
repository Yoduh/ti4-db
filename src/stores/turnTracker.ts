import { defineStore, acceptHMRUpdate } from 'pinia';
import type { AgendaRow, Player } from '@/components/turnModels';
import type { Agenda } from '@/components/models';
import { State } from '@/enums/turnState';
import { useStorage } from '@vueuse/core';

export const useTurnTrackerStore = defineStore('turnTracker', {
  state: () => ({
    players: useStorage(
      'players',
      <Player[]>Array(6)
        .fill(null)
        .map((_, i) => ({
          id: i,
          name: '',
          color: '',
          strategy: null,
          influence: 0,
          agenda1votes: 0,
          agenda2votes: 0,
          speaker: false,
          passed: false,
          faction: null,
          seat: i + 1,
        })),
    ),
    gameState: useStorage<State>('gameState', State.SETUP),
    currentTurn: useStorage('currentTurn', 1),
    agendas: useStorage('agendas', [] as Agenda[]),
    agendaRows: useStorage('agendaRows', [] as AgendaRow[]),
  }),
  getters: {
    getSpeaker(state) {
      return state.players.find((p) => p.speaker) ?? null;
    },
    speakerOrder(state): Player[] {
      const start = this.getSpeaker?.seat;
      if (start) {
        const seatOrder = state.players.sort((a, b) => a.seat - b.seat);
        return [...seatOrder.slice(start - 1), ...seatOrder.slice(0, start - 1)];
      }
      return state.players;
    },
    votingOrder(): Array<Player | undefined> {
      return [...this.speakerOrder.slice(1), this.speakerOrder[0]];
    },
  },
  actions: {
    setSpeaker(speakerId: number) {
      this.players.forEach((p) => {
        if (p.id === speakerId) p.speaker = true;
        else p.speaker = false;
      });
    },
    setFirstTurn() {
      let lowestInitiative = 9999;
      this.players.forEach((p) => {
        if (!p.passed && p.strategy && p.strategy.initiative < lowestInitiative)
          lowestInitiative = p.strategy?.initiative;
      });
      this.currentTurn = lowestInitiative;
    },
    resetPlayers() {
      this.players = this.players.map((_, i) => ({
        id: i,
        name: '',
        color: '',
        strategy: null,
        influence: 0,
        agenda1votes: 0,
        agenda2votes: 0,
        speaker: false,
        passed: false,
        faction: null,
        seat: i + 1,
      }));
    },
    setAgendaPhase() {
      this.agendas = [];
      this.agendaRows = this.votingOrder
        .filter((p) => !!p)
        .map((p) => {
          return {
            id: p.id,
            name: p.name,
            influence: 0,
            agenda1votes: 0,
            agenda2votes: 0,
            electing1: '',
            electing2: '',
            for1: false,
            against1: false,
            for2: false,
            against2: false,
            abstain1: false,
            abstain2: false,
          };
        });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTurnTrackerStore, import.meta.hot));
}
