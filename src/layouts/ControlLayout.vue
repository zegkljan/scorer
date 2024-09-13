<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
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
import { mdiClose, mdiOpenInNew } from '@quasar/extras/mdi-v7';
import ScorerSetup from 'src/components/ScorerSetup.vue';
import ScorerControl from 'src/components/ScorerControl.vue';

const state = useStateStore();

const cs = computed<'setup' | 'control'>(() =>
  state.isEmpty ? 'setup' : 'control'
);

const display = ref<WindowProxy | null>(null);

function reset() {
  console.log('reset');
  state.inner = { empty: true };
  display.value?.postMessage({ header: 'DisplayState', empty: true });
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
