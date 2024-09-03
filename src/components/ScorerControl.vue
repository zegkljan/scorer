<template>
  <q-page>
    <div v-if="state.currentBout >= 0" class="local-display column">
      <div class="sides col row">
        <div class="home col column justify-between">
          <div class="name col-auto">{{ state.homeName() }}</div>
          <div class="score col-auto">{{ state.homeScore() }}</div>
          <div class="btn col-auto row justify-center">
            <div class="col">
              <q-btn
                @click="add('home', 1)"
                :icon="mdiPlus"
                size="xl"
                round
                flat
              />
              <q-btn
                @click="add('home', -1)"
                :icon="mdiMinus"
                size="xl"
                round
                flat
              />
            </div>
          </div>
        </div>
        <div class="away col column justify-between">
          <div class="name col-auto">{{ state.awayName() }}</div>
          <div class="score col-auto">{{ state.awayScore() }}</div>
          <div class="btn col-auto row justify-center">
            <div class="col">
              <q-btn
                @click="add('away', 1)"
                :icon="mdiPlus"
                size="xl"
                round
                flat
              />
              <q-btn
                @click="add('away', -1)"
                :icon="mdiMinus"
                size="xl"
                round
                flat
              />
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
          <q-btn
            @click="switchBout(-1)"
            :label="$t('scorerControl.prevBout')"
            :icon="mdiRewind"
            :disable="!state.isPrev"
          />
          <q-btn
            @click="switchBout(1)"
            :label="$t('scorerControl.nextBout')"
            :icon-right="mdiFastForward"
            :disable="!state.isNext"
          />
        </q-card-section>
        <q-card-section class="col-4 bout-list">
          <div
            v-for="(b, i) in state.bouts"
            :key="i"
            class="col row justify-start"
          >
            <div class="col row" :class="{ current: i === state.currentBout }">
              <div class="col text-right">{{ state.contestants[b[0]] }}</div>
              <div class="col-1 justify-center text-center">
                {{ i + 1 }}
              </div>
              <div class="col text-left">{{ state.contestants[b[1]] }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <!-- <pre>{{ JSON.stringify(state.$state, undefined, 2) }}</pre> -->
    <q-btn @click="reset" :icon="mdiRestore" round />
  </q-page>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores/state';
import { ref } from 'vue';
import {
  mdiOpenInNew,
  mdiClose,
  mdiRestore,
  mdiReflectHorizontal,
  mdiPlay,
  mdiStop,
  mdiPlus,
  mdiMinus,
  mdiPencil,
  mdiFastForward,
  mdiRewind,
} from '@quasar/extras/mdi-v7';
import { DisplayState } from './models';
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
  if (state.currentBout >= 0) {
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
    },
    away: {
      name: state.awayName()!,
      points: state.awayScore()!,
    },
    time: time.value,
    overtime: false,
    next: state.isNext
      ? {
          home: state.homeName(1)!,
          away: state.awayName(1)!,
        }
      : undefined,
    reversed: reversed,
  };
  display.value.postMessage(ds);
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
  });
  sendDisplayState();
}

function add(who: 'home' | 'away', amount: number) {
  state.changeCurrentScore(who, amount);
  sendDisplayState();
}

function switchBout(d: 1 | -1) {
  state.currentBout += d;
  time.value = state.time;
  sendDisplayState();
}

function reset() {
  state.$reset();
}
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
