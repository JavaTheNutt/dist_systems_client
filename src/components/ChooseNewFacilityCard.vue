<template>
<v-card>
  <v-container fluid>
    <v-layout column>
      <v-card-title>Please select a new facility</v-card-title>
      <v-flex>
        <v-select
          v-model="selectedItem"
          :items="items"
          label="select a new facility"
        />
      </v-flex>
      <v-btn color="success" @click.stop="$emit('accept', {id: selectedItem})">submit</v-btn>
      <v-btn color="cancel" @click.stop="$emit('dialog-closed')">submit</v-btn>
    </v-layout>
  </v-container>
</v-card>
</template>
<script>
  import { fetchShortFacilities } from '../service/dataService';

  export default {
    name: 'choose-new-facility-card',
    data () {
      return {
        items: [],
        selectedItem: {}
      };
    },
    methods: {
      mapShortFacilities (facilities) {
        return facilities.map(facility => ({ text: facility.f_name, value: facility.id }));
      }
    },
    async created () {
      this.items = this.mapShortFacilities(await fetchShortFacilities());
      this.selectedItem = this.items[0].value;
    }
  };
</script>
