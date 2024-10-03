import { SessionStorage } from 'quasar';
import { boot } from 'quasar/wrappers';
import { STATE_STORAGE_KEY, useStateStore } from 'src/stores/state';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ store }) => {
  const state = useStateStore(store);
  state.$subscribe(({}, state) => {
    SessionStorage.setItem(STATE_STORAGE_KEY, state);
  });
});
