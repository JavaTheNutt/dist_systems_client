import http from '../http';
import store from '../store';
import { authTypes } from '../store/types';
export const getFacilities = async () => {
  console.log('request recieved to fetch all facilities');
  const result = await http.get('http://localhost:3000/facilities', {
    auth: store.getters[authTypes.getters.authDetails]
  });
  console.log('result', result);
  return result;
};
