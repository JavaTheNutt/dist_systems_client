<template>
  <v-container fluid>
    <v-layout column v-if="!hasRequests" class="text-xs-center">
      <v-flex v-if="!loading">
        <h3 class="headline mb-0">You have no requests to deal with</h3>
      </v-flex>
      <v-flex v-if="!loading">
        <v-btn fab @click="refreshRequests"><v-icon>refresh</v-icon></v-btn>
      </v-flex>
      <v-flex v-if="loading">
        <v-progress-circular indeterminate color="primary"/>
      </v-flex>
    </v-layout>
    <v-layout column v-if="hasAdminRequests">
      <v-flex class="text-xs-center">
        <h3 class="headline mb-0">Admin requests</h3>
      </v-flex>
      <v-flex>
        <v-data-table
          :headers="headers"
          :items="adminRequests"
          hide-actions
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{props.item.fname}}</td>
            <td>{{props.item.sname}}</td>
            <td>{{props.item.email}}</td>
            <td>{{props.item.role}}</td>
            <td>{{props.item.mobile}}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="acceptUserClicked(props.item)">
                <v-icon color="success">check_circle</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="rejectUserClicked(props.item)">
                <v-icon color="error">close</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="hideAdminRequestClicked(props.item)">
                <v-icon>visibility_off</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-layout column v-if="hasFacilitiesRequests">
      <v-flex class="text-xs-center">
        <h3 class="headline mb-0">Facilities requests</h3>
      </v-flex>
      <v-flex>
        <v-data-table
          :headers="facilitiesHeaders"
          :items="facilitiesRequests"
          hide-actions
          class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{props.item.name}}</td>
            <td class="text-xs-right px-0">
              <v-btn icon class="mx-0" @click="acceptFacilityClicked(props.item)">
                <v-icon color="success">check_circle</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="rejectFacilityClicked(props.item)">
                <v-icon color="error">close</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="hideFacilityRequestClicked(props.item)">
                <v-icon>visibility_off</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import types from '@/store/types';
  import { acceptAdminRequest, rejectAdminRequest } from '../service/authService';
  import { getPendingRequests, rejectFacility, confirmFacility } from '../service/dataService';

  export default {
    name: 'view-admin-requests',
    computed: {
      ...mapGetters({
        adminRequests: types.adminTypes.getters.getMappedAdminRequests,
        facilitiesRequests: types.adminTypes.getters.getMappedFacilitiesRequests
      }),
      hasRequests () {
        return this.hasAdminRequests || this.hasFacilitiesRequests;
      },
      hasAdminRequests () {
        return this.adminRequests && this.adminRequests.length > 0;
      },
      hasFacilitiesRequests () {
        return this.facilitiesRequests && this.facilitiesRequests.length > 0;
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
        }],
        facilitiesHeaders: [{
          text: 'Name',
          value: 'name'
        }],
        loading: false
      };
    },
    methods: {
      ...mapMutations({
        hideAdminRequest: types.adminTypes.mutations.REMOVE_ADMIN_REQUEST,
        hideFacilityRequest: types.adminTypes.mutations.REMOVE_FACILITIES_REQUEST
      }),
      async acceptUserClicked (user) {
        console.log('accepting user', user);
        await acceptAdminRequest(user.id);
        this.hideAdminRequestClicked(user);
      },
      hideAdminRequestClicked (user) {
        console.log('admin request hidden');
        this.hideAdminRequest(user.id);
      },
      hideFacilityRequestClicked (facility) {
        console.log('facility request hidden');
        this.hideFacilityRequest(facility.id);
      },
      async acceptFacilityClicked (facility) {
        console.log('accepting facility', facility);
        await confirmFacility(facility.id);
        this.hideFacilityRequestClicked(facility);
      },
      async rejectFacilityClicked (facility) {
        console.log('accepting facility', facility);
        await rejectFacility(facility.id);
        this.hideFacilityRequestClicked(facility);
      },
      async rejectUserClicked (user) {
        console.log('rejecting user', user);
        await rejectAdminRequest(user.id);
        this.hideAdminRequestClicked(user);
      },
      async refreshRequests () {
        console.log('refreshing current requests');
        this.loading = true;
        await getPendingRequests();
        this.loading = false;
      }
    }
  };
</script>
