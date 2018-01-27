import types from './types';

export default {
  [types.actions.logIn]: ({ commit }, details) => {
    console.log('log in action triggered with details', details);
    commit(types.mutations.LOG_IN, details);
  }
};
