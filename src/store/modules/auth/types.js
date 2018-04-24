import namespace from '@/util/namespace';

export default namespace('auth', {
  getters: ['isLoggedIn', 'getUsername', 'getPassword', 'getAuthDetails', 'isAdmin', 'getName', 'getID', 'getMobile'],
  actions: ['logIn', 'logOut'],
  mutations: ['LOG_IN', 'LOG_OUT', 'SET_NAME', 'UPDATE_PROPERTY']
});
