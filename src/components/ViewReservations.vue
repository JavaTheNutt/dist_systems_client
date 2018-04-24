<template>
  <v-container fluid grid-list-md>
    <v-layout justify-center v-if="loading">
      <v-flex class="text-xs-center">
        <v-progress-circular color="primary" indeterminate :size="100"/>
      </v-flex>
    </v-layout>
    <v-data-iterator
      content-tag="v-layout"
      row
      wrap
      :items="items"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      v-if="!loading"
    >
      <v-progress-circular slot="progress" indeterminate color="primary"/>
      <v-flex
      slot="item"
      slot-scope="props"
      xs12
      md4
      lg4
      >
        <v-card>
          <v-card-title>
            <h4>{{props.item.title}}</h4>
            <v-spacer/>
            <v-icon v-if="props.item.isMyReservation">account_circle</v-icon>
            <v-icon v-if="!props.item.approved">cancel</v-icon>
            <v-icon v-if="isPast(props.item.startDate)">alarm_on</v-icon>
          </v-card-title>
          <v-divider/>
          <v-card-title class="subtitle">{{props.item.description}}
            <v-spacer/>
            <v-menu>
              <v-btn slot="activator" flat icon v-if="isAdmin || props.item.isMyReservation && !isPast(props.item.startDate)" light class="text-xs-right"><v-icon>more_vert</v-icon></v-btn>
              <v-list>
                <v-list-tile @click.stop="deleteItemClicked(props.item)">
                  <v-list-tile-title>delete</v-list-tile-title>
                </v-list-tile>
                <!--<v-list-tile @click.stop="updateDateClicked(props.item)" v-if="!isPast(props.item.startDate)">
                  <v-list-tile-title>update date</v-list-tile-title>
                </v-list-tile>-->
                <v-list-tile @click.stop="updateDurationClicked(props.item)"  v-if="!isPast(props.item.startDate)">
                  <v-list-tile-title>update duration</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click.stop="updateFacilityClicked(props.item)"  v-if="!isPast(props.item.startDate)">
                  <v-list-tile-title>change facility</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click.stop="approveReservation(props.item)" v-if="isAdmin && !props.item.approved && !isPast(props.item.startDate)">
                  <v-list-tile-title>approve reservation</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-title class="subtitle">{{props.item.facility.name}} <br><span class="caption">{{props.item.facility.type}} #{{props.item.facility.number}}</span> </v-card-title>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>Start Date:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.startDate}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>End Date:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.endDate}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Duration:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.duration}} day{{props.item.duration !== 1 ? 's' : ''}}</v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-content><strong>User:</strong></v-list-tile-content>
              <v-list-tile-content class="align-end" @click.stop="toggleUserShown(props.item)"><v-icon>{{props.item.userShown ? 'keyboard_arrow_up': 'keyboard_arrow_down'}}</v-icon></v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile v-if="props.item.userShown">
              <v-list-tile-content>Name:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.user.name}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="props.item.userShown">
              <v-list-tile-content>Email:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.user.email}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="props.item.userShown">
              <v-list-tile-content>Mobile:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.user.mobile}}</v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile>
              <v-list-tile-content><strong>Facility</strong></v-list-tile-content>
              <v-list-tile-content class="align-end" @click.stop="toggleFacilityShown(props.item)"><v-icon>{{props.item.facilityShown ? 'keyboard_arrow_up': 'keyboard_arrow_down' }}</v-icon></v-list-tile-content>
            </v-list-tile>
            <v-divider/>
            <v-list-tile v-if="props.item.facilityShown">
              <v-list-tile-content>Name:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.facility.name}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="props.item.facilityShown">
              <v-list-tile-content>Type:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.facility.type}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="props.item.facilityShown">
              <v-list-tile-content>Capacity:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{props.item.facility.capacity}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>
<script>
  import { fetchReservations, deleteReservation, approveReservation, changeReservationFacility, changeReservationDuration } from '../service/dataService';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  import * as moment from 'moment';
  import Bus from '@/events/Bus';
  export default {
    name: 'view-reservations',
    data () {
      return {
        items: [],
        loading: true,
        rowsPerPageItems: [3, 6, 9],
        pagination: {
          rowsPerPage: 3
        }
      };
    },
    computed: {
      ...mapGetters({ isAdmin: types.authTypes.getters.isAdmin })
    },
    methods: {
      addUIFlags (reservations) {
        return reservations.map(reservation => Object.assign({ userShown: false, facilityShown: false }, reservation));
      },
      toggleUserShown (item) {
        item.userShown = !item.userShown;
      },
      toggleFacilityShown (item) {
        item.facilityShown = !item.facilityShown;
      },
      async deleteItemClicked (item) {
        console.log('attempting to delete item', item);
        this.loading = true;
        const result = await deleteReservation(item.id);
        if (result) this.deleteLocalReservation(item.id);
        this.loading = false;
      },
      deleteLocalReservation (id) {
        this.items = this.items.filter(item => item.id !== id);
      }, /*
      updateDateClicked (item) {
        console.log('attempting to update date on item', item);
        Bus.$emit('show-dialog', { card: 'choose-new-date-card', selectedReservation: item });
      },*/
      updateDurationClicked (item) {
        this.loading = true;
        console.log('attempting to update duration on item', item);
        Bus.$once('accept-update-duration', async duration => {
          console.log('data returned from dialog', duration);
          await changeReservationDuration(item.id, duration.newDuration);
          await this.fetchReservations();
          this.loading = false;
        });
        Bus.$emit('show-dialog', { card: 'choose-new-duration-card', selectedReservation: item, acceptTitle: 'accept-update-duration' });
      },
      updateFacilityClicked (item) {
        this.loading = true;
        console.log('attempting facility on item', item);
        Bus.$once('accept-update-facility', async data => {
          Bus.$off('reject-update-facility');
          console.log('data returned from dialog:', data);
          await changeReservationFacility(item.id, data.id);
          await this.fetchReservations();
          this.loading = false;
        });
        Bus.$emit('show-dialog', { card: 'choose-new-facility-card', acceptTitle: 'accept-update-facility', rejectTitle: 'reject-update-facility' });
      },
      async approveReservation (item) {
        console.log('approving reservation', item.id);
        this.loading = true;
        const result = await approveReservation(item.id);
        if (result) this.approveLocalReservation(item.id);
        this.loading = false;
      },
      approveLocalReservation (id) {
        const reservation = this.items.find(item => item.id === id);
        console.log('local reservation', reservation);
        reservation.approved = true;
      },
      isPast (date) {
        return moment(date).isSameOrBefore(moment());
      },
      async fetchReservations () {
        this.items = this.addUIFlags(await fetchReservations());
      }
    },
    async created () {
      await this.fetchReservations();
      this.loading = false;
    }
  };
</script>
