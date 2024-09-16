<template>
  <template v-if="!state.inner.empty">
    <div v-if="state.inner.currentBout >= 0" class="local-display column">
      <div class="sides col row">
        <div class="home col column justify-between">
          <div class="team col-auto">{{ state.teamName('home') }}</div>
          <div class="name col-auto">{{ state.name('home') }}</div>
          <div
            v-if="state.inner.team"
            class="resources col-auto row justify-center"
          >
            <q-icon
              v-for="n in state.inner.challengesRemaining[0]"
              :key="n"
              :name="mdiEye"
              size="sm"
            />
            <q-icon
              v-for="n in state.inner.timeoutsRemaining[0]"
              :key="n"
              :name="mdiClockOutline"
              size="sm"
            />
          </div>
          <div class="score col-auto">
            {{ state.score('home') }}
            <span v-if="timeoutOn === 'home'"
              >| {{ timeFormat.format(timeoutTime) }}</span
            >
          </div>
          <div class="btn col-auto row justify-center">
            <div class="col column">
              <div class="col row justify-center">
                <q-btn
                  @click="add('home', 1)"
                  :icon="mdiPlus"
                  size="lg"
                  flat
                  dense
                />
                <q-btn
                  @click="add('home', -1)"
                  :icon="mdiMinus"
                  size="lg"
                  flat
                  dense
                />
                <q-btn
                  @click="card('home')"
                  :icon="mdiCard"
                  :flat="!cardHome"
                  :text-color="cardHome ? 'black' : 'yellow'"
                  color="yellow"
                  size="lg"
                  class="rotate-90"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="card('home', true)"
                  :icon="mdiAccountCard"
                  size="lg"
                  color="yellow"
                  dense
                  flat
                />
                <q-btn
                  v-if="overtime"
                  @click="advantage = 'home'"
                  :icon="advantage === 'home' ? mdiStar : mdiStarOutline"
                  size="lg"
                  flat
                />
              </div>
              <div class="col row justify-center q-gutter-md q-pb-md">
                <q-btn
                  v-if="state.inner.team"
                  @click="teamSwitch('home')"
                  :icon="mdiAccountSwitch"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('home', -1)"
                  :icon="mdiEyeMinus"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('home', 1)"
                  :icon="mdiEyePlus"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="
                    () =>
                      timeoutOn === undefined
                        ? timeoutStart('home')
                        : timeoutStop()
                  "
                  :label="$t('scorerControl.timeout')"
                  :icon-right="timeoutOn !== 'home' ? mdiPlay : mdiStop"
                  :disable="timeoutOn === 'away'"
                  size="lg"
                  dense
                />
              </div>
            </div>
          </div>
        </div>
        <div class="away col column justify-between">
          <div class="team col-auto">{{ state.teamName('away') }}</div>
          <div class="name col-auto">{{ state.name('away') }}</div>
          <div
            v-if="state.inner.team"
            class="resources col-auto row justify-center"
          >
            <q-icon
              v-for="n in state.inner.challengesRemaining[1]"
              :key="n"
              :name="mdiEye"
              size="sm"
            />
            <q-icon
              v-for="n in state.inner.timeoutsRemaining[1]"
              :key="n"
              :name="mdiClockOutline"
              size="sm"
            />
          </div>
          <div class="score col-auto">
            {{ state.score('away') }}
            <span v-if="timeoutOn === 'away'"
              >| {{ timeFormat.format(timeoutTime) }}</span
            >
          </div>
          <div class="btn col-auto row justify-center">
            <div class="col column">
              <div class="col row justify-center">
                <q-btn
                  @click="add('away', 1)"
                  :icon="mdiPlus"
                  size="lg"
                  flat
                  dense
                />
                <q-btn
                  @click="add('away', -1)"
                  :icon="mdiMinus"
                  size="lg"
                  flat
                  dense
                />
                <q-btn
                  @click="card('away')"
                  :icon="mdiCard"
                  :flat="!cardAway"
                  :text-color="cardAway ? 'black' : 'yellow'"
                  color="yellow"
                  size="lg"
                  class="rotate-90"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="card('away', true)"
                  :icon="mdiAccountCard"
                  size="lg"
                  color="yellow"
                  dense
                  flat
                />
                <q-btn
                  v-if="overtime"
                  @click="advantage = 'away'"
                  :icon="advantage === 'away' ? mdiStar : mdiStarOutline"
                  size="lg"
                  flat
                />
              </div>
              <div class="col row justify-center q-gutter-md q-pb-md">
                <q-btn
                  v-if="state.inner.team"
                  @click="teamSwitch('away')"
                  :icon="mdiAccountSwitch"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('away', -1)"
                  :icon="mdiEyeMinus"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="addChallenge('away', 1)"
                  :icon="mdiEyePlus"
                  size="lg"
                  dense
                />
                <q-btn
                  v-if="state.inner.team"
                  @click="
                    () =>
                      timeoutOn === undefined
                        ? timeoutStart('away')
                        : timeoutStop()
                  "
                  :label="$t('scorerControl.timeout')"
                  :icon-right="timeoutOn !== 'away' ? mdiPlay : mdiStop"
                  :disable="timeoutOn === 'home'"
                  size="lg"
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
              <div class="col text-right">
                <q-icon
                  v-if="state.card('home', i, false)"
                  :name="mdiCard"
                  class="rotate-90"
                  color="yellow"
                />{{ state.name('home', i, false) }}
              </div>
              <div class="col-1 justify-center text-center">
                {{ i + 1 }}
              </div>
              <div class="col text-left">
                {{ state.name('away', i, false)
                }}<q-icon
                  v-if="state.card('away', i, false)"
                  :name="mdiCard"
                  class="rotate-90"
                  color="yellow"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <pre>{{ JSON.stringify(state.inner, undefined, 2) }}</pre>
  </template>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores/state';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
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
  mdiClockOutline,
  mdiAccountCard,
  mdiCard,
} from '@quasar/extras/mdi-v7';
import { DisplayState, HA, ha2n, timeFormat } from './models';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
const state = useStateStore();

interface Props {
  display: WindowProxy | null;
}
const props = defineProps<Props>();

const cardHome = computed<boolean>(() => state.card('home'));
const cardAway = computed<boolean>(() => state.card('away'));

const timeOn = ref<boolean>(false);
const time = ref<number>(0);
let timeOnStart: number = 0;
let timeStarted: Date | undefined;
let timer: number | undefined;

const timeoutOn = ref<HA | undefined>();
const timeoutTime = ref<number>(0);
let timeoutTimeOnStart: number = 0;
let timeoutTimeStarted: Date | undefined;
let timeoutTimer: number | undefined;

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

watch(
  () => props.display,
  (val, oldVal) => {
    if (oldVal === null && val !== null && !state.isEmpty) {
      const l = () => {
        sendDisplayState();
        window.removeEventListener('message', l);
      };
      window.addEventListener('message', l);
    }
  }
);

let reversed = false;

function reverseDisplay() {
  reversed = !reversed;
  sendDisplayState();
}

function sendDisplayState() {
  if (props.display === null) {
    return;
  }

  const ds: DisplayState = {
    header: 'DisplayState',
    empty: false,
    home: {
      teamName: state.teamName('home'),
      name: state.name('home')!,
      points: state.score('home')!,
      card: cardHome.value,
      challenges: state.challenges('home') ?? 0,
      timeouts: state.timeouts('home') ?? 0,
    },
    away: {
      teamName: state.teamName('away'),
      name: state.name('away')!,
      points: state.score('away')!,
      card: cardAway.value,
      challenges: state.challenges('away') ?? 0,
      timeouts: state.timeouts('away') ?? 0,
    },
    time: time.value,
    overtime: overtime.value,
    timeout:
      timeoutOn.value === undefined
        ? undefined
        : {
            time: timeoutTime.value,
            fraction:
              !state.inner.empty && state.inner.team
                ? timeoutTime.value / state.inner.timeoutTime
                : 0,
            who: timeoutOn.value,
          },
    next: state.isNext
      ? {
          home: state.name('home', 1)!,
          away: state.name('away', 1)!,
        }
      : undefined,
    reversed: reversed,
    advantage: advantage.value,
  };
  props.display.postMessage(ds);
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

function card(who: HA, team: boolean = false) {
  console.log(team);
  if (team) {
    state.changeTeamCard(who, true);
  } else {
    state.changeCurrentCard(
      who,
      who === 'home' ? !cardHome.value : !cardAway.value
    );
  }
  sendDisplayState();
}

function teamSwitch(who: HA) {
  if (state.inner.empty || !state.inner.team) {
    return;
  }
  const cs = state.inner.contestants[ha2n(who)];
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

function timeoutStart(who: HA) {
  if (state.inner.empty || !state.inner.team) {
    return;
  }
  state.changeCurrentTimeouts(who, -1);
  timeoutTimeOnStart = state.inner.timeoutTime;
  timeoutTimeStarted = new Date();
  timeoutTimer = window.setInterval(() => {
    timeoutTime.value =
      timeoutTimeOnStart -
      (new Date().getTime() - (timeoutTimeStarted?.getTime() ?? 0)) / 1000;
    if (timeoutTime.value <= 0) {
      timeoutStop();
    }
    sendDisplayState();
  }, 100);
  timeoutOn.value = who;
}

function timeoutStop() {
  window.clearInterval(timeoutTimer);
  timeoutTimer = undefined;
  timeoutOn.value = undefined;
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
  console.log(evt);
  if (evt.key === ' ') {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    toggleTime();
    return false;
  } else if (evt.key === '+') {
    if (evt.shiftKey) {
      add('home', 1);
    }
    if (evt.altKey) {
      add('away', 1);
    }
  } else if (evt.key === '-') {
    if (evt.shiftKey) {
      add('home', -1);
    }
    if (evt.altKey) {
      add('away', -1);
    }
  }
}

onMounted(() => {
  window.addEventListener('keyup', keyboardHandler, true);
  sendDisplayState();
});

onUnmounted(() => {
  window.removeEventListener('keyup', keyboardHandler);
});
</script>

<style lang="scss" scoped>
.local-display {
  text-align: center;

  .sides {
    .home {
      background-color: red;
      color: white;
    }

    .away {
      background-color: blue;
      color: white;
    }

    .team {
      font-size: 1.5em;
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
