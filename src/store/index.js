import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'test';

// fixme add modules
export default new Vuex.Store({
  namespaced: true,
  modules: modules.store,
  strict: debug
});
