<template>
  <v-app light>
    <navigation/>
    <v-content>
      <show-user-name-container v-if="loggedIn"/>
      <router-view/>
    </v-content>
    <generic-dialog/>
  </v-app>
</template>

<script>
  import Navigation from './components/Navigation';
  import GenericDialog from './components/GenericDialog';
  import { mapGetters } from 'vuex';
  import types from './store/types';
  import ShowUserNameContainer from './components/ShowUserNameContainer';
  export default {
    components: {
      ShowUserNameContainer,
      Navigation,
      GenericDialog
    },
    computed: {
      ...mapGetters({ loggedIn: types.authTypes.getters.isLoggedIn })
    }
  };
</script>
