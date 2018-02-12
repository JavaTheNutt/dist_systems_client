import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import types from '@/store/types';
import ViewAdminRequests from '@/components/ViewAdminRequests';
import Home from '@/components/Home';
import ViewUsers from '@/components/ViewUsers';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/admin/requests',
      name: 'admin-requests',
      component: ViewAdminRequests,
      meta: {
        requiresAdmin: true
      }
    }, {
      path: '/admin/users',
      name: 'all-users',
      component: ViewUsers,
      meta: {
        requiresAdmin: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  console.log('global authentication guard triggered');
  console.log(to);
  if (!to.meta || (!to.meta.requiresAdmin && !to.meta.requiresAuth)) {
    console.log('route does not require auth');
    return next();
  }
  if (to.meta.requiresAdmin) {
    console.log('route requires admin privilages');
    if (store.getters[types.authTypes.getters.isLoggedIn] && store.getters[types.authTypes.getters.isAdmin]) return next();
    console.log('auth failed, returning to homepage');
    return next('/');
  }
  if (to.meta.requiresAuth) {
    console.log('route requires auth');
    if (store.getters[types.authTypes.getters.isLoggedIn]) return next();
  }
  console.log('auth failed, returning to homepage');
  return next('/');
});
export default router;
