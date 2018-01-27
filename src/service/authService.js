import http from '../http';

export const test = async () => {
  console.log('testing backend');
  const res = await http.get('http://localhost:3000/test');
  console.log('res', res);
  return res;
};

export const login = async (username, password) => {
  console.log('attempting to login');
  const result = await http.get('http://localhost:3000/user/login', {
    auth: { username, password }
  });
  console.log('result', result);
};
