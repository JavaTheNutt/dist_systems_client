<template>
  <v-card>
    <v-container fluid>
      <v-layout column>
        <v-flex>
          <p class="headline">Please select a new date for this reservation</p>
        </v-flex>
        <v-flex>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs10>
                <v-slider label="Duration" v-model="newDuration" thumb-label step="1" :min="1" :max="maxDuration()" ticks/>
              </v-flex>
              <v-flex xs2>
                {{newDuration}} day{{newDuration > 1 ? 's' : ''}}
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex>
          <v-btn color="success" @click.stop="$emit('accept', {newDuration})">submit</v-btn>
          <v-btn color="cancel" @click.stop="$emit('dialog-closed')">submit</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
  import { fetchUsedDatesForFacility } from '../service/dataService';
  import * as moment from 'moment';

  export default {
    name: 'choose-new-duration-card',
    props: {
      selectedReservation: Object
    },
    data () {
      return {
        usedDates: [],
        newDuration: 1
      };
    },
    methods: {
      filterBefore (dates) {
        return dates.filter(date => moment(this.selectedReservation.endDate).isBefore(moment(date)));
      },
      maxDuration () {
        const diff = moment(this.selectedReservation.startDate).diff(moment(this.usedDates[0]), 'days');
        console.log('difference', diff);
        return diff < -10 || diff > 10 ? 10 : diff * -1;
      }
    },
    async created () {
      this.usedDates = this.filterBefore((await fetchUsedDatesForFacility(this.selectedReservation.facility.id)).data).sort();
    }
  };
</script>
