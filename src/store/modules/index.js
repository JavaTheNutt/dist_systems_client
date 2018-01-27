import { default as auth } from './auth';

export default {
  store: { auth: auth.store },
  types: {
    authTypes: auth.types
  }
};
