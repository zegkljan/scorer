// This is just an example,
// so you can safely delete all default props below

export default {
  scorerSetup: {
    title: 'Scorer setup',
    teamToggleLabel: 'Team?',
    contestants: 'Contestants',
    bouts: 'Bouts',
    team: {
      home: 'Team A',
      away: 'Team B',
      time: 'Leg time',
      timeoutTime: 'Timeout time',
      timeouts: 'No. of timeouts',
      cap: 'Leg point cap',
      capHint:
        'If set, will show the point cap of current leg in multiples of this number.',
    },
    pool: {
      time: 'Bout time',
      cap: 'Bout point cap',
      capHint: 'If set, will show this point cap.',
    },
    overtime: 'Overtime',
    challenges: 'No. of challenges',
  },
  scorerControl: {
    title: 'Scorer control',
    genericTimer: 'Generic timer',
    stop: 'Stop',
    startTime: 'Start time',
    stopTime: 'Stop time',
    setTime: 'Set time',
    openDisplay: 'Open display',
    closeDisplay: 'Close display',
    flipDisplay: 'Flip display',
    prevBout: 'Prev bout',
    nextBout: 'Next bout',
    overtime: 'Overtime',
    timeout: 'to',
    teamSwitch: {
      title: 'Switch team member',
      message:
        'Select team member that will be switched with the substitute ({substitute}).',
    },
  },
  display: {
    next: 'Next',
    overtime: 'ot',
    timeout: 'Time-out',
    cap: 'Cap',
  },
};
