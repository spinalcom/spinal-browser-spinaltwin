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
  <div>
    <el-dialog
      append-to-body
      title="Space Management Configuration"
      :visible.sync="dialogGlobalConfigurationVisible"
      width="75%"
    >
      <div class="space-configuration-content">
        <NodeCardPicker
          class="space-configuration-subcontent"
          :title="contextsTitle"
          :nodeList.sync="contextList"
          @add="dialogAddContextVisible = true"
          @select="selectContext"
        >
        </NodeCardPicker>
        <NodeCardPicker
          class="space-configuration-subcontent"
          :title="categoriesTitle"
          :nodeList.sync="categoryList"
          @add="dialogAddCategoryVisible = true"
          @select="selectCategory"
        ></NodeCardPicker>
        <NodeCardPicker
          class="space-configuration-subcontent"
          :title="groupsTitle"
          :nodeList.sync="groupList"
          @add="dialogAddGroupVisible = true"
        ></NodeCardPicker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogGlobalConfigurationVisible = false"
          >Close</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      append-to-body
      title="Add a context"
      :visible.sync="dialogAddContextVisible"
      width="25%"
      height="25%"
    >
      <el-input
        v-model="newContextName"
        autosize
        placeholder="Name of the Category"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="">Cancel</el-button> -->
        <el-button type="primary" @click="addContext()">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog class="global-condiguration-dialog"
      append-to-body
      title="Add a Category"
      :visible.sync="dialogAddCategoryVisible"
      width="25%"
    >
    <div class="global-configuration-dialog-content">
      <el-input
        v-model="newCategory.name"
        autosize
        placeholder="Name of the Category"
      ></el-input>
      <el-select style="margin-top: 10px" v-model="newCategory.icon" placeholder="Select Icon" filterable>
        <el-option
          v-for="item in allIcons"
          :key="item.id"
          :label="item.id"
          :value="item.id"
          class="global-configration-icon-selection"
        >
          <i :class="item.id" />
          <span class="global-configuration-icon-name">{{ item.id }}</span>
        </el-option>
      </el-select>
      <div class="color-picker">
        <div>Color : </div>
      <el-color-picker class="element-color-picker" v-model="newCategory.color" >Pick a Color</el-color-picker>
      </div>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCategory()">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog class="global-condiguration-dialog"
      append-to-body
      title="Add a Group"
      :visible.sync="dialogAddGroupVisible"
      width="25%"
    >
    <div class="global-configuration-dialog-content">
      <el-input
        v-model="newGroup.name"
        autosize
        placeholder="Name of the Category"
      ></el-input>
      <el-select style="margin-top: 10px" v-model="newGroup.icon" placeholder="Select Icon" filterable>
        <el-option
          v-for="item in allIcons"
          :key="item.id"
          :label="item.id"
          :value="item.id"
          class="global-configration-icon-selection"
        >
          <i :class="item.id" />
          <span class="global-configuration-icon-name">{{ item.id }}</span>
        </el-option>
      </el-select>
      <div class="color-picker">
        <div>Color : </div>
      <el-color-picker class="element-color-picker" v-model="newGroup.color" >Pick a Color</el-color-picker>
      </div>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addGroup()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import * as allIcons from "../../../../../assets/icons/allIcons.json";
// imports
import NodeCardPicker from "./NodeCardPicker.vue";

export default {
  name: "GlobalConfiguration",
  props: {
    dialogGlobalConfigurationVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    contextList: { type: Array, required: true, default: [] },
    categoryList: { type: Array, required: true, default: [] },
    groupList: { type: Array, required: true, default: [] },
  },
  components: {
    NodeCardPicker,
  },

  data() {
    return {
      dialogAddContextVisible: false,
      dialogAddCategoryVisible: false,
      dialogAddGroupVisible: false,
      newContextName: "",
      categorySelected: undefined,
      contextSelected: undefined,
      newCategory: {
        name: "",
        icon: "",
        color: ""
      },
      newGroup: {
        name: "",
        icon: "",
        color: ""
      },
      contextsTitle: "Liste des contextes",
      categoriesTitle: "Liste des catégories",
      groupsTitle: "Liste des groupes",

      allIcons: allIcons,
    };
  },

  watch: {
    Properties: {},
  },

  async mounted() {},

  methods: {
    handleCloseDialog() {
    },
    handleCloseSubDialog(dialog) {
      // switch(str){
      //   case 'addContext':
      //     this.newContextName = "";
      //     break;
      //   default:
      //     break;
      // }
    },
    async addContext() {
      let context = await SpinalGraphService.addContext(
        this.newContextName,
        "geographicRoomGroupContext"
      );
      this.contextList.push(context);
      this.selectContext(context).then(this.newContextName = "");
      this.dialogAddContextVisible = false;
    },
    async selectContext(e) {
      this.contextSelected = e;
      let catList = await e.getChildrenInContext(e);
      ((catList.length !=0) ? this.categoryList = catList: this.categoryList = []);
      this.groupList = [];
    },
    async addCategory() {
      let nodeId = SpinalGraphService.createNode({
        name: this.newCategory.name,
        icon: this.newCategory.icon,
        color: this.newCategory.color,
        type: "groupingCategory"
      })
      let node = SpinalGraphService.getRealNode(nodeId);
      let category = await this.contextSelected.addChildInContext(node, "hasCategory", "PtrLst", this.contextSelected);
      this.categoryList.push(category);
      await this.selectCategory(category);
      this.dialogAddCategoryVisible = false;
      this.newCategory = {
        name: "",
        icon: "",
        color: ""
      };

    },
    async selectCategory(e) {
      this.categorySelected = e;
      this.groupList = await e.getChildrenInContext(this.contextSelected);
    },
    async addGroup() {
      let nodeId = SpinalGraphService.createNode({
        name: this.newGroup.name,
        type: "geographicRoomGroup",
        color: this.newGroup.color,
        icon: this.newGroup.icon
      });
      let node = SpinalGraphService.getRealNode(nodeId);
      let group = await this.categorySelected.addChildInContext(node, "hasGroup", "PtrLst", this.contextSelected);
      this.groupList.push(group);
      this.dialogAddGroupVisible = false;
      this.newGroup = {
        name: "",
        icon: "",
        color: ""
      };
    },
  },
};
</script>

<style scoped>
.space-configuration-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.space-configuration-subcontent {
  width: 33%;
  height: 50vh;
  border: 1px solid #14202c;
  border-radius: 10px;
}
.space-configuration-subcontent-item {
  width: 100%;
}
.global-configration-icon-selection {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.global-configuration-icon-name{
  margin-left: 10px;
}

.global-configuration-dialog-content{
  display: flex;
  flex-direction: column;

}
.color-picker{
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.element-color-picker{
  margin-left: 10px;
}
</style>
