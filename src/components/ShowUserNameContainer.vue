<template>
  <v-container fluid>
    <v-layout class="text-xs-left">
      <v-flex class="headline"><h3>Welcome, {{username}}</h3></v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { mapGetters } from 'vuex';
  import types from '@/store/types';

  export default {
    name: 'show-user-name-container',
    computed: {
      ...mapGetters({ username: types.authTypes.getters.getName })
    }
  };
</script>
