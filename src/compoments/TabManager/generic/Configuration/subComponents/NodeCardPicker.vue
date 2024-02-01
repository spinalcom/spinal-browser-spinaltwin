<!--
Copyright 2020 SpinalCom - www.spinalcom.com

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
  <!-- <div>
    <el-card class="node-card-picker" shadow="never">
      <template #header>
        <div class="node-card-picker-header">
          <span>{{ title }}</span>
          <el-button
            @click.native="add()"
            icon="el-icon-plus"
            circle
            class="el-button-add"
          ></el-button>
        </div>
      </template>
      <div
        class="node-card-picker-content"
        v-for="node in nodeList"
        :key="node"
      >
        <span @click="select(node)">{{ node.getName().get() }}</span>
        <div class="node-card-picker-content-buttons">
          <el-button icon="el-icon-edit" size="small" circle />
          <el-button icon="el-icon-delete" class="el-button-delete" size="small" circle />
        </div>
      </div>
    </el-card>
  </div> -->
  <div>
    <div class="node-card-picker">
      <div class="node-card-picker-header">
        <div class="node-card-picker-title">{{title}}</div>
        <el-button
            @click.native="add()"
            icon="el-icon-plus"
            circle
            class="el-button-add"
          ></el-button>
      </div>
      <el-divider></el-divider>
      <div
        class="node-card-picker-content"
        v-for="node in nodeList"
        :key="node"
      >
        <span @click="select(node)">{{ node.getName().get() }}</span>
        <div class="node-card-picker-content-buttons">
          <!-- <el-button icon="el-icon-edit" size="small" circle />
          <el-button icon="el-icon-delete" class="el-button-delete" size="small" circle /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// imports

export default {
  name: "NodeCardPicker",
  props: {
    title: { type: String, required: false },
    // addDialog: {type: Boolean, required: false, default: false},
    editDialog: { type: Boolean, required: false },
    deleteDialog: { type: Boolean, required: false },
    nodeList: { type: Array, required: false },
  },
  components: {},

  data() {
    return {
      currentNode: undefined,
    };
  },

  watch: {
  },

  async mounted() {},

  methods: {
    handleCurrentChange(val) {
      this.currentNode = val;
    },
    add() {
      this.$emit("add");
    },
    edit() {
      this.$emit("edit");
    },
    remove() {
      this.$emit("remove");
    },
    select(node) {
      this.$emit("select", node);
    },
  },
};
</script>

<style scoped>
.node-card-picker {
  background-color: transparent;
  border-color: transparent;
  color: #58727e;
    letter-spacing: 1px;
    font-size: 16px;
    font-weight: 200;
}
.node-card-picker-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px;
  /* color: #58727e;
    letter-spacing: 1px;
    font-size: 16px;
    font-weight: 200; */
}
.node-card-picker-content {
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
  margin-left: 10px;
}

.node-card-picker-content-buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
