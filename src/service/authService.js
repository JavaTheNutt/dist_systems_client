import http from '../http';
import store from '../store';
import router from '../router';
import types from '../store/types';
export const test = async () => {
  console.log('testing backend');
  const res = await http.get('http://localhost:3000/test');
  console.log('res', res);
  return res;
};

export const login = async (username, password) => {
  console.log('attempting to login');
  console.log('types', types);
  const result = await http.get('http://localhost:3000/user/login', {
    auth: { username, password }
  });
  console.log('result', result);
  if (result.status !== 200 || !result.data || !result.data.data) return false;
  console.log('login request successful');
  const responseData = result.data.data;
  const storeDetails = { username, password, admin: responseData.user.admin };
  await store.dispatch(types.authTypes.actions.logIn, storeDetails);
  if (responseData.user.admin) handleAdmin(responseData);
  return true;
};
export const logOut = () => store.commit(types.authTypes.mutations.LOG_OUT);

const handleAdmin = responseData => {
  console.log('handling admin response for ', responseData);
  const adminRequests = responseData.adminRequests.data;
  if (adminRequests.length > 0) {
    store.commit(types.adminTypes.mutations.SET_ADMIN_REQUESTS, adminRequests);
    router.push('/admin/requests');
  }
};
