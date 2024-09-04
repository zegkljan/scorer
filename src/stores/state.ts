import { defineStore } from 'pinia';
import { HA } from 'src/components/models';

interface StatePool {
  empty: false;
  team: false;
  contestants: string[];
  bouts: [number, number][];
  results: [number, number][];
  currentBout: number;
  time: number;
  overtime: number;
}

interface StateTeam {
  empty: false;
  team: true;
  contestantsHome: string[];
  contestantsAway: string[];
  bouts: [number, number][];
  currentBout: number;
  time: number;
  challenges: number;
  overtime: number;
  timeoutTime: number;
  timeouts: number;
  score: [number, number];
  challengesRemaining: [number, number];
  timeoutsRemaining: [number, number];
}

interface StateEmpty {
  empty: true;
}

interface State {
  inner: StatePool | StateTeam | StateEmpty;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: State = {
  inner: {
    empty: true,
  },
};

const boutsBySize: Map<number, [number, number][]> = new Map<
  number,
  [number, number][]
>([
  [
    4,
    [
      [1, 2],
      [0, 3],
      [3, 1],
      [2, 0],
      [2, 3],
      [0, 1],
    ],
  ],
  [
    5,
    [
      [1, 4],
      [3, 0],
      [4, 2],
      [1, 3],
      [0, 2],
      [3, 4],
      [2, 1],
      [4, 0],
      [2, 3],
      [0, 1],
    ],
  ],
  [
    6,
    [
      [2, 3],
      [1, 4],
      [0, 5],
      [1, 2],
      [5, 3],
      [4, 0],
      [5, 1],
      [4, 2],
      [0, 3],
      [4, 5],
      [3, 1],
      [2, 0],
      [3, 4],
      [2, 5],
      [0, 1],
    ],
  ],
  [
    7,
    [
      [1, 6],
      [3, 0],
      [5, 2],
      [6, 4],
      [1, 3],
      [0, 5],
      [2, 4],
      [3, 6],
      [5, 1],
      [4, 0],
      [6, 2],
      [3, 5],
      [1, 4],
      [0, 2],
      [5, 6],
      [4, 3],
      [2, 1],
      [6, 0],
      [4, 5],
      [2, 3],
      [0, 1],
    ],
  ],
  [
    8,
    [
      [3, 4],
      [2, 5],
      [1, 6],
      [0, 7],
      [2, 3],
      [1, 4],
      [7, 5],
      [6, 0],
      [1, 2],
      [7, 3],
      [6, 4],
      [0, 5],
      [7, 1],
      [6, 2],
      [5, 3],
      [4, 0],
      [6, 7],
      [5, 1],
      [4, 2],
      [0, 3],
      [5, 6],
      [4, 7],
      [3, 1],
      [2, 0],
      [4, 5],
      [3, 6],
      [2, 7],
      [0, 1],
    ],
  ],
  [
    9,
    [
      [1, 8],
      [3, 0],
      [5, 2],
      [7, 4],
      [8, 6],
      [1, 3],
      [0, 5],
      [2, 7],
      [4, 6],
      [3, 8],
      [5, 1],
      [7, 0],
      [6, 2],
      [8, 4],
      [3, 5],
      [1, 7],
      [0, 6],
      [2, 4],
      [5, 8],
      [7, 3],
      [6, 1],
      [4, 0],
      [8, 2],
      [5, 7],
      [3, 6],
      [1, 4],
      [0, 2],
      [7, 8],
      [6, 5],
      [4, 3],
      [2, 1],
      [8, 0],
      [6, 7],
      [4, 5],
      [2, 3],
      [0, 1],
    ],
  ],
  [
    10,
    [
      [4, 5],
      [3, 6],
      [2, 7],
      [1, 8],
      [0, 9],
      [3, 4],
      [2, 5],
      [1, 6],
      [9, 7],
      [8, 0],
      [2, 3],
      [1, 4],
      [9, 5],
      [8, 6],
      [0, 7],
      [1, 2],
      [9, 3],
      [8, 4],
      [7, 5],
      [6, 0],
      [9, 1],
      [8, 2],
      [7, 3],
      [6, 4],
      [0, 5],
      [8, 9],
      [7, 1],
      [6, 2],
      [5, 3],
      [4, 0],
      [7, 8],
      [6, 9],
      [5, 1],
      [4, 2],
      [0, 3],
      [6, 7],
      [5, 8],
      [4, 9],
      [3, 1],
      [2, 0],
      [5, 6],
      [4, 7],
      [3, 8],
      [2, 9],
      [0, 1],
    ],
  ],
]);

export const useStateStore = defineStore('state', {
  state: (): State => emptyState, //testState,
  getters: {
    isEmpty: (state) => state.inner.empty === true,
    isPrev: (state) => !state.inner.empty && state.inner.currentBout > 0,
    isNext: (state) =>
      !state.inner.empty &&
      state.inner.currentBout + 1 < state.inner.bouts.length,
    homeName:
      (state) =>
      (i = 0, rel = true) => {
        if (state.inner.empty) {
          return undefined;
        }
        const n = rel ? state.inner.currentBout + i : i;
        if (n < 0 || n >= state.inner.bouts.length) {
          return undefined;
        }
        if (state.inner.team) {
          return state.inner.contestantsHome[state.inner.bouts[n][0]];
        } else {
          return state.inner.contestants[state.inner.bouts[n][0]];
        }
      },
    awayName:
      (state) =>
      (i = 0, rel = true) => {
        if (state.inner.empty) {
          return undefined;
        }
        const n = rel ? state.inner.currentBout + i : i;
        if (n < 0 || n >= state.inner.bouts.length) {
          return undefined;
        }
        if (state.inner.team) {
          return state.inner.contestantsAway[state.inner.bouts[n][1]];
        } else {
          return state.inner.contestants[state.inner.bouts[n][1]];
        }
      },
    homeScore:
      (state) =>
      (i = 0, rel = true) => {
        if (state.inner.empty) {
          return undefined;
        }
        if (state.inner.team) {
          return state.inner.score[0];
        } else {
          const n = rel ? state.inner.currentBout + i : i;
          if (n < 0 || n >= state.inner.results.length) {
            return undefined;
          }
          return state.inner.results[n][0];
        }
      },
    awayScore:
      (state) =>
      (i = 0, rel = true) => {
        if (state.inner.empty) {
          return undefined;
        }
        if (state.inner.team) {
          return state.inner.score[1];
        } else {
          const n = rel ? state.inner.currentBout + i : i;
          if (n < 0 || n >= state.inner.results.length) {
            return undefined;
          }
          return state.inner.results[n][1];
        }
      },
    homeChallenges: (state) => {
      if (state.inner.empty) {
        return undefined;
      }
      if (state.inner.team) {
        return state.inner.challengesRemaining[0];
      } else {
        return undefined;
      }
    },
    awayChallenges: (state) => {
      if (state.inner.empty) {
        return undefined;
      }
      if (state.inner.team) {
        return state.inner.challengesRemaining[1];
      } else {
        return undefined;
      }
    },
    homeTimeouts: (state) => {
      if (state.inner.empty) {
        return undefined;
      }
      if (state.inner.team) {
        return state.inner.timeoutsRemaining[0];
      } else {
        return undefined;
      }
    },
    awayTimeouts: (state) => {
      if (state.inner.empty) {
        return undefined;
      }
      if (state.inner.team) {
        return state.inner.timeoutsRemaining[1];
      } else {
        return undefined;
      }
    },
  },
  actions: {
    initPool(contestants: string[], time: number, overtime: number) {
      const bouts: [number, number][] | undefined = boutsBySize.get(
        contestants.length
      );
      if (bouts === undefined) {
        return;
      }
      this.inner = {
        empty: false,
        team: false,
        contestants: contestants,
        bouts: bouts,
        currentBout: -1,
        results: bouts.map(() => [0, 0]),
        time: time,
        overtime: overtime,
      };
    },
    initTeam(options: {
      contestantsHome: string[];
      contestantsAway: string[];
      time: number;
      overtime: number;
      challenges: number;
      timeoutTime: number;
      timeouts: number;
    }) {
      const bouts: [number, number][] = [
        [2, 2],
        [0, 1],
        [1, 0],
        [0, 2],
        [2, 0],
        [1, 1],
        [0, 0],
        [1, 2],
        [2, 1],
      ];
      this.inner = {
        empty: false,
        team: true,
        contestantsHome: options.contestantsHome,
        contestantsAway: options.contestantsAway,
        bouts: bouts,
        currentBout: -1,
        time: options.time,
        overtime: options.overtime,
        challenges: options.challenges,
        timeoutTime: options.timeoutTime,
        timeouts: options.timeouts,
        score: [0, 0],
        challengesRemaining: [options.challenges, options.challenges],
        timeoutsRemaining: [options.timeouts, options.timeouts],
      };
    },
    changeCurrentScore(who: HA, amount: number) {
      if (this.inner.empty) {
        return;
      }
      const r = this.inner.team
        ? this.inner.score
        : this.inner.results[this.inner.currentBout];
      if (who === 'home') {
        r[0] += amount;
      } else {
        r[1] += amount;
      }
    },
    changeCurrentChallenges(who: HA, amount: number) {
      if (this.inner.empty || !this.inner.team) {
        return;
      }
      this.inner.challengesRemaining[who === 'home' ? 0 : 1] = Math.max(
        this.inner.challengesRemaining[who === 'home' ? 0 : 1] + amount,
        0
      );
    },
    changeCurrentTimeouts(who: HA, amount: number) {
      if (this.inner.empty || !this.inner.team) {
        return;
      }
      this.inner.timeoutsRemaining[who === 'home' ? 0 : 1] = Math.max(
        this.inner.timeoutsRemaining[who === 'home' ? 0 : 1] + amount,
        0
      );
    },
    nextBout(prev = false) {
      if (this.inner.empty) {
        return;
      }
      if (prev) {
        this.inner.currentBout--;
      } else {
        this.inner.currentBout++;
      }
    },
  },
});
