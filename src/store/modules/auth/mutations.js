import types from './types';

export default {
  [types.mutations.LOG_IN]: (state, { username, password, admin = false, id, name }) => {
    console.log('login mutation recieved');
    state.loggedIn = true;
    state.userDetails = {
      username,
      password,
      admin,
      id,
      name
    };
  },
  [types.mutations.LOG_OUT]: state => {
    state.loggedIn = false;
    state.userDetails = {
      username: '',
      password: '',
      admin: false,
      id: 0,
      name: ''
    };
  }
};
