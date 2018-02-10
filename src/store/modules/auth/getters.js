import types from './types';
export default {
  [types.getters.isAdmin]: state => state.userDetails.admin,
  [types.getters.isLoggedIn]: state => state.loggedIn,
  [types.getters.getUsername]: state => state.userDetails.username,
  [types.getters.getPassword]: state => state.userDetails.password,
  [types.getters.getAuthDetails]: state => ({ username: state.userDetails.username, password: state.userDetails.password }),
  [types.getters.getName]: state => state.userDetails.name,
  [types.getters.getID]: state => state.userDetails.id
};
