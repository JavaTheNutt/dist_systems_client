<template>
  <v-app light>
    <navigation/>
    <generic-dialog/>
  </v-app>
</template>

<script>
  import Navigation from './components/Navigation';
  import GenericDialog from './components/GenericDialog';
  export default {
    components: { Navigation, GenericDialog }
  };
</script>
