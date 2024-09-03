<template>
  <template v-if="!state.inner.empty">
    <div v-if="state.inner.currentBout >= 0" class="local-display column">
      <div class="sides col row">
        <div class="home col column justify-between">
          <div class="name col-auto">{{ state.homeName() }}</div>
          <div
            v-if="state.inner.team"
            class="challenges col-auto row justify-center"
          >
            <q-icon
              v-for="n in state.inner.challengesRemaining[0]"
              :key="n"
              :name="mdiEye"
              size="sm"
            />
          </div>
          <div class="score col-auto">{{ state.homeScore() }}</div>
          <div class="btn col-auto row justify-center">
            <div class="col column">
              <div class="col row justify-center">
                <q-btn
                  @click="add('home', 1)"
                  :icon="mdiPlus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  @click="add('home', -1)"
                  :icon="mdiMinus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  v-if="overtime"
                  @click="advantage = 'home'"
                  :icon="advantage === 'home' ? mdiStar : mdiStarOutline"
                  size="l"
                  flat
                />
              </div>
              <div class="col row justify-center">
                <q-btn
                  v-if="state.inner.team"
                  @click="teamSwitch('home')"
                  :icon="mdiAccountSwitch"
                  size="xl"
                  flat
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('home', -1)"
                  :icon="mdiEyeMinus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('home', 1)"
                  :icon="mdiEyePlus"
                  size="xl"
                  flat
                  dense
                />
              </div>
            </div>
          </div>
        </div>
        <div class="away col column justify-between">
          <div class="name col-auto">{{ state.awayName() }}</div>
          <div
            v-if="state.inner.team"
            class="challenges col-auto row justify-center"
          >
            <q-icon
              v-for="n in state.inner.challengesRemaining[1]"
              :key="n"
              :name="mdiEye"
              size="sm"
            />
          </div>
          <div class="score col-auto">{{ state.awayScore() }}</div>
          <div class="btn col-auto row justify-center">
            <div class="col column">
              <div class="col row justify-center">
                <q-btn
                  @click="add('away', 1)"
                  :icon="mdiPlus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  @click="add('away', -1)"
                  :icon="mdiMinus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  v-if="overtime"
                  @click="advantage = 'away'"
                  :icon="advantage === 'away' ? mdiStar : mdiStarOutline"
                  size="l"
                  flat
                />
              </div>
              <div class="col row justify-center">
                <q-btn
                  v-if="state.inner.team"
                  @click="teamSwitch('away')"
                  :icon="mdiAccountSwitch"
                  size="xl"
                  flat
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('away', -1)"
                  :icon="mdiEyeMinus"
                  size="xl"
                  flat
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('away', 1)"
                  :icon="mdiEyePlus"
                  size="xl"
                  flat
                  dense
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="time row column justify-center">
        <div class="value col">
          {{ timeFormat.format(time) }}
        </div>
        <div class="btn col row justify-center">
          <div class="row q-gutter-md">
            <q-btn
              v-if="timeOn"
              @click="stopTime"
              :label="$t('scorerControl.stopTime')"
              :icon="mdiStop"
            />
            <q-btn
              v-else
              @click="startTime"
              :label="$t('scorerControl.startTime')"
              :icon="mdiPlay"
            />
            <q-btn
              @click="setTime"
              :label="$t('scorerControl.setTime')"
              :icon="mdiPencil"
            />
          </div>
        </div>
      </div>
    </div>
    <q-card class="controls">
      <q-card-section horizontal>
        <q-card-section class="col">
          <div>
            <q-btn
              v-if="display === null"
              @click="openDisplay"
              :icon="mdiOpenInNew"
              :label="$t('scorerControl.openDisplay')"
            />
            <q-btn
              v-else
              @click="closeDisplay"
              :icon="mdiClose"
              :label="$t('scorerControl.closeDisplay')"
            />
          </div>
          <div>
            <q-btn
              @click="reverseDisplay"
              :icon="mdiReflectHorizontal"
              :label="$t('scorerControl.flipDisplay')"
            />
          </div>
        </q-card-section>
        <q-card-section class="col row q-gutter-md">
          <div class="col">
            <q-btn
              @click="switchBout(true)"
              :label="$t('scorerControl.prevBout')"
              :icon="mdiRewind"
              :disable="!state.isPrev"
            />
          </div>
          <div class="col">
            <q-toggle
              v-model="overtime"
              :label="$t('scorerControl.overtime')"
            />
          </div>
          <div class="col">
            <q-btn
              @click="switchBout(false)"
              :label="$t('scorerControl.nextBout')"
              :icon-right="mdiFastForward"
              :disable="!state.isNext"
            />
          </div>
        </q-card-section>
        <q-card-section class="col bout-list">
          <div
            v-for="(b, i) in state.inner.bouts"
            :key="i"
            class="col row justify-start"
          >
            <div
              class="col row"
              :class="{ current: i === state.inner.currentBout }"
            >
              <div class="col text-right">{{ state.homeName(i, false) }}</div>
              <div class="col-1 justify-center text-center">
                {{ i + 1 }}
              </div>
              <div class="col text-left">{{ state.awayName(i, false) }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </template>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores/state';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import {
  mdiOpenInNew,
  mdiClose,
  mdiReflectHorizontal,
  mdiPlay,
  mdiStop,
  mdiPlus,
  mdiMinus,
  mdiPencil,
  mdiFastForward,
  mdiRewind,
  mdiStar,
  mdiStarOutline,
  mdiAccountSwitch,
  mdiEye,
  mdiEyeMinus,
  mdiEyePlus,
} from '@quasar/extras/mdi-v7';
import { DisplayState, HA } from './models';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
const state = useStateStore();

const timeFormat = Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const timeOn = ref<boolean>(false);
const time = ref<number>(0);
let timeOnStart: number = 0;
let timeStarted: Date | undefined;
let timer: number | undefined;

const ot = ref<boolean>(false);
const overtime = computed<boolean>({
  get: () => ot.value,
  set: (val) => {
    ot.value = val;
    if (val) {
      if (!state.inner.empty) {
        time.value = state.inner.overtime;
      }
    } else {
      advantage.value = undefined;
    }
    sendDisplayState();
  },
});
const ad = ref<HA>();
const advantage = computed<HA | undefined>({
  get: () => ad.value,
  set: (val) => {
    ad.value = val;
    sendDisplayState();
  },
});

const display = ref<WindowProxy | null>(null);
let reversed = false;

function openDisplay() {
  if (display.value !== null) {
    return;
  }
  display.value = window.open('/display', '_blank', 'popup');
  if (display.value === null) {
    return;
  }
  display.value.addEventListener('beforeunload', () => {
    display.value = null;
  });
  if (!state.isEmpty) {
    const l = () => {
      sendDisplayState();
      window.removeEventListener('message', l);
    };
    window.addEventListener('message', l);
  }
}

function closeDisplay() {
  if (display.value === null) {
    return;
  }
  display.value.close();
}

function reverseDisplay() {
  reversed = !reversed;
  sendDisplayState();
}

function sendDisplayState() {
  if (display.value === null) {
    return;
  }

  const ds: DisplayState = {
    home: {
      name: state.homeName()!,
      points: state.homeScore()!,
      challenges: state.homeChallenges ?? 0,
    },
    away: {
      name: state.awayName()!,
      points: state.awayScore()!,
      challenges: state.awayChallenges ?? 0,
    },
    time: time.value,
    overtime: overtime.value,
    next: state.isNext
      ? {
          home: state.homeName(1)!,
          away: state.awayName(1)!,
        }
      : undefined,
    reversed: reversed,
    advantage: advantage.value,
  };
  display.value.postMessage(ds);
}

function toggleTime() {
  if (timeStarted) {
    stopTime();
  } else {
    startTime();
  }
}

function startTime() {
  timeOnStart = time.value;
  timeStarted = new Date();
  timer = window.setInterval(() => {
    time.value =
      timeOnStart -
      (new Date().getTime() - (timeStarted?.getTime() ?? 0)) / 1000;
    if (time.value <= 0) {
      stopTime();
    }
    sendDisplayState();
  }, 100);
  timeOn.value = true;
}

function stopTime() {
  window.clearInterval(timer);
  time.value =
    timeOnStart - (new Date().getTime() - (timeStarted?.getTime() ?? 0)) / 1000;
  if (time.value <= 0) {
    time.value = 0;
  }
  timeStarted = undefined;
  timer = undefined;
  timeOn.value = false;
  sendDisplayState();
}

function setTime() {
  $q.dialog({
    title: t('scorerControl.setTime'),
    prompt: {
      model: `${time.value}`,
      type: 'number',
    },
    cancel: true,
  }).onOk((data) => {
    time.value = data;
    sendDisplayState();
  });
}

function add(who: HA, amount: number) {
  state.changeCurrentScore(who, amount);
  sendDisplayState();
}

function teamSwitch(who: HA) {
  if (state.inner.empty || !state.inner.team) {
    return;
  }
  const cs =
    who === 'home' ? state.inner.contestantsHome : state.inner.contestantsAway;
  $q.dialog({
    title: t('scorerControl.teamSwitch.title'),
    message: t('scorerControl.teamSwitch.message', { substitute: cs[3] }),
    options: {
      type: 'radio',
      model: '0',
      items: cs.slice(0, 3).map((c, i) => ({ label: c, value: `${i}` })),
    },
  }).onOk((data) => {
    const n = Number.parseInt(data);
    const tmp = cs[n];
    cs[n] = cs[3];
    cs[3] = tmp;
    sendDisplayState();
  });
}

function addChallenge(who: HA, amount: number) {
  state.changeCurrentChallenges(who, amount);
  sendDisplayState();
}

function switchBout(prev: boolean) {
  state.nextBout(prev);
  if (!state.inner.empty) {
    time.value = state.inner.time;
    overtime.value = false;
  }
  sendDisplayState();
}

function keyboardHandler(evt: KeyboardEvent) {
  if (evt.key === ' ') {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    toggleTime();
    return false;
  }
}

onMounted(() => {
  window.addEventListener('keyup', keyboardHandler, true);
  window.addEventListener('beforeunload', closeDisplay);
});

onUnmounted(() => {
  window.removeEventListener('keyup', keyboardHandler);
  window.removeEventListener('beforeunload', closeDisplay);
});
</script>

<style lang="scss" scoped>
.local-display {
  text-align: center;

  .sides {
    .home {
      background-color: red;
      color: black;
    }

    .away {
      background-color: blue;
      color: white;
    }

    .name {
      font-size: 2em;
    }

    .score {
      font-size: 3em;
    }
  }

  .time {
    font-size: 2em;
  }
}

.controls {
  margin: 1em;

  .bout-list {
    .current {
      font-weight: bold;
      background-color: lightgray;
    }
  }
}
</style>
