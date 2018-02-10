import namespace from '@/util/namespace';

export default namespace('auth', {
  getters: ['isLoggedIn', 'getUsername', 'getPassword', 'getAuthDetails', 'isAdmin', 'getName', 'getID'],
  actions: ['logIn', 'logOut'],
  mutations: ['LOG_IN', 'LOG_OUT']
});
