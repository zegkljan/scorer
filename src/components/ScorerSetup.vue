<template>
  <q-page style="max-width: 400px">
    <q-form @submit="submit">
      <div class="q-pa-md">
        <div class="text-h5">{{ $t('scorerSetup.contestants') }}</div>
        <div v-for="(c, i) in contestants" :key="c.key">
          <q-input v-model="contestants[i].name">
            <template #prepend>
              <q-btn
                @click="removeContestant(i)"
                :icon="mdiTrashCan"
                flat
                round
              />
            </template>
          </q-input>
        </div>
        <q-btn @click="addContestant" :icon="mdiPlus" round />
      </div>
      <div class="q-pa-md">
        <div class="text-h5">{{ $t('scorerSetup.bouts') }}</div>
        <div
          v-for="(c, i) in bouts"
          :key="c.key"
          class="row items-center q-gutter-md"
        >
          <div class="col-shrink">
            <q-btn @click="removeBout(i)" :icon="mdiTrashCan" flat round />
          </div>
          <div class="col">
            <q-select
              v-model="bouts[i].home"
              :options="contestants"
              option-label="name"
              option-value="key"
              emit-value
              map-options
            ></q-select>
          </div>
          <div class="col">
            <q-select
              v-model="bouts[i].away"
              :options="contestants"
              option-label="name"
              option-value="key"
              emit-value
              map-options
            ></q-select>
          </div>
        </div>
        <q-btn @click="addBout" :icon="mdiPlus" round />
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
      <pre>{{ JSON.stringify(bouts, undefined, 2) }}</pre>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { uid } from 'quasar';
import { ref } from 'vue';
import { mdiPlus, mdiTrashCan } from '@quasar/extras/mdi-v7';
import { useStateStore } from 'src/stores/state';

const state = useStateStore();

interface Contestant {
  key: string;
  name: string;
}

const contestants = ref<Contestant[]>([]);

function addContestant() {
  contestants.value.push({
    key: uid(),
    name: '',
  });
}

function removeContestant(idx: number) {
  contestants.value.splice(idx, 1);
}

interface Bout {
  key: string;
  home: string;
  away: string;
}

const bouts = ref<Bout[]>([]);

function addBout() {
  bouts.value.push({
    key: uid(),
    home: '',
    away: '',
  });
}

function removeBout(idx: number) {
  bouts.value.splice(idx, 1);
}

function submit() {
  console.log('submit');
  state.init(
    contestants.value.map((c) => c.name),
    bouts.value.map((b) => [
      contestants.value.findIndex((c) => c.key === b.home),
      contestants.value.findIndex((c) => c.key === b.away),
    ])
  );
}
</script>
