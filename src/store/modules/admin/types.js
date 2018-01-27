import namespace from '@/util/namespace';

export default namespace('admin', {
  getters: ['getAdminRequests', 'getMappedAdminRequests'],
  mutations: ['SET_ADMIN_REQUESTS', 'RESET_ADMIN_REQUESTS']
});
