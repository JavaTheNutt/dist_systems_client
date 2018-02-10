<template>
  <v-card>
    <v-container fluid>
      <v-layout class="text-xs-center" column>
        <v-flex class="text-xs-center">
          <v-card-title v-if="cardTitle.length > 0">
            <h3 class="text-xs-center headline">{{cardTitle}}</h3>
          </v-card-title>
        </v-flex>
        <v-flex>
          <v-card-text subtitle v-if="cardText.length > 0">
            <p class="subheading">{{cardText}}</p>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-card-actions>
            <submit-form-button-group
              :has-close="false"
              :form-submittable="true"
              :form-has-values="true"
              positive-text="yes"
              negative-text="no"
              @submit-clicked="yesClicked"
              @reset-clicked="noClicked"
              :loading="false"
              align="center"
            />
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>

</template>
<script>
  import SubmitFormButtonGroup from './SubmitFormButtonGroup';

  export default {
    components: { SubmitFormButtonGroup },
    name: 'GenericAcceptRejectCard',
    props: {
      cardTitle: String,
      cardText: String,
      accept: Function
    },
    methods: {
      closeClicked () {
        console.log('close event caught in accept reject card');
        this.$emit('reject');
        this.$emit('dialog-closed');
      },
      yesClicked () {
        console.log('yes clicked in accept reject card');
        this.$emit('accept');
        this.$emit('dialog-closed');
      },
      noClicked () {
        console.log('no clicked in accept reject card');
        this.$emit('reject');
        this.$emit('dialog-closed');
      }
    }
  };
</script>
