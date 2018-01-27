import { default as auth } from './auth';
import { default as admin } from './admin';

export default {
  store: { auth: auth.store, admin: admin.store },
  types: {
    authTypes: auth.types,
    adminTypes: admin.types
  }
};
