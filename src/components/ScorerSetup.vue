<template>
  <div class="container">
    <q-form @submit="submit">
      <div class="q-py-md">
        <q-checkbox v-model="team" :label="$t('scorerSetup.teamToggleLabel')" />
      </div>
      <q-card v-if="team" class="q-pa-md">
        <q-card-section horizontal class="q-gutter-md">
          <q-card-section class="col">
            <div class="text-h5">
              {{ $t('scorerSetup.team.home') }}
            </div>
            <div v-for="(c, i) in contestantsHome" :key="c.key">
              <q-input v-model="c.name">
                <template #prepend>{{ i + 1 }}.</template>
              </q-input>
            </div>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col">
            <div class="text-h5">
              {{ $t('scorerSetup.team.away') }}
            </div>
            <div v-for="(c, i) in contestantsAway" :key="c.key">
              <q-input v-model="c.name">
                <template #prepend>{{ i + 1 }}.</template>
              </q-input>
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div>
            <q-input
              v-model.number="time"
              :label="$t('scorerSetup.teamTime')"
            />
            <q-input
              v-model.number="overtime"
              :label="$t('scorerSetup.overtime')"
            />
            <q-input
              v-model.number="challenges"
              :label="$t('scorerSetup.challenges')"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card v-else class="q-py-md">
        <q-card-section class="text-h5">
          {{ $t('scorerSetup.contestants') }}
        </q-card-section>
        <q-card-section>
          <div v-for="(c, i) in contestantsHome" :key="c.key">
            <q-input v-model="contestantsHome[i].name">
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
        </q-card-section>
        <q-card-actions>
          <q-space />
          <q-btn @click="addContestant()" :icon="mdiPlus" round />
        </q-card-actions>
      </q-card>
      <q-separator />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { uid } from 'quasar';
import { ref, watch } from 'vue';
import { mdiPlus, mdiTrashCan } from '@quasar/extras/mdi-v7';
import { useStateStore } from 'src/stores/state';
import { HA } from './models';

const state = useStateStore();

const team = ref<boolean>(false);

interface Contestant {
  key: string;
  name: string;
}

const contestantsHome = ref<Contestant[]>([]);
const contestantsAway = ref<Contestant[]>([]);

const time = ref<number>(180);
const overtime = ref<number>(60);
const challenges = ref<number>(3);

watch(team, (newVal) => {
  if (newVal) {
    contestantsHome.value = [
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
    ];
    contestantsAway.value = [
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
      {
        key: uid(),
        name: '',
      },
    ];
  } else {
    contestantsHome.value = [];
    contestantsAway.value = [];
  }
});

function addContestant(t: HA = 'home') {
  const c = t === 'home' ? contestantsHome : contestantsAway;
  c.value.push({
    key: uid(),
    name: '',
  });
}

function removeContestant(idx: number, t: HA = 'home') {
  const c = t === 'home' ? contestantsHome : contestantsAway;
  c.value.splice(idx, 1);
}

function submit() {
  console.log('submit');
  if (team.value) {
    const csh = contestantsHome.value.map((c) => c.name);
    const csa = contestantsAway.value.map((c) => c.name);
    state.initTeam(csh, csa, time.value, overtime.value, challenges.value);
  } else {
    const cs = contestantsHome.value.map((c) => c.name);
    state.initPool(cs, 20, 10);
  }
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
