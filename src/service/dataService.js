import http from '../http';
import store from '../store';
import types from '../store/types';
export const getFacilities = async () => {
  console.log('request recieved to fetch all facilities');
  const result = await http.get('http://localhost:3000/facilities', {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log('result', result);
  return result;
};

export const getPendingRequests = async () => {
  console.log('request recieved to fetch pending requests');
  const result = await http.get('http://localhost:3000/user/getAdminRequests', {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log('result', result);
  handleAdmin(result);
};
const handleAdmin = responseData => {
  console.log('handling admin response for ', responseData);
  const adminRequests = responseData.data;
  console.log('current admin requests', adminRequests);
  if (adminRequests.length > 0) {
    store.commit(types.adminTypes.mutations.SET_ADMIN_REQUESTS, adminRequests);
  }
};
