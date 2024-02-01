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
  <el-tabs class="tabsContainer" type="border-card">
    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="pane-ticket" label="Ticket Details">
      <TicketDetailss :nodeId="nodeId"></TicketDetailss>
    </el-tab-pane>
    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// DOCUMENTATION /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="spinal-space-tab-container" label="Documentation">
      <Documentation :nodeId="nodeId"></Documentation>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="spinal-space-tab-container tab-class" label="Notes">
      <Note :nodeId="nodeId"></Note>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Log /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Log"> <Log :nodeId="nodeId"></Log> </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
////////////////////////////////// Calendrier /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="spinal-space-tab-container" label="Calendrier">
      <Calendar :nodeId="nodeId"></Calendar>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { FileSystem } from "spinal-core-connectorjs_type";
import moment from "moment";
import Documentation from "./components_tickets/Documentation";
import TicketDetailss from "./components_tickets/TicketDetailss";
import Note from "./components_tickets/Note";
import Log from "./components_tickets/Log";
import Calendar from "./components_tickets/CalendarTicket";

export default {
  name: "TicketDetails",
  components: { Documentation, TicketDetailss, Note, Log, Calendar },
  props: ["nodeId"],

  data() {
    return {
      documents: [],
      log: [],
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      Note: [],
      calendrier: [],
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
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}

.barre {
  display: flex;
  justify-content: space-between;
}
</style>
