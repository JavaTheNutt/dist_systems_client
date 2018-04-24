<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline mb-0">Add new facility</h3>
    </v-card-title>
    <form novalidate
          ref="loginForm"
          v-model="formValid"
          @submit.stop.prevent="formSubmitted"
          @keyup.enter="formSubmitted">
      <v-container grid-list-md text-xs-center>
        <v-layout column>
          <v-flex>
            <v-text-field
              name="name"
              label="Facility Name"
              hint="At least 2 characters"
              v-model="submissionDetails.name"
              type="text"
              required
              v-validate="{ required: true, min: 2}"
              data-vv-name="name"
              :error-messages="errors.collect('name')"
              ref="name"
              id="name"
            />
          </v-flex>
          <v-flex>
            <v-select
              :items="['Pitch', 'Meeting Room', 'Pool', 'Function Room']"
              v-model="submissionDetails.type"
              label="Type"
              hint="Select Type"
              autocomplete
            />
          </v-flex>
          <v-flex>
            <v-text-field
              name="capacity"
              label="Facility Capacity"
              hint="At least 2 characters"
              v-model="submissionDetails.capacity"
              type="number"
              required
              v-validate="{required: true, numeric: true, min_value: 3}"
              data-vv-name="capacity"
              :error-messages="errors.collect('capacity')"
              ref="capacity"
              id="capacity"
            />
          </v-flex>
          <v-flex>
            <submit-form-button-group
              :loading="loading"
              :form-submittable="formValid"
              :form-has-values="true"
              :has-close="false"
              @submit-clicked="submitClicked"
              @reset-clicked="closeClicked"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </form>
  </v-card>
</template>
<script>
  import SubmitFormButtonGroup from './SubmitFormButtonGroup';
  import { createFacility } from '../service/dataService';
  import Bus from '../events/Bus';

  export default {
    name: 'add-facility-card',
    components: { SubmitFormButtonGroup },
    data () {
      return {
        submissionDetails: {
          name: '',
          type: 'Pitch',
          capacity: 3
        },
        loading: false
      };
    },
    computed: {
      formValid () {
        return this.submissionDetails.name.length > 1;
      }
    },
    methods: {
      async submitClicked () {
        console.log('submit clicked');
        this.loading = true;
        const result = await createFacility(this.submissionDetails);
        this.loading = false;
        if (result && result.success) {
          Bus.$emit('facility-added', result.data);
          this.$emit('dialog-closed');
        }
      },
      closeClicked () {
        console.log('close clicked');
        this.$emit('dialog-closed');
      }
    }
  };
</script>
