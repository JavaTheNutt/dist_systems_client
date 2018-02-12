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
export const postInitialUserDetails = async details => {
  console.log('posting', details, 'to the server');
  const result = await http.put('http://localhost:3000/user/initial', details, {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log('result', result);
  const data = result.data.data;
  store.commit(types.authTypes.mutations.SET_NAME, `${data.u_fname[0].toUpperCase()}${data.u_fname.substring(1).toLowerCase()} ${data.u_sname[0].toUpperCase()}${data.u_sname.substring(1).toLowerCase()}`);
  return result.status === 200;
};
export const getPendingRequests = async () => {
  console.log('request recieved to fetch pending requests');
  const result = await http.get('http://localhost:3000/user/getAdminRequests', {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log('result', result);
  handleAdmin(result);
};
export const getUsers = async () => {
  console.log('request recieved to fetch all users');
  const result = await http.get('http://localhost:3000/users', {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log('result', result);
  return result;
};
export const confirmFacility = async id => {
  console.log('making request to confirm facility with id', id);
  const result = await http.put(`http://localhost:3000/facility/${id}/confirm`, {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log(result);
};
export const rejectFacility = async id => {
  console.log('making request to reject facility with id', id);
  const result = await http.put(`http://localhost:3000/facility/${id}/reject`, {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  console.log(result);
};

const handleAdmin = responseData => {
  console.log('handling admin response for ', responseData);
  const adminRequests = responseData.data;
  console.log('current admin requests', adminRequests.admins);
  if (adminRequests.admins.length > 0) {
    console.log('has facilities requests');
    store.commit(types.adminTypes.mutations.SET_ADMIN_REQUESTS, adminRequests.admins);
  }
  if (adminRequests.facilities.length > 0) {
    console.log('has facilities requests');
    store.commit(types.adminTypes.mutations.SET_FACILITIES_REQUESTS, adminRequests.facilities);
  }
};
