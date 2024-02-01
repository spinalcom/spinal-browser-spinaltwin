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
  <el-table
    v-loading="loading"
    :data="data"
    border
    style="width: 100%"
    :header-cell-style="{ 'background-color': '#f0f2f5' }"
    @row-click="selectInView"
    @row-dblclick="SeeEvent"
  >
    <el-table-column :label="$t(`${explorerTab()}`)">
      <div slot-scope="scope">
        <div
          v-if="scope.row.color"
          class="spinal-table-cell-color"
          :style="getColor(scope.row.color)"
        ></div>
        <div>{{ scope.row.name }}</div>
      </div>
    </el-table-column>

    <el-table-column
      v-for="column in columns"
      :key="column"
      align="center"
      :label="$t(`${explorerDetailsTab()}`)"
    >
      <div slot-scope="scope">{{ columnValue(scope.row, column) }}</div>
    </el-table-column>

    <el-table-column
      align="center"
      :label="$t(`TicketNumber`)"
      v-if="
        haveChildren &&
          this.items[0].type !== 'SpinalSystemServiceTicketTypeStep'
      "
    >
      <div slot-scope="scope">{{ ticketNumber(scope.row) }}</div>
    </el-table-column>
    <!-- +++++++++++++++++++++++++++++++++++++ -->
    <el-table-column
      :label="$t(`User`)"
      align="center"
      v-if="this.items[0].type === 'SpinalSystemServiceTicketTypeTicket'"
    >
      <div slot-scope="scope">{{ UserTicket(scope.row) }}</div>
    </el-table-column>
    <!-- +++++++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++ -->
    <el-table-column
      :label="$t(`Date of Creation`)"
      align="center"
      v-if="this.items[0].type === 'SpinalSystemServiceTicketTypeTicket'"
    >
      <div slot-scope="scope">{{ CreationDate(scope.row) }}</div>
    </el-table-column>
    <!-- +++++++++++++++++++++++++++++++++++++ -->

    <el-table-column v-if="haveChildren" label="" width="65" align="center">
      <div slot-scope="scope">
        <el-button
          v-if="scope.row.haveChild"
          icon="el-icon-arrow-right"
          circle
          @click="onSelectItem(scope.row)"
        ></el-button>
      </div>
    </el-table-column>

    <el-table-column
      v-if="haveChildren === false"
      label=""
      width="65"
      align="center"
    >
      <div slot-scope="scope">
        <el-button
          title="Details Ticket"
          icon="el-icon-arrow-right"
          circle
          align="center"
          @click="detailsTicket(scope.row)"
        ></el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { ColorGenerator } from "../../../services/utlils/ColorGenerator";
import { EventBus } from "../backend/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
import { FileSystem } from "spinal-core-connectorjs_type";
import moment from "moment";
import TicketDetails from "./TicketDetails";

export default {
  name: "NodeTable",
  components: {},
  props: {
    viewKey: { required: true, type: String },
    items: { required: true, type: Array },
    columns: { required: true, type: Array },
  },
  data() {
    return {
      data: [],
      loading: true,
      haveChildren: false,
      ticketSelected: undefined,
    };
  },
  watch: {
    items: {
      handler () {
        this.update();
      },
      deep: true,
    }
  },
  mounted() {
    this.update();
  },
  methods: {
    selectInView(item) {
      EventBus.$emit("view-select-item", {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeEvent(item) {
      EventBus.$emit("view-isolate-item", {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeAll(zone) {
      let items = this.data.map((item) => {
        return { server_id: item.serverId, color: item.color };
      });

      EventBus.$emit("view-color-all", items, { server_id: zone });
    },
    ShowAll() {
      EventBus.$emit("view-show-all");
    },
    isolateAll(zone) {
      EventBus.$emit("view-isolate-all", { server_id: zone });
    },
    onSelectItem(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
    },
    detailsTicket(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
      this.ticketSelected = item.serverId;
      this.$emit("update", this.ticketSelected);
    },
    explorerDetailsTab() {
      for (const column of this.columns) {
        if (column && column === "SpinalServiceTicketProcess")
          return "Processes";
        else if (column && column === "SpinalSystemServiceTicketTypeStep")
          return "Steps";
        else if (column && column === "SpinalSystemServiceTicketTypeTicket")
          return "Tickets";
      }
    },
    explorerTab() {
      for (const item of this.items) {
        if (item.type === "SpinalSystemServiceTicket") return "Workflow";
        else if (item.type === "SpinalServiceTicketProcess") return "Processes";
        else if (item.type === "SpinalSystemServiceTicketTypeStep")
          return "Steps";
        else if (item.type === "SpinalSystemServiceTicketTypeTicket")
          return "Tickets";
      }
    },
    update() {
      this.loading = true;
      const res = [];
      const colorUsed = [];
      let haveChild = false;

      for (const item of this.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
        };
        if (resItem.color) colorUsed.push(resItem.color);
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
            haveChild = true;
          }
        }
        res.push(resItem);
      }
      this.data = res;
      this.updateColor(this.data, colorUsed);
      this.haveChildren = haveChild;
      this.loading = false;
    },
    updateColor(res, colorUsed) {
      if (colorUsed.length !== this.items.length) {
        const colorGen = new ColorGenerator(this.items.length, colorUsed);
        for (const itm of res) {
          if (itm.color) continue;
          const color = colorGen.getColor();
          this.setColorItem(itm.serverId, color);
          Object.assign(itm, { color });
        }
      }
    },
    setColorItem(serverId, color) {
      for (const item of this.items) {
        if (item.serverId === serverId) {
          return item.setColor(color);
        }
      }
    },
    getColor(color) {
      return { backgroundColor: color[0] === "#" ? color : `#${color}` };
    },
    columnValue(item, key) {
      if (item[key]) return item[key];
      return 0;
    },
    ticketNumber(item) {
      for (const _item of this.items) {
        if (_item.name === item.name) {
          return _item.allTickets;
        }
      }
    },
    CreationDate(item) {
      for (const _item of this.items) {
        if (_item.serverId === item.serverId) {
          var realNode = FileSystem._objects[item.serverId];
          if (
            realNode.getType().get() === "SpinalSystemServiceTicketTypeTicket"
          ) {
            return moment(realNode.info.creationDate.get()).fromNow();
          }
        }
      }
    },
    UserTicket(item) {
      for (const _item of this.items) {
        if (_item.serverId === item.serverId) {
          var realNode = FileSystem._objects[item.serverId];
          if (
            realNode.getType().get() === "SpinalSystemServiceTicketTypeTicket"
          ) {
            return realNode.info.user.name;
          }
        }
      }
    },
    exportToExcel() {
      let headers = [
        {
          key: "name",
          header: this.$t("name"),
          width: 20,
        },
      ];
      for (const column of this.columns) {
        headers.push({
          key: column,
          header: this.$t(column),
          width: 10,
        });
      }
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: this.data,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    },
  },
};
</script>

<style scoped>
.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
