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
    },
    pool: {
      time: 'Bout time',
    },
    overtime: 'Overtime',
    challenges: 'No. of challenges',
  },
  scorerControl: {
    title: 'Scorer control',
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
  },
};
