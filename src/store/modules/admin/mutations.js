import types from './types';

export default {
  [types.mutations.SET_ADMIN_REQUESTS]: (state, adminRequests) => state.adminRequests = adminRequests,
  [types.mutations.REMOVE_ADMIN_REQUEST]: (state, id) => {
    console.log('mutation recieved to remove', id, 'admin request');
    state.adminRequests = state.adminRequests.filter(elem => {
      console.log('current elem', elem);
      return elem.id !== id;
    });
  },
  [types.mutations.SET_FACILITIES_REQUESTS]: (state, facilitiesRequests) => state.facilitiesRequests = facilitiesRequests,
  [types.mutations.REMOVE_FACILITIES_REQUEST]: (state, id) => {
    console.log('mutation recieved to remove', id, 'facility request');
    state.facilitiesRequests = state.facilitiesRequests.filter(elem => {
      console.log('current elem', elem);
      return elem.id !== id;
    });
  }
};
