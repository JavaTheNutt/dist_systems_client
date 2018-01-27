import types from './types';

export default {
  [types.mutations.SET_ADMIN_REQUESTS]: (state, adminRequests) => state.adminRequests = adminRequests
};
