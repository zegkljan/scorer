<template>
  <div v-if="display !== undefined" class="fit display column">
    <div class="sides col row">
      <div v-if="display.reversed" class="home col column justify-between">
        <div class="name col-auto">{{ display.home.name }}</div>
        <div class="challenges col row justify-center">
          <q-icon
            v-for="n in display.home.challenges"
            :key="n"
            :name="mdiEye"
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
        <div class="challenges col row justify-center">
          <q-icon
            v-for="n in display.away.challenges"
            :key="n"
            :name="mdiEye"
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
        <div class="challenges col row justify-center">
          <q-icon
            v-for="n in display.away.challenges"
            :key="n"
            :name="mdiEye"
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
        <div class="challenges col row justify-center">
          <q-icon
            v-for="n in display.home.challenges"
            :key="n"
            :name="mdiEye"
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
  </div>
</template>

<script setup lang="ts">
import { DisplayState } from 'src/components/models';
import { onMounted, ref } from 'vue';
import { mdiShieldStar, mdiEye } from '@quasar/extras/mdi-v7';

const timeFormat = Intl.NumberFormat(undefined, {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const display = ref<DisplayState | undefined>(undefined);

window.addEventListener('message', (evt) => {
  console.log('message', evt);
  display.value = evt.data;
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
      color: black;
    }

    .away {
      background-color: blue;
      color: white;
    }

    .challenges > * {
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
    .challenges {
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
</style>
