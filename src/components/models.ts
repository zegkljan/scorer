interface Side {
  name: string;
  points: number;
}

export interface DisplayState {
  home: Side;
  away: Side;
  time: number;
  overtime: boolean;
  advantage?: 'home' | 'away';
  reversed: boolean;
  next?: {
    home: string;
    homeNo?: number;
    away: string;
    awayNo?: number;
  };
}
