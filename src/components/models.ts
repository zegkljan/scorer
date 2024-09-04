export type HA = 'home' | 'away';

export function ha2n(who: HA): 0 | 1 {
  if (who === 'home') {
    return 0;
  }
  return 1;
}

export interface Side {
  name: string;
  points: number;
  card: boolean;
  challenges: number;
  timeouts: number;
}

export interface DisplayState {
  home: Side;
  away: Side;
  time: number;
  overtime: boolean;
  advantage?: HA;
  timeout?: {
    time: number;
    fraction: number;
    who: HA;
  };
  reversed: boolean;
  next?: {
    home: string;
    homeNo?: number;
    away: string;
    awayNo?: number;
  };
}
