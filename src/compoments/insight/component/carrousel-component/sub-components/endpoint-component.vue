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
  <div class="data-list">
    <v-list-item class="data-table-item">
      <v-list-item-content>
        <v-list-item-title>
          <div
            v-if="this.endpoint"
            class="div__rectangle"
            :style="{
              'background-color': getColor(
                this.endpoint.currentValue.get(),
                this.variableSelected.config
              ),
            }"
          ></div>
          <div class="value" v-tooltip="`${value} ${unit}`">
            <!-- {{ value | filterValue }} {{ unit }} -->
            {{ value | filterValue }}
          </div>
          <div class="unit" v-tooltip="`${unit}`">{{ unit }}</div>
          <div class="name" v-tooltip="name" v-on:mouseover="select()">
            {{ name }}
          </div>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-action class="data-table-item-btn-container">
        <!-- <v-fade-transition group> -->
        <!-- <template> -->
        <!-- <template v-if="hover"> -->
        <!-- <v-btn
              v-for="menu in menuItems"
              :key="menu.eventName"
              v-once
              v-tooltip="menu.tooltip"
              icon
              @click="callEvent(menu.eventName)"
            >
              <v-icon>{{ menu.icon }}</v-icon>
            </v-btn> -->
        <el-tooltip :content="$t('spinal-twin.open-in-dataroom')">
          <el-button
            @click="openInDataRoom(room.id)"
            class="spl-el-button"
            icon="el-icon-arrow-right"
            size="small"
            circle
          ></el-button>
        </el-tooltip>

        <!-- <el-tooltip
          content="Focus"
          effect="light"
          :open-delay="300"
          placement="right"
        > -->
        <el-tooltip content="Focus">
          <el-button
            v-on:click="focus()"
            class="custom-icon circled-button position_right"
            circle
            icon="el-icon-zoom-in"
          ></el-button>
        </el-tooltip>
        <!-- <el-tooltip
          content="Select"
          effect="light"
          :open-delay="300"
          placement="right"
        >
          <el-button
            v-on:click="select()"
            class="custom-icon circled-button position_right2"
            circle
            icon="el-icon-view"
          ></el-button>
        </el-tooltip> -->
        <el-tooltip :content="$t('spinal-twin.insight-center.see-historic')">
          <el-button
            v-on:click="openChartModal()"
            :disabled="variableSelected.saveTimeSeries === 0"
            class="dashboard-btn custom-icon circled-button"
            :class="{
              'dashboard-btn-disabled': variableSelected.saveTimeSeries === 0,
              'dashboard-btn-on': isDataMode,
              'dashboard-btn-off': !isDataMode,
            }"
            circle
            icon="el-icon-menu"
          >
          </el-button>
        </el-tooltip>

        <!-- <el-button
            v-if="displayBoolButton"
            v-on:click="flip()"
            class="config-btn-position custom-icon circled-button"
            circle
            icon="el-icon-refresh"
          >
          </el-button> -->

        <el-tooltip :content="$t('spinal-twin.insight-center.change-value')">
          <el-button
            v-if="variableSelected.command == 1"
            v-on:click="openConfigModal()"
            class="config-btn-position custom-icon circled-button"
            circle
            icon="el-icon-setting"
          >
          </el-button>
        </el-tooltip>
        <el-tooltip :content="$t('spinal-twin.insight-center.download')">
          <el-button
            v-on:click="downloadTimeSeries()"
            :disabled="variableSelected.saveTimeSeries === 0"
            class="dashboard-btn custom-icon circled-button"
            circle
            icon="el-icon-download"
          >
          </el-button>
        </el-tooltip>

        <!-- </template>
        </v-fade-transition> -->

        <!-- <v-btn
          v-if="item.type !== 'BIMObject'"
          icon
          @click.stop="$emit('onOpen', item)"
        >
          <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
        </v-btn> -->
      </v-list-item-action>
    </v-list-item>
    <value-config
      v-if="isConfigModalVisible"
      :endpoint="this.endpoint"
      :config="this.variableSelected.config"
      :dataType="this.variableSelected.dataType"
    >
    </value-config>
  </div>
  <!-- </v-hover> -->
</template>

<script>
import { spinalBackEnd } from "../../../../../services/spinalBackend";
const backendService = spinalBackEnd.heatmapBack;
import valueConfig from "./value-config";
import { EventBus } from "../../../../../services/event";
import groupManagerUtilities from "spinal-env-viewer-room-manager/js/utilities";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { NetworkService } from "spinal-model-bmsnetwork";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
import {
  GEO_BUILDING_TYPE,
  GEO_RELATIONS,
  GEO_ROOM_TYPE,
  GEO_FLOOR_TYPE,
} from "../../../../../constants";
import { viewerUtils } from "../../../../../services/viewerUtils/viewerUtils";
// viewerUtils.fitToView(items);

export default {
  components: { valueConfig },
  name: "endpoint-component",
  props: { name: {}, endpoints: {}, variableSelected: {}, room: {} },
  data() {
    return {
      hover: true,
      value: undefined,
      unit: undefined,
      bindProcess: undefined,
      endpoint: undefined,
      displayBoolButton: undefined,
      isConfigModalVisible: false,
      isInsightIsolate: false,
      selectedNode: undefined,
      isDataMode: false,
    };
  },
  async mounted() {
    this.updateEndpoint();
    this.updateDisplay();
    this.selectedNode = await this.getEndpoint();
    // EventBus.$on('InsightCenter-display-sprites', async () => {
    // })
    EventBus.$on("sprite-clicked", (res) => {
      if (res != undefined && this.endpoint != undefined) {
        if (res.id == this.room.id) {
          let element = this.$el.getElementsByClassName("data-table-item");
          element[0].style.borderColor = "#00A2FF";
          element[0].style.backgroundColor = "#BCE1FF";
          element[0].scrollIntoView({ behavior: "smooth", block: "center" });
          // EventBus.$emit("InsightCenter-scroll-to-endpoint", this);
        } else {
          let element = this.$el.getElementsByClassName("data-table-item");
          element[0].style.borderColor = "";
          element[0].style.backgroundColor = "";
        }
      }
    });

    EventBus.$on('Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT', async (e) => {
      let res = e.selections[0];
      if (res != undefined && this.endpoint != undefined) {
        if(res.dbIdArray[0] != undefined){
          for(let ref of this.room.references){
            if(ref.ids.includes(res.dbIdArray[0]) && ref.model == res.model){
              let element = this.$el.getElementsByClassName("data-table-item");
              element[0].style.borderColor = "#00A2FF";
              element[0].style.backgroundColor = "#BCE1FF";
              element[0].scrollIntoView({ behavior: "smooth", block: "center" });
            }
            else{
              let element = this.$el.getElementsByClassName("data-table-item");
              element[0].style.borderColor = "";
              element[0].style.backgroundColor = "";
            }
          }

        }
        
      }
  });
  },

  methods: {
    async openInDataRoom(id) {
      let node = SpinalGraphService.getRealNode(id);
      SpinalGraphService._addNode(node);
      let path = await this.getPath(node, []);
      EventBus.$emit("switch-to-dataroom", path);
    },
    async getPath(node, path) {
      let tab = [{ name: node.getName().get(), serverId: node._server_id }];
      let temp = tab.concat(path);
      let parentNode = (await node.getParents(GEO_RELATIONS)).filter((parent) =>
        [
          "geographicContext",
          GEO_BUILDING_TYPE,
          GEO_FLOOR_TYPE,
          GEO_ROOM_TYPE,
        ].includes(parent.getType().get())
      );
      if (parentNode.length != 0) {
        // let temp = path.concat({name: parentNode[0].getName().get(), serverId: parentNode[0]._server_id}, path)
        return await this.getPath(parentNode[0], temp);
      } else return temp;
    },
    updateEndpoint() {
      this.endpoint = this.endpoints.find(
        (el) => el.id.get() == this.variableSelected.id
      );
      if (this.endpoint) {
        this.bindProcess = this.endpoint.currentValue.bind(() => {
          this.value = this.endpoint.currentValue.get();
          this.unit = this.endpoint.unit.get();
          if (isNaN(this.value)) this.unit = "";
          // let text = {
          //         type: typeof endpoint[0].currentValue.get(),
          //         value: typeof endpoint[0].currentValue.get() == "number"
          //         ? parseFloat(
          //             endpoint[0].currentValue.get().toFixed(1)
          //           ).toString() +
          //           " " +
          //           endpoint[0].unit.get()
          //         : endpoint[0].currentValue.get()
          //       };
          EventBus.$emit("update-sprite", {
            text:{
              type: typeof this.value,
              value: typeof this.value == "number"
                ? parseFloat(this.value).toFixed(1).toString() + " " + this.unit
                : this.value
            },
            color: this.getColor(this.value, this.variableSelected.config),
            node: this.room,
          });
        });
      }
    },

    updateDisplay() {
      if (
        this.variableSelected.type == "Consigne" &&
        this.variableSelected.dataType == "Boolean"
      ) {
        this.displayBoolButton = true;
      } else this.displayBoolButton = false;
    },

    flip() {
      this.endpoint.currentValue.set(!this.endpoint.currentValue.get());
    },

    getColor(endpointValue, config) {
      if (config.enumeration) {
        return backendService.getEnumColor(endpointValue, config.enumeration);
      }
      let gradient = backendService.getGradientColor(
        config.min,
        config.average,
        config.max
      );

      let color = backendService.getColor(
        endpointValue,
        config.min.value,
        config.max.value,
        gradient
      );

      let colorHex = `#${color}`;

      return colorHex;
    },

    backgroundColor() {
      if (this.endpoint == undefined) {
        return "#c9b9b9";
      }
      return "#ffffff";
    },

    //useless now ? not sure
    async getEndpoint() {
      if (this.endpoint != undefined) {
        let allControlPoints = await SpinalGraphService.getChildren(
          this.room.id,
          ["hasControlPoints"]
        );
        for (let controlPoint of allControlPoints) {
          let allBmsEndpoints = await SpinalGraphService.getChildren(
            controlPoint.id.get(),
            ["hasBmsEndpoint"]
          );
          let test = allBmsEndpoints.filter((elt) => {
            return elt.name.get() == this.endpoint.name.get();
          });
          if (test.length != 0) {
            test = test[0];
            return SpinalGraphService.getInfo(test.id.get());
          }
        }
      }
    },
    // useless now
    async printError() {
      let allControlPoints = await SpinalGraphService.getChildren(
        this.room.id,
        ["hasControlPoints"]
      );
      for (let controlPoint of allControlPoints) {
        let allBmsEndpoints = await SpinalGraphService.getChildren(
          controlPoint.id.get(),
          ["hasBmsEndpoint"]
        );
        let test = allBmsEndpoints.filter(
          (elt) => elt.name.get() == this.endpoint.name.get()
        );
        if (test.length != 0) {
          test = test[0];
        }
      }
    },

    async $() {
      let data = { rooms: [this.room] };
      const allBimObjects = await this.getAllBimObjects(data);
      EventBus.$emit("insight-$", {
        id: data.id,
        ids: allBimObjects,
      });
    },
    // async select() {
    //   let data = { rooms: [this.room] };
    //   const allBimObjects = await this.getAllBimObjects(data);
    //   this.$emit("select", {
    //     id: this.room.id,
    //     ids: allBimObjects,
    //   });
    // },
    async select() {
      let a = SpinalGraphService.getRealNode(this.room.id);
      const item = { id: this.room.id, server_id: a._server_id };
      this.$emit("select", item);
    },
    async isolate() {
      let data = { rooms: [this.room] };
      const allBimObjects = await this.getAllBimObjects(data);
      this.$emit("isolate", {
        id: this.room.id,
        ids: allBimObjects,
      });
    },

    async getAllBimObjects(data) {
      // const allBimObjects = await groupManagerUtilities.getBimObjects(id);
      const promises = data.rooms.map((el) =>
        groupManagerUtilities.getBimObjects(el.id)
      );

      const allBimObjects = await Promise.all(promises).then((result) => {
        result = result.flat(10);
        return result;
      });

      return allBimObjects.map((el) => el.get());
    },
    async focus() {
      // let a = await SpinalGraphService.getRealNode(this.room.id);
      // const item = { id: this.room.id, server_id: a._server_id };
      // EventBus.$emit("sidebar-selected-item", item);
      let items = this.room.references.map(el => {
        return {
          model:el.model,
          selection:el.ids
        };
      });
      viewerUtils.fitToView(items);
    },

    async isolate() {
      let data = { rooms: [this.room] };
      const allBimObjects = await this.getAllBimObjects(data);
      this.$emit("isolate", {
        id: this.room.id,
        ids: allBimObjects,
      });
    },

    async getAllBimObjects(data) {
      // const allBimObjects = await groupManagerUtilities.getBimObjects(id);
      const promises = data.rooms.map((el) =>
        groupManagerUtilities.getBimObjects(el.id)
      );

      const allBimObjects = await Promise.all(promises).then((result) => {
        result = result.flat(10);
        return result;
      });

      return allBimObjects.map((el) => el.get());
    },

    openChartModal() {
      let data = this.selectedNode;
      data.objectName = this.name;
      data.unit = this.unit;
      EventBus.$emit("data-mode", data);
      this.isDataMode = !this.isDataMode;
    },

    openConfigModal() {
      this.isConfigModalVisible = !this.isConfigModalVisible;
    },
    async downloadTimeSeries() {
      let netWorkService = new NetworkService();
      let tsNode = await netWorkService.getTimeseries(
        this.selectedNode.id.get()
      );
      let tsValues = await tsNode.getFromIntervalTime();
      let headers = [
        {
          key: "date",
          header: "date",
          width: 20,
        },
        {
          key: "value",
          header: "value",
          width: 20,
        },
      ];
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: tsValues,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(
          new Blob(reponse),
          this.selectedNode.name.get() + `.xlsx`
        );
      });
    },
  },

  filters: {
    filterValue(value) {
      if (typeof value == "string" && value != "") {
        return value;
      } else if (typeof value !== "undefined") {
        const isBoolean = typeof value === "boolean";
        if (isBoolean) return value.toString().toUpperCase();
        if (value.toString().trim().length === 0) return "NULL";
        return value.toFixed(2);
      } else return "NULL";
    },
  },

  watch: {
    async variableSelected() {
      if (this.endpoint && this.bindProcess) {
        this.isConfigModalVisible = false;
        this.endpoint.currentValue.unbind(this.bindProcess);
      }
      this.updateEndpoint();
      this.updateDisplay();
      this.selectedNode = await this.getEndpoint();
    },
  },

  beforeDestroy() {
    if (this.endpoint && this.bindProcess) this.endpoint.currentValue.unbind(this.bindProcess);
    // EventBus.$off('Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT');
  },
};
</script>

<style scoped>
/* .div__content {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  align-items: center;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
} */
.data-table-item {
  margin-left: 5px;
  margin-right: 5px;
}
.relative {
  min-height: inherit;
}
.div__rectangle {
  width: 10px;
  min-width: 10px;
  height: 30px;
  min-height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  /* min-height: inherit; */
}
/* .stat-card {
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */
.data-table-item-btn-container {
  flex-direction: row;
  display: flex;
  opacity: 0;
  /* transition: opacity 0.5s linear, left 0.2s linear; */
  transition: opacity 0.5s linear;
  overflow: hidden;
  position: relative;
  left: 0px;
  width: 0;
  min-width: 1px;
  margin-left: 0;
}

.data-table-item:hover .data-table-item-btn-container {
  width: fit-content;
  opacity: 1;
  position: relative;
  /* left: 20px; */
  /* margin-left: 20px; */
  margin-right: 20px;
  /* max-width: 20%; */
}

.v-list-item__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
}
/* .data-table-item{
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */

.data-table-item {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  /* justify-content: flex-start; */
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
  margin-top: 4px;
  width: 100%;
}
/* .v-list-item-content{
  max-width:75%;
} */
.v-list-item__content {
  max-width: 65%;
}
.value {
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 20px;
}
.unit {
  margin-left: 2px;
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 10px;
}
.name {
  color: #949da6;
  letter-spacing: 1.1px;
  margin-left: 6px;
}
.data-list {
  width: 100%;
  margin-right: 5px;
}

/* .div__content {
  width: 30%;
  height: 100px;
  margin: 5px;
  padding: 5px;
  border: 1px solid grey;
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
  margin-left: 25%;
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

.config-btn-position {
  position: absolute;
  left: 40%;
}

.dashboard-btn {
  position: absolute;
  left: 5%;
}

.dashboard-btn:focus {
  display: none;
}

.dashboard-btn-on {
  color: rgb(255, 174, 0);
}
.dashboard-btn-off {
  color: rgb(0, 0, 0);
}
.dashboard-btn-on:hover {
  color: rgb(255, 174, 0);
}
.dashboard-btn-off:hover {
  color: rgb(0, 0, 0);
}
.dashboard-btn-disabled {
  color: rgba(97, 97, 97, 0.483);
}
.custom-icon {
  font-size: 20px;
} */
</style>
