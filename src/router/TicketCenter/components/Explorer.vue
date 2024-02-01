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
  <el-container>
    <div v-for="(item, idx) in items" :key="idx" style="width: 100%">
      <el-header>
        <div style="float: right">
          <el-button
            title="Export Table"
            icon="el-icon-download"
            circle
            @click.stop="exportToExcel(idx)"
          >
          </el-button>

          <!-- <el-button icon="el-icon-view" circle @click.stop="SeeAll(idx)">
          </el-button> -->

          <el-button
            title="Color Items "
            icon="el-icon-picture-outline-round"
            circle
            @click.stop="SeeAll(idx)"
          >
          </el-button>
          <el-button
            title="Isolate Items"
            icon="el-icon-aim"
            circle
            @click.stop="isolateAll(idx)"
          >
          </el-button>
        </div>
      </el-header>
      <el-main>
        <NodeTable
          v-if="ticketView"
          :ref="`Explorer-table`"
          :view-key="Properties.viewKey"
          :items="item.items"
          :columns="item.cols"
          @update="updateTicketSelected"
        >
        </NodeTable>
      </el-main>
    </div>

    <TicketDetails v-if="!ticketView" :nodeId="ticketSelected"> </TicketDetails>
  </el-container>
</template>

<script>
import { ViewManager } from '../../../services/ViewManager/ViewManager';
import BackEndTicket from '../backend/ticket';
import BackendInitializer from '../../../services/BackendInitializer';
import NodeTable from './NodeTable.vue';
import '../backend/EventHandler';
import TicketDetails from './TicketDetails';

export default {
  name: 'Explorer',
  components: { NodeTable, TicketDetails },
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function (value) {
        if (value.viewKey == '') {
          return 'danger';
        }
        return 'success';
      },
    },
  },
  data() {
    return {
      items: [],
      contextServId: 0,
      currentView: null,
      IsEquipement: false,
      ticketDetails: false,
      ticketView: true,
      ticketSelected: undefined,
    };
  },
  async mounted() {
    const backendInitializer = BackendInitializer.getInstance();
    const graph = await backendInitializer.getGraph();
    const backEndTicket = BackEndTicket.getInstance();
    await backEndTicket.init(graph);

    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    ViewManager.getInstance(this.Properties.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
  },
  watch: {
    items() {},
  },
  methods: {
    updateTicketSelected(ticketSelected) {
      this.ticketSelected = ticketSelected;
      this.ticketView = false;
    },

    async onViewChange(view) {
      this.ticketView = true;
      let mapItems;

      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await BackEndTicket.getInstance().getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await BackEndTicket.getInstance().getItems(
          view.serverId,
          this.contextServId
        );
      }
      this.items = [];
      for (const [nodeType, items] of mapItems) {
        const cols = new Set();
        for (const item of items) {
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes);
            }
          }
        }
        this.items.push({ nodeType, items, cols: Array.from(cols) });
      }
      this.currentView = view;
    },
    changeView(item) {
      ViewManager.getInstance(this.Properties.viewKey).push(
        item.name,
        item.serverId
      );
    },
    SeeAll(index) {
      this.$refs['Explorer-table'][index].SeeAll(this.currentView.serverId);
    },
    isolateAll(index) {
      this.$refs['Explorer-table'][index].isolateAll(this.currentView.serverId);
    },
    exportToExcel(index) {
      this.$refs['Explorer-table'][index].exportToExcel();
    },
  },
};
</script>
<style>
.tooltip::before {
  background-color: white;
  border: 1px solid #888;
  border-radius: 2px;
  color: #444;
  content: attr(data-title);
  display: none;
  font-family: sans-serif;
  font-size: 14px;
  padding: 2px 5px;
  position: absolute;
  top: 20px;
  left: 5px;
  z-index: 1;
}
.tooltip:hover::before {
  display: block;
}
</style>
