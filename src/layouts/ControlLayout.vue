<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <div class="col-5 row justify-start">
          <q-btn
            :icon="mdiClose"
            :disable="cs === 'setup'"
            @click="reset"
            flat
            dense
            round
          ></q-btn>
          <q-toolbar-title>{{
            $t(cs === 'control' ? 'scorerControl.title' : 'scorerSetup.title')
          }}</q-toolbar-title>
        </div>

        <div class="col-2 row justify-center">
          <q-btn
            :icon="mdiTimer"
            :label="$t('scorerControl.genericTimer')"
            flat
          >
            <q-menu
              v-model="genericTimerShow"
              anchor="bottom middle"
              self="top middle"
              max-width="20vh"
            >
              <q-form @submit.prevent="startGenericTimer(genericTimerTime)">
                <div class="row q-pt-md q-gutter-sm justify-center">
                  <q-btn
                    v-for="t in [30, 60, 90, 120, 150, 180]"
                    :key="t"
                    :label="`${t}`"
                    @click="startGenericTimer(t)"
                    class="col-3"
                    dense
                  />
                </div>
                <div class="row q-pa-md">
                  <q-input
                    v-model.number="genericTimerTime"
                    dense
                    class="col"
                  />
                  <q-btn :icon="mdiPlay" type="submit" flat dense />
                </div>
              </q-form>
            </q-menu>
          </q-btn>
        </div>
        <div class="col-5 row justify-end">
          <q-btn
            v-if="display === null"
            @click="openDisplay"
            :icon="mdiOpenInNew"
            :label="$t('scorerControl.openDisplay')"
            flat
          />
          <q-btn
            v-else
            @click="closeDisplay"
            :icon="mdiClose"
            :label="$t('scorerControl.closeDisplay')"
            flat
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="center">
        <scorer-setup v-if="cs === 'setup'" />
        <scorer-control v-else-if="cs === 'control'" :display="display" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStateStore } from 'src/stores/state';
import {
  mdiClose,
  mdiOpenInNew,
  mdiPlay,
  mdiTimer,
} from '@quasar/extras/mdi-v7';
import ScorerSetup from 'src/components/ScorerSetup.vue';
import ScorerControl from 'src/components/ScorerControl.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { DisplayTimer, timeFormat } from 'src/components/models';

const state = useStateStore();
const $q = useQuasar();
const { t } = useI18n();

const genericTimerShow = ref<boolean>(false);
const genericTimerTime = ref<number>(0);

const cs = computed<'setup' | 'control'>(() =>
  state.isEmpty ? 'setup' : 'control'
);

const display = ref<WindowProxy | null>(null);

function reset() {
  console.log('reset');
  state.inner = { empty: true };
  display.value?.postMessage({ header: 'DisplayState', empty: true });
}

function startGenericTimer(s: number) {
  genericTimerShow.value = false;
  const timeStarted = new Date();
  const timeOnStart = s;
  const msg: DisplayTimer = {
    header: 'DisplayTimer',
    timer: {
      time: timeOnStart,
      fraction: 1,
    },
  };
  display.value?.postMessage(msg);

  const progressDialog = $q.dialog({
    title: `${timeFormat.format(msg.timer?.time ?? 0)} s`,
    persistent: true,
    class: 'text-center',
    ok: t('scorerControl.stop'),
  });
  const interval = window.setInterval(() => {
    if (msg.timer !== null) {
      msg.timer.time =
        timeOnStart - (new Date().getTime() - timeStarted.getTime()) / 1000;
      msg.timer.fraction = msg.timer.time / timeOnStart;
      if (msg.timer.time <= 0) {
        window.clearInterval(interval);
        msg.timer = null;
        progressDialog.hide();
      } else {
        progressDialog.update({
          title: `${timeFormat.format(msg.timer.time)} s`,
        });
      }
      display.value?.postMessage(msg);
    }
  }, 100);
  progressDialog.onOk(() => {
    msg.timer = null;
    window.clearInterval(interval);
    display.value?.postMessage(msg);
  });
}

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
}

function closeDisplay() {
  if (display.value === null) {
    return;
  }
  display.value.close();
}

onMounted(() => {
  window.addEventListener('beforeunload', closeDisplay);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', closeDisplay);
});
</script>
