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
    <el-button v-on:click="openConfiguration()" circle icon="el-icon-setting">
    </el-button>

    <GlobalConfiguration
    :dialogGlobalConfigurationVisible="dialogGlobalConfigurationVisible"
    :contextList="contextList"
    :categoryList="categoryList"
    :groupList="groupList"></GlobalConfiguration>

    <SpaceAssignation class="space-configuration-space-assignation"
    v-if="spaceAssignation == true"
    :ctxNode="ctxNode"
    @close="spaceAssignation = false"
    ></SpaceAssignation>
  </div>
</template>

<script>
// imports
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { EventBus } from "../../../../services/event";
import GlobalConfiguration from "./subComponents/GlobalConfiguration.vue"
import SpaceAssignation from "./subComponents/SpaceAssignation.vue"

export default {
  name: "SpaceConfiguration",
  props: {
    Properties: {
      type: Object,
      required: true,
      default: undefined,
      validator: function (value) {
        if (!value.viewKey instanceof String) {
          return false;
        }
        return true;
      },
    },
  },
  components: {
    GlobalConfiguration,
    SpaceAssignation
  },

  data() {
    return {
      ctxNode: false,
      // context: false,
      dialogSpaceManagementVisible: false,
      dialogGlobalConfigurationVisible: false,
      // arborescence: [],
      contextSelected: {},
      contextList: [],
      categoryList: [],
      groupList: [],
      spaceAssignation: false
      
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    const promise = new Promise((res, rej) => {
      this.ctxNode = false;
      res();
    });
    promise.then(async () => {
      await this.update(this.Properties.view.serverId);
    });
    EventBus.$on("click-on_spinal-twin.SpaceConfiguration", async () => {
      await this.update(this.Properties.view.serverId);
    });
    // EventBus.$on("insight-breadcrumb-click", async serverId => {
    //   await this.update(serverId);
    // });
    // EventBus.$on("click-on_spinal-twin.ControlEndpoints", async () => {
    //   await this.update(this.ctxNode._server_id);
    // });
  },

  methods: {
    async update(id) {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];
      if (FileSystem._objects[id] == undefined) {
      }
    },
    openConfiguration() {
      // this.dialogSpaceManagementVisible = true;

      if (this.ctxNode == undefined) {
        let contexts = SpinalGraphService.getContextWithType(
          "geographicRoomGroupContext"
        );
        this.contextList = contexts;
        this.dialogGlobalConfigurationVisible = true;
        this.spaceAssignation = false;
      }
      else{
        this.dialogGlobalConfigurationVisible = false;
        this.spaceAssignation = true;
      }
    },
    handleCloseDialog() {},
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
  border: 1px solid #14202c;
  border-radius: 10px;
}
.space-configuration-subcontent-item {
  width: 100%;
}
.space-configuration-space-assignation{
  max-height: 700px;
  overflow: scroll;
}
</style>
