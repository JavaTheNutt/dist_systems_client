import types from './types';

export default {
  [types.mutations.LOG_IN]: (state, { username, password, admin = false }) => {
    console.log('login mutation recieved');
    state.loggedIn = true;
    state.userDetails = {
      username,
      password,
      admin
    };
  },
  [types.mutations.LOG_OUT]: state => {
    state.loggedIn = false;
    state.userDetails = {
      username: '',
      password: '',
      admin: false
    };
  }
};
