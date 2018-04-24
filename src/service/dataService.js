import http from '../http';
import store from '../store';
import types from '../store/types';
import Bus from '../events/Bus';

export const getFacilities = async () => {
  console.log('request recieved to fetch all facilities');
  try {
    const result = await http.get('http://localhost:3000/facility', {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result.status === 200 ? result.data : [];
  } catch (error) {
    console.log('an error has occurred while fetching facilities', error);
    Bus.$emit('show-snack', { message: 'Error while fetching facilities' });
    return [];
  }
};
export const postInitialUserDetails = async details => {
  console.log('posting', details, 'to the server');
  try {
    const result = await http.put('http://localhost:3000/user/initial', details, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    const data = result.data.data;
    store.commit(types.authTypes.mutations.SET_NAME, `${data.u_fname[0].toUpperCase()}${data.u_fname.substring(1).toLowerCase()} ${data.u_sname[0].toUpperCase()}${data.u_sname.substring(1).toLowerCase()}`);
    return result.status === 200;
  } catch (error) {
    console.log('an error has occurred while sending user details');
    Bus.$emit('show-snack', { message: 'Error occurred while creating user' });
    return false;
  }
};
export const changeReservationFacility = async (reservationId, facilityId) => await updateReservation(reservationId, { facility: facilityId });
export const changeReservationDuration = async (reservationId, duration) => await updateReservation(reservationId, { duration });

export const updateReservation = async (id, data) => {
  console.log('attempting to set', Object.keys(data)[0], 'to', Object.values(data)[0]);
  try {
    const result = await http.put(`http://localhost:3000/reservation/update/${Object.keys(data)[0]}/${id}`, data, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    return result && result.status && result.status === 200;
  } catch (error) {
    console.log('error updating reservation', error);
    return false;
  }
};
export const fetchShortFacilities = async () => {
  console.log('request recieved to fetch all short facilities');
  try {
    const result = await http.get('http://localhost:3000/facility/short', {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result.status === 200 ? result.data : [];
  } catch (error) {
    console.log('an error has occurred while fetching facilities', error);
    Bus.$emit('show-snack', { message: 'Error while fetching facilities' });
    return [];
  }
};
export const updateSingleUserProp = async details => {
  console.log('attempting to set', details.prop, 'to', details.value);
  try {
    const result = await http.put('http://localhost:3000/user/single', details, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    if (result.status && result.status === 200) {
      Bus.$emit('show-snack', { message: 'user updated successfully', status: 'success' });
      store.commit(types.authTypes.mutations.UPDATE_PROPERTY, details);
      return true;
    }
  } catch (error) {
    console.log('an error occurred while updating user', error);
  }
  Bus.$emit('show-snack', { message: 'user update failed' });
  return false;
};
export const fetchReservations = async () => {
  console.log('attempting to fetch all reservations');
  try {
    const result = await http.get('http://localhost:3000/reservation', {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result && result.status === 200 ? result.data : [];
  } catch (error) {
    Bus.$emit('show-snack', { message: 'Error occurred while fetching reservations' });
    console.log('an error has occurred while fetching pending requests', error);
    return [];
  }
};

export const approveReservation = async id => {
  console.log('approving reservation', id);
  try {
    const result = await http.put(`http://localhost:3000/reservation/approve/${id}`, {}, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result && result.status === 200;
  } catch (error) {
    Bus.$emit('show-snack', { message: 'Error occurred while fetching reservations' });
    console.log('an error has occurred while fetching pending requests', error);
    return [];
  }
};
export const deleteReservation = async id => {
  console.log('attempting to delete reservation with id', id);
  try {
    const result = await http.delete(`http://localhost:3000/reservation/${id}`, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    Bus.$emit('show-snack', { message: 'Reservation deleted', status: 'success' });
    return result && result.status === 200;
  } catch (error) {
    Bus.$emit('show-snack', { message: 'Error occurred while deleting reservation' });
    console.log('an error has occurred while fetching pending requests', error);
    return [];
  }
};
export const getPendingRequests = async () => {
  console.log('request recieved to fetch pending requests');
  try {
    const result = await http.get('http://localhost:3000/user/getAdminRequests', {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    handleAdmin(result);
  } catch (error) {
    Bus.$emit('show-snack', { message: 'Error occurred while fetching pending requests' });
    console.log('an error has occurred while fetching pending requests', error);
  }
};
export const getUsers = async () => {
  console.log('request recieved to fetch all users');
  try {
    const result = await http.get('http://localhost:3000/users', {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result;
  } catch (error) {
    console.log('an error has occurred while fetching users', error);
    Bus.$emit('show-snack', { message: 'an error occured while fetching users' });
    return [];
  }
};
export const fetchUsedDatesForFacility = async facilityId => {
  console.log('making request to fetch reserved dates for facility', facilityId);
  try {
    const result = await http.get(`http://localhost:3000/facility/${facilityId}/dates`, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result;
  } catch (error) {
    console.log('an error has occurred while fetching used dates', error);
    Bus.$emit('show-snack', { message: 'an error has occurred while fetching used dates' });
    return [];
  }
};
export const createReservation = async reservationDetails => {
  console.log('attempting to create reservation from', reservationDetails);
  try {
    const result = await http.post('http://localhost:3000/reservation', reservationDetails, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log(result);
    const snackDetails = result.status === 200 ? { message: 'reservation created', status: 'success' } : { message: 'an error has occurred while creating reservation' };
    Bus.$emit('show-snack', snackDetails);
    return result.status === 200;
  } catch (error) {
    console.log('an error has occurred while creating reservation', error);
    Bus.$emit('show-snack', { message: 'an error has occurred while creating reservation' });
    return false;
  }
};
export const createFacility = async facilityDetails => {
  console.log('attempting to create reservation from', facilityDetails);
  try {
    const result = await http.post('http://localhost:3000/facility', facilityDetails, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log(result);
    const snackDetails = result.status === 200 ? { message: 'facility created', status: 'success' } : { message: 'an' +
      ' error' +
      ' has occurred while creating facility' };
    Bus.$emit('show-snack', snackDetails);
    return { success: result.status === 200, data: result.data };
  } catch (error) {
    console.log('an error has occurred while creating facility', error);
    Bus.$emit('show-snack', { message: 'an error has occurred while creating facility' });
    return false;
  }
};
export const confirmFacility = async id => {
  console.log('making request to confirm facility with id', id);
  try {
    const result = await http.put(`http://localhost:3000/facility/${id}/confirm`, {}, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log(result);
    const snackDetails = result.status === 200 ? { message: 'facility confirmed', status: 'success' } : { message: 'an' +
      ' error has occurred while confirming facility' };
    Bus.$emit('show-snack', snackDetails);
    return result.status === 200;
  } catch (error) {
    console.log('an error has occurred while confirming facility', error);
    return false;
  }
};
export const rejectFacility = async id => {
  console.log('making request to reject facility with id', id);
  try {
    const result = await http.put(`http://localhost:3000/facility/${id}/reject`, {}, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log(result);
    const snackDetails = result.status === 200 ? { message: 'facility rejected', status: 'success' } : { message: 'an' +
      ' error has occurred while rejecting facility' };
    Bus.$emit('show-snack', snackDetails);
    return result.status === 200;
  } catch (error) {
    console.log('an error has occurred while rejecting facility request', error);
    return false;
  }
};
export const deleteFacility = async id => {
  console.log('attempting to delete user with id');
  try {
    const result = await http.delete(`http://localhost:3000/facility/${id}`, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    const snackDetails = result.status === 200 ? { message: 'facility deleted', status: 'success' } : { message: 'an' +
      ' error has occurred while deleting facility' };
    Bus.$emit('show-snack', snackDetails);
    return result.status === 200;
  } catch (error) {
    console.log('an error has occurred while deleting facility', error);
    return false;
  }
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
