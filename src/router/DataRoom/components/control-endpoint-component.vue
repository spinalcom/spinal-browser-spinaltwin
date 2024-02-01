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
  <div class="div__content">
    <div class="name" v-tooltip="name">{{ name }}</div>

    <div class="value" v-tooltip="`${value} ${unit}`">
      {{ value | filterValue }} {{ unit }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'control-endpoint-component',
  props: { name: {}, endpoint: {} },
  data() {
    return {
      value: undefined,
      unit: undefined,
      bindProcess: undefined,
    };
  },
  mounted() {
    this.value = this.endpoint.currentValue;
    this.unit = this.endpoint.unit;
  },

  methods: {
    updateEndpoint() {
      if (this.endpoint) {
        this.bindProcess = this.endpoint.currentValue.bind(() => {
          this.value = this.endpoint.currentValue.get();
          this.unit = this.endpoint.unit.get();
        });
      }
    },
  },
  computed: {},

  filters: {
    filterValue(value) {
      if (typeof value == 'string' && value != '') {
        return value;
      } else if (typeof value !== 'undefined') {
        const isBoolean = typeof value === 'boolean';
        if (isBoolean) return value.toString().toUpperCase();
        if (value.toString().trim().length === 0) return 'NULL';
        return value.toFixed(2);
      } else return 'NULL';
    },
  },

  watch: {},
};
</script>

<style scoped>
.div__content {
  width: 30%;
  height: 100px;
  margin: 5px;
  padding: 5px;
  border: 1px solid grey;
  float: left;
}

.div__content:hover {
  cursor: pointer;
}

.div__content .name {
  width: 90%;
  height: 30px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  margin-left: 10px;
}

.div__content .value {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  font-size: 25px;
}

.div__rectangle {
  position: absolute;
  top: -6px;
  left: -6px;
  width: 10px;
  height: 100px;
}

.position_right {
  position: absolute;
  right: 0%;
}

.position_right3 {
  position: absolute;
  top: 30px;
  right: 0%;
}

.position_right2 {
  position: absolute;
  top: 60px;
  right: 0%;
}

.position_left {
  left: 0%;
}
.position_left2 {
  top: 30px;
  left: 0%;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.relative {
  position: relative;
}

.margin-left {
  margin-left: 45%;
}

.circled-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  border: white;
  z-index: 0;
}
.circled-button:hover {
  background-color: white;
}

.custom-icon {
  font-size: 20px;
}
</style>
