import types from './types';
import mutations from './mutations';
import getters from './getters';
import state from './state';

export default {
  store: {
    getters,
    state,
    mutations
  },
  types
};
