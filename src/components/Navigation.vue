<template>
  <div>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon @click.stop="drawerShown = !drawerShown"/>
      <v-toolbar-title>Reservation System</v-toolbar-title>
      <v-spacer/>
      <v-btn color="accent" @click.stop="showLogin" v-if="!loggedIn">Login</v-btn>
      <v-toolbar-items class="hidden-sm-and-down" v-if="false">

        <v-btn flat  v-if="false">Link Two</v-btn>
        <v-btn flat  >Link Three</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer
      temporary
      v-model="drawerShown"
      light
      absolute
    >
      <v-list class="pt-0">
        <!--<v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="redirect(item.path)" :id="`link-${item.title}`">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-spacer style="height: 100%"></v-spacer>
        <v-list-tile style="bottom: 0" @click="shown = !shown" id="sideNavFooter">
          <v-list-tile-content>
            <v-list-tile-title>Joe Wemyss {{new Date().getFullYear()}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>-->
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
  import Bus from '@/events/Bus';
  import { mapGetters } from 'vuex';
  import types from '@/store/types';
  export default {
    name: 'navigation',
    data () {
      return {
        drawerShown: false
      };
    },
    methods: {
      showLogin () {
        Bus.$emit('show-dialog', { card: 'login-card' });
      }
    },
    computed: {
      ...mapGetters({ loggedIn: types.authTypes.getters.isLoggedIn })
    }
  };
</script>
