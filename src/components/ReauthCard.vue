<template>
  <v-card>
    <v-card-title>
      Please enter your password to perform this action
    </v-card-title>
    <v-form
      novalidate
    >
      <v-container grid-list-md text-xs-center>
        <v-layout column>
          <v-flex>
            <v-text-field
              label="Old Password"
              type="password"
              v-model="enteredPassword"
              required
              hint="Enter your old password"
              persistent-hint
            />
          </v-flex>
          <v-flex v-if="isUpdatePassword">
            <v-text-field
              label="New Password"
              type="password"
              v-model="newPassword"
              hint="Enter your new password"
              persistent-hint
              data-vv-name="new-password"
              v-validate="{required: true, min: 6}"
              :error-messages="errors.collect('new-password')"
              required
            />
          </v-flex>
          <v-flex v-if="isUpdatePassword">
            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="confirmPassword"
              hint="Confirm new password"
              persistent-hint
              data-vv-name="confirm-password"
              required
              v-validate="{required: true, is: newPassword}"
              :error-messages="errors.collect('confirm-password')"
            />
          </v-flex>
          <v-flex>
            <submit-form-button-group
              :loading="loading"
              :form-submittable="currentlyValid"
              :form-has-values="true"
              :has-close="false"
              negative-text="close"
              @submit-clicked="handleSubmission"
              @reset-clicked="cancelCheck"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
  import { makeReauthRequest } from '../service/authService';
  import { mapGetters } from 'vuex';
  import types from '../store/types';
  import Bus from '@/events/Bus';
  import SubmitFormButtonGroup from './SubmitFormButtonGroup';
  import { updateSingleUserProp } from '../service/dataService';

  export default {
    name: 'reauth-card',
    components: { SubmitFormButtonGroup },
    data () {
      return {
        enteredPassword: '',
        newPassword: '',
        confirmPassword: '',
        loading: false
      };
    },
    props: {
      isUpdatePassword: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters({ username: types.authTypes.getters.getUsername }),
      authCheckValid () {
        return this.enteredPassword.length > 5;
      },
      resetPasswordValid () {
        return this.authCheckValid && this.confirmPassword.length > 0 && this.newPassword.length > 0 && !this.errors.has('confirm-password') && !this.errors.has('new-password');
      },
      currentlyValid () {
        return this.isUpdatePassword ? this.resetPasswordValid : this.authCheckValid;
      }
    },
    methods: {
      async checkPasswordValidity () {
        console.log('testing auth for', this.username);
        const result = await makeReauthRequest(this.enteredPassword);
        if (!result || result.status !== 200) {
          Bus.$emit('show-snack', { message: 're-authentication failed' });
          this.$emit('reject');
          return;
        }
        this.$emit('accept');
        this.$emit('dialog-closed');
      },
      cancelCheck () {
        console.log('canceling auth check');
        this.$emit('reject');
        this.$emit('dialog-closed');
      },
      async handleSubmission () {
        this.loading = true;
        if (!this.isUpdatePassword) {
          await this.checkPasswordValidity();
        } else {
          await updateSingleUserProp({ prop: 'password', value: this.newPassword });
        }
        this.loading = false;
      }
    }
  };
</script>
