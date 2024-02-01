<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="__container">
    <config-component
      v-for="item of colors"
      class="header-item"
      :config="item"
      :name="item.name"
      :hide-input="hideInput"
      :disabled="item.disabled"
      :style="{ 'z-index': 1 }"
      @updateAverage="updateAverage"
      @colorUpdated="sendEvent"
    />
  </div>
</template>

<script>
import ConfigComponent from './config-component.vue';

export default {
  name: 'ColorConfigComponent',
  components: { ConfigComponent },
  props: { variableSelected: {} },
  data() {
    return {
      colors: [],
      hideInput: false,
    };
  },
  watch: {
    variableSelected() {
      this.changeInput();
      this.colors = this.getColorList(this.variableSelected);
    },
  },
  mounted() {
    this.changeInput();
    this.colors = this.getColorList(this.variableSelected);
  },
  methods: {
    getColorList(variableSelected) {
      let res = [];
      switch (variableSelected.dataType) {
        case 'Enum':
          res = variableSelected.config.enumeration;
          break;
        case 'Boolean':
          variableSelected.config.min.name = 'False';
          variableSelected.config.max.name = 'True';
          res = [variableSelected.config.min, variableSelected.config.max];
          break;

        default:
          variableSelected.config.min.name = 'Min';
          variableSelected.config.average.name = 'Average';
          variableSelected.config.average.disabled = true;
          variableSelected.config.max.name = 'Max';
          res = [
            variableSelected.config.min,
            variableSelected.config.average,
            variableSelected.config.max,
          ];
          break;
      }

      return res;
    },

    updateAverage() {
      this.$emit('updateAverage');
    },

    sendEvent() {
      this.$emit('colorUpdated');
    },

    changeInput() {
      this.hideInput =
        ['Enum', 'Boolean'].indexOf(this.variableSelected.dataType) !== -1;
    },
  },
};
</script>

<style scoped>
.__container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.__container .header-item {
  flex: 1;
}
</style>
