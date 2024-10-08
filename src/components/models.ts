export type HA = 'home' | 'away';

export type HAA = HA | 'all';

export function ha2n(who: HA): 0 | 1 {
  if (who === 'home') {
    return 0;
  }
  return 1;
}

export interface Side {
  teamName?: string;
  name: string;
  points: number;
  card: boolean;
  challenges: number;
  timeouts: number;
}

interface DisplayStateHeader {
  header: 'DisplayState';
}

interface DisplayStateData {
  home: Side;
  away: Side;
  cap: number | undefined;
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

export type DisplayState =
  | (DisplayStateHeader & { empty: true })
  | (DisplayStateHeader & { empty: false } & DisplayStateData);

export interface DisplayTimerHeader {
  header: 'DisplayTimer';
}

export interface DisplayTimerData {
  time: number;
  fraction: number;
}

export type DisplayTimer = DisplayTimerHeader & {
  timer: DisplayTimerData | null;
};

export const timeFormat = Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
