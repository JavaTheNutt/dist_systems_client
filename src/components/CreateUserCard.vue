<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline mb-0">Please fill out some basic details</h3>
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
              name="fname"
              label="Enter your First Name"
              hint="At least 2 characters"
              v-model="submissionDetails.fname"
              type="text"
              required
              v-validate="{ required: true, min: 2}"
              data-vv-name="fname"
              :error-messages="errors.collect('fname')"
              ref="fname"
              id="fname"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              name="sname"
              label="Enter your Surname"
              hint="At least 2 characters"
              v-model="submissionDetails.sname"
              min="2"
              required
              v-validate="{required: true, min: 2}"
              data-vv-name="sname"
              :error-messages="errors.collect('sname')"
              ref="sname"
              id="sname"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              name="mobile"
              label="Enter your Mobile No."
              hint="At least 2 characters"
              v-model="submissionDetails.mobile"
              type="number"
              min="10"
              required
              v-validate="{required: true, digits: 10}"
              data-vv-name="mobile"
              :error-messages="errors.collect('mobile')"
              ref="mobile"
              id="mobile"
            />
          </v-flex>
          <v-flex>
            <v-select
              :items="['Manager', 'Parent', 'Player', 'Staff']"
              v-model="submissionDetails.role"
              label="Role"
              hint="Select Role"
              autocomplete
            />
          </v-flex>
          <v-flex>
            <submit-form-button-group
              :loading="loading"
              :form-submittable="formValid"
              :form-has-values="formHasValues"
              :has-close="true"
              @close-clicked="closeClicked"
              @submit-clicked="submitClicked"
              @reset-clicked="resetForm"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </form>
  </v-card>
</template>
<script>
  import SubmitFormButtonGroup from './SubmitFormButtonGroup';
  import FormMixin from '../Mixins/Form';
  import { postInitialUserDetails } from '../service/dataService';

  export default {
    mixins: [FormMixin],
    methods: {
      closeClicked () {
        console.log('close clicked event caught in login form');
        this.$emit('dialog-closed');
      },
      async submitClicked () {
        console.log('submit clicked event caught in login form');
        this.loading = true;
        const result = await postInitialUserDetails(this.submissionDetails);
        this.loading = false;
        if (result) this.closeClicked();
      },
      formSubmitted () {
        console.log('form submission by keypress caught');
        if (this.formValid) this.submitClicked();
      }
    },
    components: { SubmitFormButtonGroup },
    name: 'create-user-card',
    data () {
      return {
        submissionDetails: {
          fname: '',
          sname: '',
          role: 'Parent'
        },
        loading: false
      };
    },
    computed: {
      formValid () {
        return this.standardFieldsValid;
      },
      standardFieldsValid () {
        return this.standardFieldsInteractedWith && !this.errors.has('fname') && !this.errors.has('sname');
      },
      formInteractedWith () {
        return this.standardFieldsInteractedWith;
      },
      standardFieldsInteractedWith () {
        return this.hasFields && this.fields.fname.dirty && this.fields.sname.dirty;
      },
      hasFields () {
        return !!this.fields.fname && !!this.fields.sname;
      },
      formHasTextValues () {
        console.log('evaluating form has values');
        return Object.values(this.submissionDetails)
        .filter(elem => typeof elem === 'string')
        .map(elem => elem.length)
        .reduce((index, elem) => index += elem, 0) > 0;
        // return this.submissionDetails.email.length + this.submissionDetails.password.length + this.confirmPassword.length > 0;
      },
      formHasErrors () {
        return this.errors.any();
      },
      formHasValues () {
        return this.formHasTextValues || this.formHasErrors;
      }
    }
  };
</script>
