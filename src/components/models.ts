export type HA = 'home' | 'away';

interface Side {
  name: string;
  points: number;
  challenges: number;
}

export interface DisplayState {
  home: Side;
  away: Side;
  time: number;
  overtime: boolean;
  advantage?: HA;
  reversed: boolean;
  next?: {
    home: string;
    homeNo?: number;
    away: string;
    awayNo?: number;
  };
}
