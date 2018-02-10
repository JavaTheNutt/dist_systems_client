import types from './types';

export default {
  [types.getters.getAdminRequests]: state => state.adminRequests,
  [types.getters.getMappedAdminRequests]: state => state.adminRequests.map(elem => ({
    fname: elem.u_fname,
    sname: elem.u_sname,
    email: elem.u_email,
    role: elem.u_role,
    mobile: elem.u_mobileNo,
    id: elem.id
  })),
  [types.getters.hasRequests]: state => state.adminRequests.length + state.facilitiesRequests.length > 0,
  [types.getters.getMappedFacilitiesRequests]: state => state.facilitiesRequests.map(elem => ({ name: elem.f_name, id: elem.id }))
};
