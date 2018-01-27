<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="adminRequests"
          hide-actions
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{props.item.fname}}</td>
            <td>{{props.item.sname}}</td>
            <td>{{props.item.role}}</td>
            <td>{{props.item.email}}</td>
            <td>{{props.item.mobile}}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="acceptUser(props.item)">
                <v-icon color="success">check_circle</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="rejectUser(props.item)">
                <v-icon color="error">close</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  export default {
    name: 'view-admin-requests',
    computed: {
      ...mapGetters({ adminRequests: types.adminTypes.getters.getMappedAdminRequests }),
      hasData () {
        return this.adminRequests.length > 0;
      }
    },
    data () {
      return {
        headers: [{
          text: 'First Name',
          value: 'fname'
        }, {
          text: 'Surname',
          value: 'sname'
        }, {
          text: 'Email',
          value: 'email'
        }, {
          text: 'Role',
          value: 'role'
        }, {
          text: 'Mobile Number',
          value: 'mobile'
        }]
      };
    },
    methods: {
      acceptUser (user) {
        console.log('accepting user', user);
      },
      rejectUser (user) {
        console.log('rejecting user', user);
      }
    }
  };
</script>
