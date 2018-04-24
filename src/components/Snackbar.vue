<template>
  <v-snackbar
    :timeout="4000"
    bottom
    v-model="snackbarShown">
    {{message}}
    <v-btn flat :color="status === 'success' ? 'success':'accent'" @click.stop="snackbarShown = false" ref="closeSnackbarButton">Close</v-btn>
  </v-snackbar>
</template>
<script>
  import Bus from '../events/Bus';
  export default {
    name: 'snackbar',
    data () {
      return {
        message: '',
        status: 'error',
        snackbarShown: false
      };
    },
    created () {
      Bus.$on('show-snack', details => {
        if (!details || !details.message) return;
        this.message = details.message;
        this.status = details.status || 'error';
        this.snackbarShown = true;
      });
    }
  };
</script>
