import types from './types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state from './state';

export default {
  store: {
    actions,
    getters,
    state,
    mutations
  },
  types
};
