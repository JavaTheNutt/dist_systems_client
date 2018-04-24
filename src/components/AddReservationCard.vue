<template>
  <v-card>
    <v-container fluid>
      <v-layout class="text-xs-center" column>
        <v-flex class="text-xs-center">
          <v-card-title class="mb-0 pb-0">
            <h3 class="headline">Add reservation for {{facilityName}}?</h3>
          </v-card-title>
          <v-card-text subtitle class="mt-0 pt-0 text-xs-left">
            <p class="body-1"><em>{{facilityType}} #{{facilityNumber}}</em></p>
          </v-card-text>
        </v-flex>
        <v-flex>
          <form novalidate
                ref="loginForm"
                v-model="formValid"
                @submit.stop.prevent="formSubmitted"
                @keyup.enter="formSubmitted">
            <v-container grid-list-md text-xs-center>
              <v-layout column>
                <v-flex>
                  <v-text-field
                    name="title"
                    label="Reservation Title"
                    hint="At least 4 characters"
                    v-model="submissionDetails.title"
                    type="text"
                    required
                    v-validate="{ required: true, min: 4}"
                    data-vv-name="title"
                    :error-messages="errors.collect('title')"
                    ref="title"
                    id="title"
                  />
                </v-flex>
                <v-flex>
                  <v-text-field
                    name="description"
                    label="Reservation Description"
                    hint="Optional"
                    persistent-hint
                    v-model="submissionDetails.description"
                    ref="description"
                    id="description"
                  />
                </v-flex>
                <v-flex>
                  <v-menu
                    ref="reservationDateMenu"
                    lazy
                    :close-on-content-click="false"
                    v-model="datepickerMenu"
                    :return-value.sync="submissionDetails.date"
                    full-width
                    transition="scale-transition"
                  >
                    <v-text-field
                      slot="activator"
                      label="Reservation Date"
                      prepend-icon="event"
                      readonly
                      v-model="submissionDetails.date"
                    />
                    <v-date-picker
                      v-model="submissionDetails.date"
                      :allowed-dates="allowedDates"
                      :min="minDate()"
                      :max="maxDate()"
                      no-title
                      scrollable
                    >
                      <v-spacer/>
                      <v-btn flat color="accent" @click="datepickerMenu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.reservationDateMenu.save(submissionDetails.date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex>
                  <v-container fluid grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs10>
                        <v-slider label="Duration" v-model="submissionDetails.duration" thumb-label step="1" :min="1" :max="daysToNextSelected" ticks/>
                      </v-flex>
                      <v-flex xs2>
                        {{submissionDetails.duration}} day{{submissionDetails.duration > 1 ? 's' : ''}}
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex v-if="submissionDetails.date !== ''">
                  Start: {{formattedStartDate}}
                </v-flex>
                <v-flex v-if="submissionDetails.date !== ''">
                  End: {{formattedEndDate}}
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-flex>
        <v-flex>
          <v-card-actions>
            <submit-form-button-group
              :has-close="false"
              :form-submittable="formValid"
              :form-has-values="true"
              positive-text="Submit"
              negative-text="Cancel"
              @submit-clicked="submit"
              @reset-clicked="cancel"
              :loading="loading"
              align="right"
            />
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import SubmitFormButtonGroup from './SubmitFormButtonGroup';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  import { fetchUsedDatesForFacility, createReservation } from '../service/dataService';
  import * as moment from 'moment';

  export default {
    name: 'add-reservation-card',
    data () {
      return {
        submissionDetails: {
          title: '',
          description: '',
          date: '',
          duration: 1
        },
        datepickerMenu: false,
        usedDates: [],
        loading: false
      };
    },
    components: { SubmitFormButtonGroup },
    props: {
      facilityType: {
        type: String
      },
      facilityName: {
        type: String
      },
      facilityNumber: {
        type: Number
      },
      facilityId: {
        type: Number
      }
    },
    computed: {
      ...mapGetters({ userId: types.authTypes.getters.getID }),
      formValid () {
        return this.submissionDetails.title.length > 0 && this.submissionDetails.date.length > 0;
      },
      daysToNextSelected () {
        if (this.submissionDetails.date === '' || this.usedDates === [] || this.usedAfterSelected === []) return 10;
        console.log('nearest date', this.usedAfterSelected[0]);
        console.log('selected date', this.submissionDetails.date);
        const diff = moment(this.submissionDetails.date).diff(moment(this.usedAfterSelected[0]), 'days');
        console.log('difference', diff);
        return diff < -10 || diff > 9 ? 10 : diff * -1;
      },
      usedAfterSelected () {
        if (this.submissionDetails.date === '') return this.usedDates;
        return this.usedDates.filter(date => moment(date).isSameOrAfter(moment(this.submissionDetails.date)));
      },
      formattedStartDate () {
        if (this.submissionDetails.date === '') return '';
        return moment(this.submissionDetails.date).format('dddd, MMMM Do YYYY');
      },
      formattedEndDate () {
        if (this.submissionDetails.date === '') return '';
        return moment(this.submissionDetails.date).add(this.submissionDetails.duration, 'days').format('dddd, MMMM Do YYYY');
      }
    },
    methods: {
      async submit () {
        this.loading = true;
        console.log('submit event triggered in add reservation');
        const result = await createReservation(Object.assign({ facility: this.facilityId }, this.submissionDetails));
        this.loading = false;
        if (result) this.$emit('dialog-closed');
      },
      cancel () {
        console.log('cancel event triggered in add reservation');
        this.$emit('dialog-closed');
      },
      allowedDates (date) {
        return this.usedDates.indexOf(date) === -1;
      },
      minDate () {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        return today.toISOString();
      },
      maxDate () {
        const today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        return today.toISOString();
      }
    },
    async created () {
      this.usedDates = (await fetchUsedDatesForFacility(this.facilityId)).data.sort();
    }
  };
</script>

