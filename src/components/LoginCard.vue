<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline mb-0">Please log in or sign up to use this service</h3>
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
              name="emailField"
              label="Enter your email address"
              v-model="submissionDetails.email"
              type="email"
              required
              v-validate="'required|email'"
              data-vv-name="email"
              :error-messages="errors.collect('email')"
              ref="emailField"
              id="emailField"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              name="passwordField"
              label="Enter your Password"
              hint="At least 6 characters"
              v-model="submissionDetails.password"
              :type="passwordShown ? 'text' : 'password'"
              min="6"
              required
              :append-icon="passwordShown ? 'visibility_off': 'visibility'"
              :append-icon-cb="()=>(passwordShown = !passwordShown)"
              v-validate="'required|min:6'"
              data-vv-name="password"
              :error-messages="errors.collect('password')"
              ref="password"
              id="passwordField"
            />
          </v-flex>

          <v-flex v-show="createAccountTicked">
            <v-text-field
              name="confirmPasswordField"
              label="Confirm your Password"
              hint="At least 6 characters"
              v-model="confirmPassword"
              :type="passwordShown ? 'text' : 'password'"
              min="6"
              required
              :append-icon="passwordShown ? 'visibility_off': 'visibility'"
              :append-icon-cb="()=>(passwordShown = !passwordShown)"
              v-validate="{required: true, is: submissionDetails.password}"
              data-vv-name="confirmPassword"
              :error-messages="errors.collect('confirmPassword')"
              id="confirmPasswordField"
            />
          </v-flex>
          <v-flex v-if="createAccountTicked">
            <v-checkbox label="Request admin status?"
                        v-model="submissionDetails.requestAdminStatus"
                        color="info"
                        :value="true"
                        hide-details
                        id="requestAdminStatusCheckbox"
            />
          </v-flex>
          <v-flex>
            <v-checkbox label="Create new account?"
                        v-model="createAccountTicked"
                        color="info"
                        :value="true"
                        hide-details
                        id="createNewAccountCheckbox"
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
  import { makeLoginSignupRequest } from '../service/authService';
  import Bus from '../events/Bus';

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
        const result = await makeLoginSignupRequest(this.submissionDetails, this.createAccountTicked);
        this.loading = false;
        if (result && this.createAccountTicked) Bus.$emit('show-dialog', { card: 'create-user-card', persistent: true });
        else if (result) this.closeClicked();
      },
      formSubmitted () {
        console.log('form submission by keypress caught');
        if (this.formValid) this.submitClicked();
      }
    },
    components: { SubmitFormButtonGroup },
    name: 'login-card',
    data () {
      return {
        submissionDetails: {
          email: '',
          password: '',
          requestAdminStatus: false,
          fname: '',
          sname: '',
          role: ''
        },
        createAccountTicked: false,
        confirmPassword: '',
        passwordShown: false,
        loading: false
      };
    },
    computed: {
      formValid () {
        return this.createAccountTicked ? this.standardFieldsValid && !this.errors.has('confirmPassword')
          : this.standardFieldsValid;
      },
      standardFieldsValid () {
        return this.standardFieldsInteractedWith && !this.errors.has('email') && !this.errors.has('password');
      },
      formInteractedWith () {
        return this.standardFieldsInteractedWith && this.fields.confirmPassword.dirty;
      },
      standardFieldsInteractedWith () {
        return this.hasFields && this.fields.email.dirty && this.fields.password.dirty;
      },
      hasFields () {
        return !!this.fields.email && !!this.fields.password;
      },
      formHasTextValues () {
        console.log('evaluating form has values');
        return Object.values(this.submissionDetails)
          .filter(elem => typeof elem === 'string')
        .map(elem => elem.length)
        .reduce((index, elem) => index += elem, 0) > 0;
      },
      formHasErrors () {
        return this.errors.any();
      },
      nonTextFieldsInteractedWith () {
        return this.createAccountTicked;
      },
      formHasValues () {
        return this.formHasTextValues || this.nonTextFieldsInteractedWith || this.formHasErrors;
      }
    }
  };
</script>
