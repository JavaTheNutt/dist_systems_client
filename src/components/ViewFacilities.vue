<template>
	<v-container fluid>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">Facilities</h3>
            <v-spacer/>
            <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search"/>
            <v-btn
              fab
              small
              right
              color="accent"
              class="ml-3 mr-0"
              @click.stop="addFacilityClicked"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="shownItems"
            :loading="loading"
            :search="search"
            :no-data-text="noDataText"
            class="elevation-1">
            <v-progress-circular slot="progress" color="primary" indeterminate/>
            <template slot="items" slot-scope="props">
              <td>{{props.item.name}}</td>
              <td>{{props.item.type}}</td>
              <td>{{props.item.capacity}}</td>
              <td>{{props.item.number}}</td>
              <td v-if="admin"><v-icon>{{props.item.approved ? 'check_circle' : 'cancel'}}</v-icon></td>
              <td class="text-xs-center layout px-0">
                <v-menu bottom left id="openSignOutMenu">
                  <v-btn icon slot="activator">
                    <v-icon >more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile  id="clickReserve" @click.stop="reserveItem(props.item)" :disabled="!props.item.approved">
                      <v-list-tile-title >reserve</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-if="admin" id="clickRemoveAdmin" @click.stop="deleteItem(props.item)">
                      <v-list-tile-title >delete</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile  v-if="admin && !props.item.approved" id="clickDeleteUser" @click.stop="approveItem(props.item.id)">
                      <v-list-tile-title >approve</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { getFacilities, confirmFacility, deleteFacility } from '../service/dataService';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  import Bus from '@/events/Bus';
  export default {
    name: 'view-facilities',
    data () {
      return {
        search: '',
        facilities: [],
        loading: true
      };
    },
    async created () {
      this.facilities = (await getFacilities()).data;
      this.loading = false;
      Bus.$on('facility-added', facility => {
        this.facilities.push(facility);
      });
    },
    computed: {
      ...mapGetters({ admin: types.authTypes.getters.isAdmin }),
      headers () {
        const baseItems = [{
          text: 'Facility Name',
          value: 'name'
        }, {
          text: 'Type',
          value: 'type'
        }, {
          text: 'Capacity',
          value: 'capacity'
        }, {
          text: 'Number',
          value: 'number'
        }];
        const adminItems = [{
          text: 'Is Approved?',
          value: 'approved'
        }];
        return !this.admin ? baseItems : baseItems.concat(adminItems);
      },
      noDataText () {
        return this.loading ? '' : 'there are no facilities to display';
      },
      shownItems () {
        return this.loading ? [] : this.facilities;
      }
    },
    methods: {
      addFacilityClicked () {
        console.log('addd facility clicked');
        Bus.$emit('show-dialog', { card: 'add-facility-card' });
      },
      async approveItem (id) {
        console.log('approve item clicked for', id);
        this.loading = true;
        const result = await confirmFacility(id);
        console.log('result of approval request', result);
        if (result) {
          const facility = this.facilities.find(facility => facility.id === id);
          console.log('found facility', facility);
          facility.approved = true;
        }
        this.loading = false;
      },
      deleteItem (facility) {
        console.log('delete item clicked for', facility.id);
        Bus.$once('delete-facility-accept', async () => {
          this.loading = true;
          Bus.$off('delete-facility-reject');
          const result = await deleteFacility(facility.id);
          console.log('result', result);
          if (result) {
            this.facilities = this.facilities.filter(elem => elem.id !== facility.id);
          }
          this.loading = false;
        });
        Bus.$once('delete-facility-reject', () => {
          Bus.$off('delete-facility-accept');
        });
        Bus.$emit('show-dialog', {
          card: 'generic-accept-reject-card',
          acceptTitle: 'delete-facility-accept',
          rejectTitle: 'delete-facility-reject',
          title: `Are you sure you wish to permanently delete this ${facility.type}?`,
          persistent: true
        });
      },
      reserveItem (item) {
        console.log('reserve item clicked for', item);
        Bus.$emit('show-dialog', {
          card: 'add-reservation-card',
          facilityId: item.id,
          facilityName: item.name,
          facilityNumber: item.number,
          facilityType: item.type
        });
      }
    }
  };
</script>

