<template>
  <v-dialog v-model="dialogShown"
            :max-width="width"
            ref="genericDialog"
            :persistent="persistent"
            :fullscreen="fullscreen"
            :transition="transition"
            :overlay="overlay"
  >
    <component
      :is="currentCard"
      @dialog-closed="dialogShown = false"
      ref="currentComponent"
      @cache-state="cacheState"
      @revert-state="revertState"
      :init-data="formInitData"
      @accept="acceptClicked"
      @reject="rejectClicked"
      :cardTitle="cardTitle"
      :cardText="cardText"
      :facility-type="facilityData.facilityType"
      :facility-number="facilityData.facilityNumber"
      :facility-id="facilityData.facilityId"
      :facility-name="facilityData.facilityName"
      :is-update-password="isUpdatePassword"
      :selected-reservation="selectedReservation"
    />
  </v-dialog>
</template>
<script>
  import Bus from '@/events/Bus';
  import LoginCard from './LoginCard';
  import GenericAcceptRejectCard from './GenericAcceptRejectCard';
  import CreateUserCard from './CreateUserCard';
  import AddReservationCard from './AddReservationCard';
  import AddFacilityCard from './AddFacilityCard';
  import ReauthCard from './ReauthCard';
  import ChooseNewFacilityCard from './ChooseNewFacilityCard';
  import ChooseNewDateCard from './ChooseNewDateCard';
  import ChooseNewDurationCard from './ChooseNewDurationCard';

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
        accept () {},
        reject () {},
        formInitData: {},
        cardTitle: '',
        cardText: '',
        acceptEventTitle: '',
        rejectEventTitle: '',
        facilityData: {
          facilityType: '',
          facilityName: '',
          facilityNumber: -1,
          facilityId: -1
        },
        fullscreen: false,
        transition: 'dialog-transition',
        overlay: false,
        isUpdatePassword: false,
        selectedReservation: {}
      };
    },
    watch: {
      dialogShown (newVal) {
        if (!newVal) {
          this.$nextTick(() => {
            this.currentCard = '';
            this.cachedState = {
              component: '',
              data: {}
            };
          });
        }
      }
    },
    components: {
      LoginCard,
      GenericAcceptRejectCard,
      CreateUserCard,
      AddReservationCard,
      AddFacilityCard,
      ReauthCard,
      ChooseNewFacilityCard,
      ChooseNewDateCard,
      ChooseNewDurationCard
    },
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
      },
      acceptClicked (data) {
        if (this.acceptEventTitle.length > 0) Bus.$emit(this.acceptEventTitle, data);
        this.accept();
        this.dialogShown = false;
      },
      rejectClicked () {
        if (this.rejectEventTitle.length > 0) Bus.$emit(this.rejectEventTitle);
        this.reject();
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
        this.acceptFunction = params.accept || function () {};
        this.rejectFunction = params.reject || function () {};
        this.cardText = params.text || '';
        this.cardTitle = params.title || '';
        this.acceptEventTitle = params.acceptTitle || '';
        this.rejectEventTitle = params.rejectTitle || '';
        this.facilityData.facilityId = params.facilityId || -1;
        this.facilityData.facilityNumber = params.facilityNumber || -1;
        this.facilityData.facilityName = params.facilityName || '';
        this.facilityData.facilityType = params.facilityType || '';
        this.fullscreen = params.fullscreen || false;
        this.isUpdatePassword = params.isUpdatePassword || false;
        this.selectedReservation = params.selectedReservation || {};
        if (params.fullscreen) {
          this.transition = 'dialog-bottom-transition';
          this.overlay = false;
        } else {
          this.transition = 'dialog-transition';
          this.overlay = true;
        }
      });
    }
  };
</script>

