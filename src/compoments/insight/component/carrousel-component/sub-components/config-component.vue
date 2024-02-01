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
  <div class="config">
    <div class="config_cont">
      <div class="name">{{ /*getName()*/ $t(getName()) }}</div>
      <!--  -->
      <el-input-number
        class="input"
        size="mini"
        v-if="!hideInput"
        :disabled="disabled"
        v-model="config.value"
        @change="handleChange"
        :min="0"
      ></el-input-number>

      <div class="color">
        <div
          class="current-color"
          :style="'background-color: ' + color"
          @click="togglePicker"
        ></div>
        <sketch-picker
          class="colorSelect"
          v-model="color"
          v-if="display"
          @input="updateColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Chrome, Sketch } from 'vue-color';

export default {
  name: 'configComponent',
  components: { 'chrome-picker': Chrome, 'sketch-picker': Sketch },
  props: { config: {}, name: {}, disabled: {}, hideInput: {} },
  data() {
    return {
      display: false,
      color: '',
    };
  },
  mounted() {
    this.color = this.config.color;
  },
  methods: {
    handleChange() {
      this.$emit('updateAverage');
    },

    togglePicker() {
      this.display = !this.display;
      if (this.color !== this.config.color) {
        this.config.color = this.color;
        this.$emit('colorUpdated');
      }
    },

    updateColor(val) {
      this.color = val.hex;
    },

    isBool() {
      return typeof this.config.value === 'boolean';
    },

    getName() {
      if (this.isBool()) return this.config.value ? 'True' : 'False';
      return this.name;
    },
  },
  watch: {
    config() {
      this.color = this.config.color;
    },
  },
};
</script>

<style>
.config {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.config .config_cont {
  width: 80%;
  /* border: 1px solid red; */
}

.config .config_cont .input {
  width: 100%;
  display: flex;
}

.config .config_cont .color {
  width: 100%;
  height: 25px;
  margin-top: 5px;
  margin-bottom: 5px;
  /* background-color: seagreen; */
}

.config .config_cont .color .current-color {
  width: 100%;
  height: 80%;
}

.config .config_cont .color .current-color:hover {
  cursor: pointer;
}

.config .config_cont .color .colorSelect {
  width: 100%;
}
</style>
