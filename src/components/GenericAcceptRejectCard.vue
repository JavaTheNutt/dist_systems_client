<template>
  <v-card>
    <v-card-title primary-title v-if="cardTitle.length > 0">
      <h3 class="headline mb-0">{{cardTitle}}</h3>
    </v-card-title>
    <v-card-text subtitle v-if="cardText.length > 0">
      <p class="subheading">{{cardText}}</p>
    </v-card-text>
    <v-card-actions>
      <submit-form-button-group
      :has-close="true"
      :form-submittable="true"
      :form-has-values="true"
      positive-text="yes"
      negative-text="no"
      :loading="false"

      />
    </v-card-actions>
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
        this.$emit('dialog-closed');
      },
      yesClicked () {
        console.log('yes clicked in accept reject card');
        this.accept();
      },
      noClicked () {
        console.log('no clicked in accept reject card');
        this.$emit('dialog-closed');
      }
    }
  };
</script>
