import http from '../http';
import store from '../store';
import router from '../router';
import types from '../store/types';
export const deleteUser = async id => {
  console.log('attempting to delete user with id', id);
  const result = await http.delete(`http://localhost:3000/user/${id}`, {
    auth: store.getters[types.authTypes.getters.getAuthDetails]
  });
  return result.status === 200;
};

export const makeLoginSignupRequest = async (details, isSignup = false) => {
  console.log('attempting to', isSignup ? 'sign up' : 'login', 'user with details', details);
  const result = isSignup ? await makeSignUpRequest(details) : await makeLoginRequest(details);
  console.log('result', result);
  if (result.status !== 200 || !result.data) return false;
  console.log('login request successful');
  console.log('response data:', result.data);
  const resultData = {
    user: {
      username: details.email,
      password: details.password,
      admin: result.data.user.admin,
      name: result.data.user.name,
      id: result.data.user.id
    },
    adminRequests: result.data.adminRequests
  };
  console.log('resulting data set is', resultData);
  return handleSuccessfulLogin(resultData);
};

const makeLoginRequest = async details => await http.get('http://localhost:3000/user/login', { auth: details });

const makeSignUpRequest = async details => await http.post('http://localhost:3000/user/new', details);

const handleSuccessfulLogin = async data => {
  console.log('handling successful login with', data);
  await store.dispatch(types.authTypes.actions.logIn, data.user);
  if (data.user.admin) handleAdmin(data);
  return true;
};

export const logOut = () => {
  store.commit(types.authTypes.mutations.LOG_OUT);
  router.push('/');
};

export const acceptAdminRequest = async id => {
  console.log('attempting to accept ', id, 'as admin');
  try {
    const result = await http.put(`http://localhost:3000/user/${id}/setAdmin`, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result.status === 200;
  } catch (error) {
    return false;
  }
};

export const rejectAdminRequest = async id => {
  console.log('attempting to reject ', id, 'as admin');
  try {
    const result = await http.put(`http://localhost:3000/user/${id}/refuseAdminRequest`, {
      auth: store.getters[types.authTypes.getters.getAuthDetails]
    });
    console.log('result', result);
    return result.status === 200;
  } catch (error) {
    return false;
  }
};

const handleAdmin = responseData => {
  console.log('handling admin response for ', responseData);
  const adminRequests = responseData.adminRequests.data;
  console.log('admin requests', adminRequests);
  if (adminRequests.admins.length > 0) {
    console.log('has admin requests');
    store.commit(types.adminTypes.mutations.SET_ADMIN_REQUESTS, adminRequests.admins);
  }
  if (adminRequests.facilities.length > 0) {
    console.log('has facilities requests');
    store.commit(types.adminTypes.mutations.SET_FACILITIES_REQUESTS, adminRequests.facilities);
  }
};
