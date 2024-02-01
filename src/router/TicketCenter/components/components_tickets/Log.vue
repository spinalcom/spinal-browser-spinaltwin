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
  <el-container>
    <div class="view">
      <div class="btn-log">
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
      <div class="table">
        <el-table
          class="overflow-auto"
          id="style-scroll"
          :data="logs"
          border
          style="width: 100%; height: 780px"
          :header-cell-style="{ 'background-color': '#f0f2f5' }"
        >
          <el-table-column :label="$t(`Date`)" prop="date" align="center">
          </el-table-column>
          <el-table-column
            :label="$t(`UserName`)"
            prop="userName"
            align="center"
          >
          </el-table-column>
          <el-table-column :label="$t(`Event`)" prop="event" align="center">
          </el-table-column>
        </el-table> </div></div
  ></el-container>
</template>

<script>
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { FileSystem } from 'spinal-core-connectorjs_type';
import { serviceTicketPersonalized } from 'spinal-service-ticket';
import { LOGS_EVENTS } from 'spinal-service-ticket/dist/Constants';
import moment from 'moment';
import viewerBtn from './viewerBtn';

export default {
  name: 'Log',
  components: { viewerBtn },
  props: ['nodeId'],

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      logs: [],
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: FileSystem._objects[this.nodeId],
      };
    },
  },
  async mounted() {
    await this.getLogs();
    // this.formatEvent();
  },
  methods: {
    async formatEvent(log) {
      var texte = '';
      if (log.event == LOGS_EVENTS.creation) {
        texte = 'created';
      } else if (log.event == LOGS_EVENTS.archived) {
        texte = 'archived';
      } else if (log.event == LOGS_EVENTS.unarchive) {
        texte = 'unarchived';
      } else {
        const promises = log.steps.map((el) =>
          SpinalGraphService.getNodeAsync(el)
        );
        texte = await Promise.all(promises).then((result) => {
          const step1 = result[0].name.get();
          const step2 = result[1].name.get();
          const pre = log.event == LOGS_EVENTS.moveToNext ? true : false;
          return pre
            ? `Passed from ${step1} to ${step2}`
            : `Backward from ${step1} to ${step2}`;
        });
      }
      return texte;
    },
    async getLogs() {
      SpinalGraphService._addNode(this.nodeInfo.selectedNode);
      let logs = await serviceTicketPersonalized.getLogs(
        this.nodeInfo.selectedNode.getId().get()
      );
      let _tabs = [];
      for (const item of logs) {
        let infoLogs = {
          userName: item.user.name,
          date: moment(item.creationDate).fromNow(),
          event: await this.formatEvent(item),
        };
        _tabs.push(infoLogs);
      }
      this.logs = _tabs;
    },
  },

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
.view {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.table {
  width: 100%;
}

#style-scroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#style-scroll::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

#style-scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(201, 196, 196);
}
.btn-log {
  padding-bottom: 40px;
}
</style>
