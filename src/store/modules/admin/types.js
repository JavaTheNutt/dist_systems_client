import namespace from '@/util/namespace';

export default namespace('admin', {
  getters: ['getAdminRequests', 'getMappedAdminRequests', 'getMappedFacilitiesRequests'],
  mutations: [
    'SET_ADMIN_REQUESTS',
    'RESET_ADMIN_REQUESTS',
    'REMOVE_ADMIN_REQUEST',
    'SET_FACILITIES_REQUESTS',
    'REMOVE_FACILITIES_REQUEST'
  ]
});
