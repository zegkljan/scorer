<template>
  <div
    class="side col column justify-between"
    :class="{ home: side === 'home', away: side === 'away' }"
  >
    <div v-if="displayTeam" class="team">{{ state.teamName }}</div>
    <div class="name col-auto">{{ state.name }}</div>
    <div class="resources col row justify-center">
      <q-icon v-for="n in state.challenges" :key="n" :name="mdiEye" />
      <q-icon v-for="n in state.timeouts" :key="n" :name="mdiClock" />
    </div>
    <div class="score col-auto">{{ state.points }}</div>
    <div class="advantage col-auto" :class="{ invisible: !advantage }">
      <q-icon :name="mdiShieldStar" />
    </div>
    <div
      v-if="state.card"
      class="card"
      :class="{ left: cardAlign === 'left', right: cardAlign === 'right' }"
    >
      <q-icon :name="mdiCards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  mdiShieldStar,
  mdiEye,
  mdiClock,
  mdiCards,
} from '@quasar/extras/mdi-v7';
import { HA, Side } from 'src/components/models';

interface Props {
  displayTeam: boolean;
  cardAlign: 'left' | 'right';
  side: HA;
  state: Side;
  advantage: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.side {
  position: relative;

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

.card {
  position: absolute;
  bottom: 5%;
  color: yellow;

  &.left {
    left: 5%;
  }

  &.right {
    right: 5%;
    transform: scaleX(-1);
  }
}

.display {
  .sides {
    .team {
      font-size: 5vh;
    }
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
  .card {
    font-size: 15vh;
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
