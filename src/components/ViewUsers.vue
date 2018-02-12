<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">Users</h3>
            <v-spacer/>
            <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search"/>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="shownUsers"
            :loading="loading"
            :search="search"
            hide-actions
            :no-data-text="noDataText"
            class="elevation-1">
            <v-progress-circular slot="progress" color="primary" indeterminate/>
            <template slot="items" slot-scope="props">
              <td>{{props.item.firstName}}</td>
              <td>{{props.item.surname}}</td>
              <td>{{props.item.email}}</td>
              <td>{{props.item.role}}</td>
              <td>{{props.item.mobile}}</td>
              <td><v-icon>{{props.item.admin ? 'check_circle' : 'cancel'}}</v-icon></td>
              <td class="text-xs-center layout px-0">
                <v-menu bottom left id="openSignOutMenu">
                  <v-btn icon slot="activator">
                    <v-icon >more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile @click.stop="setUserAsAdmin(props.item)" id="clickSetAsAdmin" v-if="!props.item.admin">
                      <v-list-tile-title >set as admin</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click.stop="revokeAdmin(props.item)" id="clickRemoveAdmin" v-if="props.item.admin">
                      <v-list-tile-title >revoke admin privilege</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click.stop="deleteUser(props.item)" id="clickDeleteUser">
                      <v-list-tile-title >delete user</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </template>
            <template slot="footer">
              <td>{{currentlyLoggedInUser.firstName}}</td>
              <td>{{currentlyLoggedInUser.surname}}</td>
              <td>{{currentlyLoggedInUser.email}}</td>
              <td>{{currentlyLoggedInUser.role}}</td>
              <td>{{currentlyLoggedInUser.mobile}}</td>
              <td><v-icon>check_circle</v-icon></td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { getUsers } from '../service/dataService';
  import { acceptAdminRequest, rejectAdminRequest, deleteUser } from '../service/authService';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  import Bus from '@/events/Bus';

  export default {
    name: 'view-users',
    data () {
      return {
        users: [],
        currentlyLoggedInUser: {},
        search: '',
        loading: true,
        headers: [{
          text: 'First Name',
          value: 'firstName'
        }, {
          text: 'Surame',
          value: 'surname'
        }, {
          text: 'Email',
          value: 'email'
        }, {
          text: 'Role',
          value: 'role'
        }, {
          text: 'Mobile Number',
          value: 'mobile'
        }, {
          text: 'Admin?',
          value: 'admin'
        }]
      };
    },
    async created () {
      this.users = (await getUsers()).data;
      console.log('users fetched', this.users);
      this.currentlyLoggedInUser = this.users.find(user => user.id === this.loggedInUser);
      this.removeLocalUser(this.currentlyLoggedInUser.id);
      this.loading = false;
    },
    methods: {
      setUserAsAdmin (user) {
        console.log('attempting to set', user.id, 'as admin');
        this.loading = true;
        this.handleSendRequest(`Set ${user.firstName} ${user.surname} as admin?`, async () => {
          const result = await acceptAdminRequest(user.id);
          console.log('result', result);
          if (result) this.updateAdminUi(user.id, true);
          this.loading = false;
        });
      },
      handleSendRequest (title, acceptCallback) {
        console.log('displaying "', title, '" in accept/reject dialog');
        Bus.$once('admin-user-accept', () => {
          Bus.$off('admin-user-accept');
          acceptCallback();
        });
        Bus.$once('admin-user-reject', () => {
          Bus.$off('admin-user-accept');
          this.loading = false;
        });
        Bus.$emit('show-dialog', {
          card: 'generic-accept-reject-card',
          acceptTitle: 'admin-user-accept',
          rejectTitle: 'admin-user-reject',
          title,
          persistent: true
        });
      },
      updateAdminUi (userId, isAdmin) {
        console.log('Updating admin ui for', userId);
        const user = this.users.find(user => user.id === userId);
        console.log('user:', user);
        user.admin = isAdmin;
      },
      revokeAdmin (user) {
        console.log('attempting to revoke', user.id, 'admin privilages');
        this.loading = true;
        this.handleSendRequest(`Revoke ${user.firstName} ${user.surname}'s admin privileges?`, async () => {
          const result = await rejectAdminRequest(user.id);
          console.log('result', result);
          if (result) this.updateAdminUi(user.id, false);
          this.loading = false;
        });
      },
      deleteUser (user) {
        console.log('attempting to delete user', user.id);
        this.loading = true;
        this.handleSendRequest(`Permanently delete ${user.firstName} ${user.surname}'s account?`, async () => {
          const result = await deleteUser(user.id);
          console.log('result', result);
          if (result) this.removeLocalUser(user.id);
          this.loading = false;
        });
      },
      removeLocalUser (userId) {
        this.users = this.users.filter(user => user.id !== userId);
      }
    },
    computed: {
      shownUsers () {
        return this.loading ? [] : this.users;
      },
      ...mapGetters({ loggedInUser: types.authTypes.getters.getID }),
      noDataText () {
        return this.loading ? '' : 'there are no users to display';
      }
    }
  };
</script>
