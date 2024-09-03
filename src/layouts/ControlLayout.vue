<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{
          $t(cs === 'control' ? 'scorerControl.title' : 'scorerSetup.title')
        }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <scorer-setup v-if="cs === 'setup'" />
      <scorer-control v-else-if="cs === 'control'" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useStateStore } from 'src/stores/state';
import ScorerSetup from 'src/components/ScorerSetup.vue';
import ScorerControl from 'src/components/ScorerControl.vue';
import { computed } from 'vue';

const state = useStateStore();

const cs = computed<'setup' | 'control'>(() =>
  state.isEmpty ? 'setup' : 'control'
);
</script>
