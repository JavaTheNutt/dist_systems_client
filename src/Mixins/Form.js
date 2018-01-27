export default {
  methods: {
    clearFormData () {
      return new Promise(resolve => {
        Object.assign(this.$data, this.$options.data.call(this));
        this.$nextTick().then(() => resolve());
      });
    },
    resetForm () {
      return new Promise(resolve => {
        this.clearFormData().then(() => {
          this.$nextTick().then(() => {
            this.$validator.reset();
            this.errors.clear();
            resolve();
          });
        });
      });
    }
  }
};

