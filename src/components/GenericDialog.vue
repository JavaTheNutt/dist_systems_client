<template>
  <v-dialog v-model="dialogShown" :max-width="width" ref="genericDialog" :persistent="persistent">
    <component
      :is="currentCard"
      @dialog-closed="dialogShown = false"
      ref="currentComponent"
      @cache-state="cacheState"
      @revert-state="revertState"
      :init-data="formInitData"
      :accept="acceptFunction"
      :reject="rejectFunction"
    />
  </v-dialog>
</template>
<script>
  import Bus from '@/events/Bus';
  import LoginCard from './LoginCard';
  import GenericAcceptRejectCard from './GenericAcceptRejectCard';

  export default {
    name: 'generic-dialog',
    data () {
      return {
        dialogShown: false,
        currentCard: '',
        width: '700px',
        persistent: false,
        cachedState: {
          component: '',
          data: {}
        },
        acceptFunction: null,
        rejectFunction: null,
        formInitData: {},
        cardTitle: '',
        cardText: ''
      };
    },
    watch: {
      dialogShown (newVal) {
        if (!newVal) {
          this.currentCard = '';
          this.cachedState = {
            component: '',
            data: {}
          };
        }
      }
    },
    components: { LoginCard, GenericAcceptRejectCard },
    methods: {
      cacheState (state) {
        this.cachedState.component = this.currentCard;
        this.cachedState.width = this.width;
        this.cachedState.persistent = this.persistent;
        this.cachedState.data = state;
      },
      revertState () {
        this.formInitData = Object.assign({}, this.cachedState.data);
        this.width = this.cachedState.width;
        this.persistent = this.cachedState.persistent;
        this.currentCard = this.cachedState.component;
        this.cachedState = {};
      }
    },
    mounted () {
      Bus.$on('show-dialog', params => {
        console.log('show dialog event caught');
        if (!params || !params.card) return;
        this.currentCard = params.card;
        this.width = params.width || '700px';
        this.dialogShown = true;
        this.persistent = params.persistent || false;
        this.acceptFunction = params.accept;
        this.rejectFunction = params.reject;
        this.cardText = params.text || '';
        this.cardTitle = params.title || '';
      });
    }
  };
</script>

