<template>
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon @click.stop="drawerShown = !drawerShown" v-if="loggedIn"/>
      <v-toolbar-title>Reservation System</v-toolbar-title>
      <v-spacer/>
      <v-btn icon v-if="showRequests" @click.stop="$router.push('/admin/requests')">
        <v-icon color="accent">announcements</v-icon>
      </v-btn>
      <v-btn color="accent" @click.stop="showLogin" v-if="!loggedIn">Login</v-btn>
      <v-menu bottom left v-if="loggedIn" id="openSignOutMenu">
      <v-btn icon slot="activator" dark>
        <v-icon >more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile @click.stop="logOutClicked" id="clickSignOut">
          <v-list-tile-title >Sign Out</v-list-tile-title>
        </v-list-tile>
      </v-list>
      </v-menu>
    </v-toolbar>
    <v-navigation-drawer
      temporary
      v-model="drawerShown"
      light
      absolute
    >
      <v-list class="pt-0">
        <v-divider></v-divider>
        <v-list-tile @click.stop="$router.push('/')">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="admin" @click.stop="$router.push('/admin/requests')">
          <v-list-tile-action>
            <v-icon>announcements</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Requests</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="admin" @click.stop="$router.push('/admin/users')">
          <v-list-tile-action>
            <v-icon>supervisor_account</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
  import Bus from '@/events/Bus';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  import { logOut } from '../service/authService';

  export default {
    name: 'navigation',
    data () {
      return {
        drawerShown: false
      };
    },
    methods: {
      showLogin () {
        Bus.$emit('show-dialog', { card: 'login-card' });
      },
      logOutClicked () {
        logOut();
      }
    },
    computed: {
      showRequests () {
        return this.loggedIn && this.admin && this.hasRequests;
      },
      ...mapGetters({ loggedIn: types.authTypes.getters.isLoggedIn, admin: types.authTypes.getters.isAdmin, hasRequests: types.adminTypes.getters.hasRequests })
    }
  };
</script>
