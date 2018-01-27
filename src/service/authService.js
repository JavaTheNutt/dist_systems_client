import http from '../http';
import store from '../store';
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
  if (result.status === 200) {
    console.log('login request successful');
    const storeDetails = { username, password, admin: result.data.data.user.admin };
    await store.dispatch(types.authTypes.actions.logIn, storeDetails);
    return true;
  }
  return false;
};
