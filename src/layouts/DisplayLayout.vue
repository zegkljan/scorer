<template>
  <div v-if="displayState.empty" class="fit display-wait">
    <svg
      data-v-e0874746=""
      class="q-spinner absolute-center slower"
      width="50vh"
      height="50vh"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-miterlimit="10"
          d="M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"
        ></path>
        <clipPath id="uil-hourglass-clip1">
          <rect x="15" y="21" width="70" height="25">
            <animate
              attributeName="height"
              from="25"
              to="0"
              :dur="`${waitingAnimationDuration}s`"
              repeatCount="indefinite"
              values="25;0;0"
              :keyTimes="clipKeyTimes"
            ></animate>
            <animate
              attributeName="y"
              from="21"
              to="45"
              :dur="`${waitingAnimationDuration}s`"
              repeatCount="indefinite"
              values="21;45;45"
              :keyTimes="clipKeyTimes"
            ></animate>
          </rect>
        </clipPath>
        <clipPath id="uil-hourglass-clip2">
          <rect x="15" y="55" width="70" height="25">
            <animate
              attributeName="height"
              from="0"
              to="25"
              :dur="`${waitingAnimationDuration}s`"
              repeatCount="indefinite"
              values="0;25;25"
              :keyTimes="clipKeyTimes"
            ></animate>
            <animate
              attributeName="y"
              from="80"
              to="55"
              :dur="`${waitingAnimationDuration}s`"
              repeatCount="indefinite"
              values="80;55;55"
              :keyTimes="clipKeyTimes"
            ></animate>
          </rect>
        </clipPath>
        <path
          d="M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z"
          clip-path="url(#uil-hourglass-clip1)"
          fill="currentColor"
        ></path>
        <path
          d="M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z"
          clip-path="url(#uil-hourglass-clip2)"
          fill="currentColor"
        ></path>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="180 50 50"
          repeatCount="indefinite"
          :dur="`${waitingAnimationDuration}s`"
          values="0 50 50;0 50 50;180 50 50"
          :keyTimes="rotationKeyTimes"
        ></animateTransform>
      </g>
    </svg>
  </div>
  <div v-else class="fit display column">
    <div class="sides col row" :class="{ reverse: !displayState.reversed }">
      <display-side
        :display-team="
          (displayState.home.teamName ?? '') !== '' ||
          (displayState.away.teamName ?? '') !== ''
        "
        :card-align="displayState.reversed ? 'left' : 'right'"
        :side="'home'"
        :state="displayState.home"
        :advantage="displayState.advantage === 'home'"
      ></display-side>
      <display-side
        :display-team="
          (displayState.home.teamName ?? '') !== '' ||
          (displayState.away.teamName ?? '') !== ''
        "
        :card-align="displayState.reversed ? 'right' : 'left'"
        :side="'away'"
        :state="displayState.away"
        :advantage="displayState.advantage === 'away'"
      ></display-side>
    </div>
    <div
      class="time col-auto row justify-center"
      :class="{ overtime: displayState.overtime }"
    >
      <div v-if="displayState.overtime" class="col overtime">
        {{ $t('display.overtime') }}
      </div>
      <div class="col">
        {{ timeFormat.format(displayState.time) }}
      </div>
      <div v-if="displayState.overtime" class="col overtime">
        {{ $t('display.overtime') }}
      </div>
    </div>
    <div class="next col-auto row column">
      <div class="col-auto title">{{ $t('display.next') }}</div>
      <div class="col-auto row">
        <div v-if="displayState.reversed" class="home col">
          {{ displayState.next?.home ?? '-' }}
        </div>
        <div v-else class="away col">
          {{ displayState.next?.away ?? '-' }}
        </div>
        <div v-if="displayState.reversed" class="away col">
          {{ displayState.next?.away ?? '-' }}
        </div>
        <div v-else class="home col">
          {{ displayState.next?.home ?? '-' }}
        </div>
      </div>
    </div>
    <q-dialog
      v-if="displayState?.timeout !== undefined"
      :model-value="true"
      persistent
      full-height
      full-width
    >
      <q-card
        class="timeout column justify-start"
        :class="{
          home: displayState.timeout.who === 'home',
          away: displayState.timeout.who === 'away',
        }"
      >
        <div class="col-auto text-center title">
          {{ $t('display.timeout') }}
        </div>
        <div class="col-auto text-center team">
          {{
            [displayState.home.teamName, displayState.away.teamName][
              ha2n(displayState.timeout.who)
            ]
          }}
        </div>
        <q-space />
        <div class="text-center col-auto">
          <q-circular-progress
            :value="displayState.timeout.fraction"
            :min="0"
            :max="1"
            size="50vh"
            show-value
          >
            {{ timeFormat.format(displayState.timeout.time) }}
          </q-circular-progress>
        </div>
        <q-space />
      </q-card>
    </q-dialog>
  </div>
  <q-dialog
    :model-value="genericTimer !== null"
    persistent
    full-height
    full-width
  >
    <q-card class="generic-timer column justify-start">
      <q-space />
      <div class="text-center col-auto">
        <q-circular-progress
          :value="genericTimer?.fraction"
          :min="0"
          :max="1"
          size="50vh"
          show-value
        >
          {{ timeFormat.format(genericTimer?.time ?? 0) }}
        </q-circular-progress>
      </div>
      <q-space />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  DisplayState,
  DisplayTimerData,
  ha2n,
  timeFormat,
} from 'src/components/models';
import { onMounted, ref } from 'vue';
import DisplaySide from 'src/components/DisplaySide.vue';

const waitingAnimationDuration = 8;
const clipKeyTimes = '0;0.85;1';
const rotationKeyTimes = '0;0.85;1';

const displayState = ref<DisplayState>({ header: 'DisplayState', empty: true });
const genericTimer = ref<DisplayTimerData | null>(null);

window.addEventListener('message', (evt) => {
  console.log('message', evt);
  switch (evt.data.header) {
    case 'DisplayState':
      displayState.value = evt.data;
      break;
    case 'DisplayTimer':
      genericTimer.value = evt.data.timer;
      break;
  }
  if (evt.data.header !== 'DisplayState') {
    return;
  }
});

onMounted(() => {
  window.opener.postMessage('');
});
</script>

<style lang="scss" scoped>
.display-wait {
  background-color: black;
  color: white;
}

.display {
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

    .resources > * {
      margin-left: 2vh;
      margin-right: 2vh;
    }
  }

  .time {
    border-bottom: 1px solid black;

    .overtime {
      text-transform: uppercase;
    }
  }
}

.display {
  .sides {
    .name {
      font-size: 7.5vh;
    }
    .resources {
      font-size: 5vh;
    }
    .score {
      font-size: 20vh;
    }
    .advantage {
      font-size: 7.5vh;
    }
  }
  .time {
    font-size: 15vh;
  }
  .next {
    font-size: 5vh;
  }
}

.timeout {
  overflow: hidden;

  .title {
    font-size: 12vh;
  }

  .team {
    font-size: 5vh;
  }

  &.home {
    background-color: red;
    color: white;
  }
  &.away {
    background-color: blue;
    color: white;
  }
}
</style>
