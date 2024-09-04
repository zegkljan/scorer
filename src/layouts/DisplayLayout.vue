<template>
  <div v-if="display !== undefined" class="fit display column">
    <div class="sides col row">
      <div v-if="display.reversed" class="home col column justify-between">
        <div class="name col-auto">{{ display.home.name }}</div>
        <div class="resources col row justify-center">
          <q-icon
            v-for="n in display.home.challenges"
            :key="n"
            :name="mdiEye"
          />
          <q-icon
            v-for="n in display.home.timeouts"
            :key="n"
            :name="mdiClock"
          />
        </div>
        <div class="score col-auto">{{ display.home.points }}</div>
        <div
          class="advantage col-auto"
          :class="{ invisible: display.advantage !== 'home' }"
        >
          <q-icon :name="mdiShieldStar" />
        </div>
      </div>
      <div v-else class="away col column justify-between">
        <div class="name col-auto">{{ display.away.name }}</div>
        <div class="resources col row justify-center">
          <q-icon
            v-for="n in display.away.challenges"
            :key="n"
            :name="mdiEye"
          />
          <q-icon
            v-for="n in display.away.timeouts"
            :key="n"
            :name="mdiClock"
          />
        </div>
        <div class="score col-auto">{{ display.away.points }}</div>
        <div
          class="advantage col-auto"
          :class="{ invisible: display.advantage !== 'away' }"
        >
          <q-icon :name="mdiShieldStar" />
        </div>
      </div>
      <div v-if="display.reversed" class="away col column justify-between">
        <div class="name col-auto">{{ display.away.name }}</div>
        <div class="resources col row justify-center">
          <q-icon
            v-for="n in display.away.challenges"
            :key="n"
            :name="mdiEye"
          />
          <q-icon
            v-for="n in display.away.timeouts"
            :key="n"
            :name="mdiClock"
          />
        </div>
        <div class="score col-auto">{{ display.away.points }}</div>
        <div
          class="advantage col-auto"
          :class="{ invisible: display.advantage !== 'away' }"
        >
          <q-icon :name="mdiShieldStar" />
        </div>
      </div>
      <div v-else class="home col column justify-between">
        <div class="name col-auto">{{ display.home.name }}</div>
        <div class="resources col row justify-center">
          <q-icon
            v-for="n in display.home.challenges"
            :key="n"
            :name="mdiEye"
          />
          <q-icon
            v-for="n in display.home.timeouts"
            :key="n"
            :name="mdiClock"
          />
        </div>
        <div class="score col-auto">{{ display.home.points }}</div>
        <div
          class="advantage col-auto"
          :class="{ invisible: display.advantage !== 'home' }"
        >
          <q-icon :name="mdiShieldStar" />
        </div>
      </div>
    </div>
    <div
      class="time col-auto row justify-center"
      :class="{ overtime: display.overtime }"
    >
      <div v-if="display.overtime" class="col overtime">
        {{ $t('display.overtime') }}
      </div>
      <div class="col">
        {{ timeFormat.format(display.time) }}
      </div>
      <div v-if="display.overtime" class="col overtime">
        {{ $t('display.overtime') }}
      </div>
    </div>
    <div class="next col-auto row column">
      <div class="col-auto title">{{ $t('display.next') }}</div>
      <div class="col-auto row">
        <div v-if="display.reversed" class="home col">
          {{ display.next?.home ?? '-' }}
        </div>
        <div v-else class="away col">
          {{ display.next?.away ?? '-' }}
        </div>
        <div v-if="display.reversed" class="away col">
          {{ display.next?.away ?? '-' }}
        </div>
        <div v-else class="home col">
          {{ display.next?.home ?? '-' }}
        </div>
      </div>
    </div>
    <q-dialog
      v-if="display?.timeout !== undefined"
      :model-value="true"
      full-width
      full-height
      persistent
    >
      <q-card
        class="timeout column"
        :class="{
          home: display.timeout.who === 'home',
          away: display.timeout.who === 'away',
        }"
      >
        <q-card-section class="col-auto text-center title">
          {{ $t('display.timeout') }}
        </q-card-section>
        <q-space />
        <q-card-section class="text-center col-auto">
          <q-circular-progress
            :value="display.timeout.fraction"
            :min="0"
            :max="1"
            size="50vh"
            show-value
          >
            {{ timeFormat.format(display.timeout.time) }}
          </q-circular-progress>
        </q-card-section>
        <q-space />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { DisplayState } from 'src/components/models';
import { onMounted, ref } from 'vue';
import { mdiShieldStar, mdiEye, mdiClock } from '@quasar/extras/mdi-v7';

const timeFormat = Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const display = ref<DisplayState | undefined>(undefined);

window.addEventListener('message', (evt) => {
  console.log('message', evt);
  display.value = evt.data;
  // if (display.value !== undefined) {
  //   display.value.timeout = {
  //     who: 'home',
  //     time: 10,
  //     fraction: 0.75,
  //   };
  // }
});

onMounted(() => {
  window.opener.postMessage('');
});
</script>

<style lang="scss" scoped>
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
  .title {
    font-size: 15vh;
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
