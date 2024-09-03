import { defineStore } from 'pinia';

interface State {
  contestants: string[];
  bouts: [number, number][];
  results: [number, number][];
  currentBout: number;
  time: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testState: State = {
  contestants: [
    'Jan Žegklitz',
    'Antoni Olbrychski',
    'Pepin "Pepto-abysmal" Marshal',
  ],
  bouts: [
    [0, 1],
    [1, 2],
    [2, 0],
  ],
  results: [
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  currentBout: 0,
  time: 10,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: State = {
  contestants: [],
  bouts: [],
  results: [],
  currentBout: -1,
  time: 0,
};

export const useStateStore = defineStore('state', {
  state: (): State => testState,
  getters: {
    isEmpty: (state) =>
      state.contestants.length === 0 &&
      state.bouts.length === 0 &&
      state.results.length === 0,
    isPrev: (state) => state.currentBout > 0,
    isNext: (state) => state.currentBout + 1 < state.bouts.length,
    homeName:
      (state) =>
      (ahead = 0) => {
        const n = state.currentBout + ahead;
        if (n < 0 || n >= state.bouts.length) {
          return undefined;
        }
        return state.contestants[state.bouts[n][0]];
      },
    awayName:
      (state) =>
      (ahead = 0) => {
        const n = state.currentBout + ahead;
        if (n < 0 || n >= state.bouts.length) {
          return undefined;
        }
        return state.contestants[state.bouts[n][1]];
      },
    homeScore:
      (state) =>
      (ahead = 0) => {
        const n = state.currentBout + ahead;
        if (n < 0 || n >= state.results.length) {
          return undefined;
        }
        return state.results[n][0];
      },
    awayScore:
      (state) =>
      (ahead = 0) => {
        const n = state.currentBout + ahead;
        if (n < 0 || n >= state.results.length) {
          return undefined;
        }
        return state.results[n][1];
      },
  },
  actions: {
    init(contestants: State['contestants'], bouts: State['bouts']) {
      this.contestants = contestants;
      this.bouts = bouts;
      this.results = [];
      this.currentBout = 0;

      for (let i = 0; i < this.bouts.length; i++) {
        this.results.push([0, 0]);
      }
    },
    changeCurrentScore(who: 'home' | 'away', amount: number) {
      if (who === 'home') {
        this.results[this.currentBout][0] += amount;
      } else {
        this.results[this.currentBout][1] += amount;
      }
    },
  },
});
