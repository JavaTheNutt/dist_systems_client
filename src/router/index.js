import Vue from 'vue';
import Router from 'vue-router';
import ViewAdminRequests from '@/components/ViewAdminRequests';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/admin/requests',
      name: 'admin-requests',
      component: ViewAdminRequests
    }
  ]
});
