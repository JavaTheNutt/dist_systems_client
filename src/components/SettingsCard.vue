<template>
  <v-card>
    <v-container v-if="loading" fill-height class="mt-5">
      <v-layout row wrap align-center>
        <v-flex class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :size="100"/>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-if="!loading" fluid>
      <v-layout row justify-center>
        <v-flex xs2 class="headline text-xs-right mr-3">
          <strong>First Name:</strong>
        </v-flex>
        <v-flex xs4 class="headline" v-if="!editFirstName">
          {{firstName}}
        </v-flex>
        <v-flex xs4 v-if="editFirstName">
          <v-text-field v-model="newFirstName"/>
        </v-flex>
        <v-flex xs2 v-if="!editFirstName">
          <v-btn icon flat :disabled="anyInEdit" @click.stop="editFirstName = true"><v-icon>edit</v-icon></v-btn>
        </v-flex>
        <v-flex xs2 v-if="editFirstName">
          <v-btn
            icon
            color="success"
            @click.stop="updateFname"
            :disabled="!firstNameValid"
            flat
          >
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            flat
            @click.stop="editFirstName = false"
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs2 class="headline text-xs-right mr-3">
          <strong>Surname:</strong>
        </v-flex>
        <v-flex xs4 class="headline" v-if="!editSurname">
          {{surname}}
        </v-flex>
        <v-flex xs4 v-if="editSurname">
          <v-text-field v-model="newSurname"/>
        </v-flex>
        <v-flex xs2 v-if="!editSurname">
          <v-btn icon flat :disabled="anyInEdit" @click.stop="editSurname = true"><v-icon>edit</v-icon></v-btn>
        </v-flex>
        <v-flex xs2 v-if="editSurname">
          <v-btn
            icon
            color="success"
            @click.stop="updateSname"
            :disabled="!surnameValid"
            flat
          >
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            @click.stop="editSurname = false"
            flat
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs2 class="headline  text-xs-right mr-3">
          <strong>Mobile:</strong>
        </v-flex>
        <v-flex xs4 class="headline" v-if="!editMobile">
          {{mobile}}
        </v-flex>
        <v-flex xs4 v-if="editMobile">
          <v-text-field v-model="newMobile"/>
        </v-flex>
        <v-flex xs2 v-if="!editMobile">
          <v-btn
            icon
            flat
            :disabled="anyInEdit"
            v-if="!editMobile"
            @click.stop="editMobile = true"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs2 v-if="editMobile">
          <v-btn
            icon
            color="success"
            :disabled="!mobileNumberValid"
            @click.stop="updateMobileNo"
            flat
          >
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            @click.stop="editMobile = false"
            flat
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs2 class="headline  text-xs-right mr-3">
          <strong>Email:</strong>
        </v-flex>
        <v-flex xs4 class="headline" v-if="!editEmail">
          {{email}}
        </v-flex>
        <v-flex xs4 v-if="editEmail">
          <v-text-field v-model="newEmail"/>
        </v-flex>
        <v-flex xs2 v-if="!editEmail">
          <v-btn
            icon
            flat
            :disabled="anyInEdit"
            @click.stop="editEmail = true"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs2 v-if="editEmail">
          <v-btn
            icon
            flat
            color="success"
            @click.stop="updateEmail"
            :disabled="!emailValid"
          >
            <v-icon>check_circle</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            flat
            @click.stop="editEmail = false"
          >
            <v-icon>cancel</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex>
          <v-btn flat primary @click.stop="updatePassword">Change Password</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import types from '@/store/types';
  import { updateSingleUserProp } from '../service/dataService';
  import Bus from '@/events/Bus';
  import { validate } from 'email-validator';

  export default {
    name: 'settings-card',
    data () {
      return {
        newEmail: '',
        newFirstName: '',
        newSurname: '',
        newMobile: '',
        editEmail: false,
        editMobile: false,
        editFirstName: false,
        editSurname: false,
        loading: false
      };
    },
    computed: {
      ...mapGetters({
        name: types.authTypes.getters.getName,
        mobile: types.authTypes.getters.getMobile,
        email: types.authTypes.getters.getUsername
      }),
      firstName () {
        return this.splitName(this.name)[0];
      },
      firstNameValid () {
        return this.newFirstName.length >= 2 && this.firstName !== this.newFirstName;
      },
      surnameValid () {
        return this.newSurname.length >= 3 && this.surname !== this.newSurname;
      },
      mobileNumberValid () {
        return this.newMobile.length === this.mobile.length && this.newMobile !== this.mobile;
      },
      surname () {
        return this.splitName(this.name)[1];
      },
      emailValid () {
        return this.newEmail !== this.email && validate(this.newEmail);
      },
      anyInEdit () {
        return this.editEmail || this.editMobile || this.editFirstName || this.editSurname;
      }
    },
    methods: {
      ...mapMutations({
        updateAuthProp: types.authTypes.mutations.UPDATE_PROPERTY
      }),
      splitName (name) {
        return name.split(' ');
      },
      async updateFname () {
        if (!this.firstNameValid) return;
        this.loading = true;
        const result = await updateSingleUserProp({ prop: 'fname', value: this.newFirstName.trim() });
        console.log('update first name result', result);
        this.editFirstName = false;
        this.loading = false;
      },
      async updateSname () {
        if (!this.surnameValid) return;
        this.loading = true;
        const result = await updateSingleUserProp({ prop: 'sname', value: this.newSurname.trim() });
        console.log('update surname result', result);
        this.editSurname = false;
        this.loading = false;
      },
      async updateMobileNo () {
        if (!this.mobileNumberValid) return;
        this.loading = true;
        const result = await updateSingleUserProp({ prop: 'mobile', value: this.newMobile.trim() });
        console.log('update surname result', result);
        this.editSurname = false;
        this.loading = false;
      },
      updateEmail () {
        if (!this.emailValid) return;
        this.loading = true;
        Bus.$once('accept-reauth', async () => {
          Bus.$off('reject-reauth');
          console.log('attempting to update email to', this.newEmail);
          const result = await updateSingleUserProp({ prop: 'email', value: this.newEmail });
          if (result) this.updateAuthProp({ prop: 'username', value: this.newEmail });
          this.loading = false;
          this.editEmail = false;
        });
        Bus.$once('reject-reauth', () => {
          Bus.$off('accept-reauth');
          console.log('reauth rejected');
          this.loading = false;
        });
        Bus.$emit('show-dialog', { card: 'reauth-card', acceptTitle: 'accept-reauth', rejectTitle: 'reject-reauth' });
      },
      updatePassword () {
        Bus.$emit('show-dialog', { card: 'reauth-card', isUpdatePassword: true });
      }
    },
    mounted () {
      this.newEmail = this.email;
      this.newFirstName = this.firstName;
      this.newSurname = this.surname;
      this.newMobile = this.mobile;
    }
  };
</script>
