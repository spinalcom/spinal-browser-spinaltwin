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
  <div class="_content">
    <input
      v-if="
        this.dataType == 'Float' ||
        this.dataType == 'Long' ||
        this.dataType == 'Double' ||
        this.dataType == 'Real'
      "
      type="range"
      :min="min"
      :max="max"
      class="slider"
      step="0.1"
      id="myRange"
      v-model="value"
    />
    <input
      v-if="IntegerType()"
      type="range"
      :min="min"
      :max="max"
      class="slider"
      v-model="value"
    />
    <select v-if="EnumType()" v-model="value">
      <option v-for="item in this.config.enumeration" :key="item.name">
        {{ item.name }}
      </option>
    </select>

    <p class="value" align="center"> {{ $t('Value') }} : {{ value }}</p>

    <el-button v-on:click="validate()" class="_button"> OK </el-button>
  </div>
</template>

<script>
export default {
  name: 'value-config',
  props: { endpoint: {}, config: {}, dataType: {} },

  data() {
    return {
      value: undefined,
      min: undefined,
      max: undefined,
    };
  },

  mounted() {
    if (this.FloatType() || this.IntegerType()) {
      this.value = this.endpoint.currentValue.get().toFixed(2);
      this.min = this.config.min.value;
      this.max = this.config.max.value;
    }
  },
  computed: {},

  methods: {
    validate() {
      this.$parent.endpoint.currentValue.set(this.value);
      this.$parent.isConfigModalVisible = false;
    },
    FloatType() {
      return (
        this.dataType == 'Float' ||
        this.dataType == 'Double' ||
        this.dataType == 'Real'
      );
    },
    IntegerType() {
      return (
        this.dataType == 'Unsigned' ||
        this.dataType == 'Unsigned8' ||
        this.dataType == 'Unsigned16' ||
        this.dataType == 'Unsigned32' ||
        this.dataType == 'Integer' ||
        this.dataType == 'Integer16' ||
        this.dataType == 'Long'
      );
    },
    EnumType() {
      return this.dataType == 'Enum';
    },
  },
};
</script>

<style scoped>
._content {
  position: relative;
  border: 1px solid black;
  /* width: 100%; */
  width: 300px;
  height: 100px;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
  z-index: 2;
  top: 25%;
}

._button {
  justify-content: center;
  display: inline-block;
  margin-left: 20px;
  height: 30px;
  width: 40px;
  padding: 10px;
}

.value {
  width: 100%;
}
.circled-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  border: white;
}
.circled-button:hover {
  background-color: white;
}

.custom-icon {
  font-size: 20px;
}
</style>
