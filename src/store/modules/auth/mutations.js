import types from './types';

export default {
  [types.mutations.LOG_IN]: (state, { username, password, admin = false, id, name, mobile }) => {
    console.log('login mutation recieved');
    state.loggedIn = true;
    state.userDetails = {
      username,
      password,
      admin,
      id,
      name,
      mobile
    };
  },
  [types.mutations.LOG_OUT]: state => {
    state.loggedIn = false;
    state.userDetails = {
      username: '',
      password: '',
      admin: false,
      id: 0,
      name: ''
    };
  },
  [types.mutations.SET_NAME]: (state, name) => state.userDetails.name = name,
  [types.mutations.UPDATE_PROPERTY]: (state, { prop, value }) => {
    if (prop === 'fname' || prop === 'sname') {
      console.log('updating first name property');
      const nameAry = state.userDetails.name.split(' ');
      let newName;
      if (prop === 'fname') {
        newName = `${value[0].toUpperCase()}${value.substring(1).toLowerCase()} ${nameAry[1]}`;
      } else {
        newName = `${nameAry[0]} ${value[0].toUpperCase()}${value.substring(1).toLowerCase()}`;
      }
      return state.userDetails.name = newName;
    } else {
      return state.userDetails[prop] = value;
    }
  }
};
