<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <el-container class="container-class ">
    <div class="view">
      <div class="buttons">
        <div class="viewer-btn" :nodeId="nodeId">
          <div class="bouttons">
            <el-button
              title="Export Table"
              icon="el-icon-download"
              circle
              @click.stop="exportToExcel()"
            >
            </el-button>

            <el-button
              title="Color Items "
              icon="el-icon-picture-outline-round"
              circle
              @click.stop="SeeAll()"
            >
            </el-button>
            <el-button
              title="Isolate Items"
              icon="el-icon-aim"
              circle
              @click.stop="isoItem()"
            >
            </el-button>
          </div>
        </div>
      </div>
      <div class="note">
        <message-component :nodeInfo="nodeInfo"></message-component>
      </div>
    </div>
  </el-container>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { FileSystem } from "spinal-core-connectorjs_type";
import moment from "moment";
import messageComponent from "./messageComponent";
import viewerBtn from "./viewerBtn";

export default {
  name: "Note",
  components: { "message-component": messageComponent, viewerBtn },
  props: ["nodeId"],

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: FileSystem._objects[this.nodeId],
      };
    },
  },
  async mounted() {},
  methods: {},

  beforeDestroy() {},
};
</script>

<style scoped>
.tabsContainer {
  width: 100%;
  height: 100%;
}
.button-ajouter {
  display: inline-block;
}
.button-supprimer {
  display: inline-block;
}
.pane-ticket {
  position: relative;
  height: calc(100% - 20px);
}
.container-class,
.tab-class {
  height: 100%;
}
</style>

<style>
ul {
  list-style-type: none;
}
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}
.buttons {
  padding-bottom: 40px;
}
</style>
