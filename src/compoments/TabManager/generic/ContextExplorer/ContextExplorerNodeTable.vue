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

<!-- 950 : 100 + 66 * data.length
    :height="`${data.length > 15 ? 100 : 100 * data.length}%`"
-->
<template>
  <!-- <div style="height: 100%"> -->
  <div>
    <!-- <el-table
      v-loading="loading"
      :data="data"
      :header-cell-style="{ 'background-color': '#f0f2f5' }"
      @row-click="selectInView"
      @row-dblclick="SeeEvent"
      border
      height="70vh"
      show-summary
      sum-text="Total"
    > -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      highlight-current-row
      row-class-name="context-node-explorer-table-row"
      :header-row-style="{
        'background-color': '#ffffff',
        'text-align': 'left',
        'letter-spacing': '1px',
        color: '#214353',
        opacity: '1',
        height: 'fit-content',
      }"
      :row-style="{
        background: '#ffffff 0% 0% no-repeat padding-box',
        border: '1px solid green',
        'border-radius': '5px',
        opacity: '1',
        'text-align': 'left',
        'letter-spacing': '0.9px',
        color: '#214353',
        opacity: '1',
      }"
      @row-click="selectInView"
      @current-change="handleCurrentChange"
      @row-dblclick="zoom"
      height="100%"
      max-height="70vh"
    >
      <el-table-column :label="$t('explorer.Name')">
        <div slot-scope="scope">
          <!-- <div
            v-if="scope.row.color && isColored"
            :style="getColor(scope.row.color)"
            class="spinal-table-cell-color"
          ></div> -->
          <div
            v-if="scope.row.color && isColored"
            :style="getColor(scope.row.color)"
            class="div__rectangle"
          ></div>
          <!-- <div
          v-if="scope.row.color && isColored"
          class="div__rectangle"
          :style="{
            'background-color': getColor(scope.row.color),
          }"
        ></div> -->

          <div>
            {{ scope.row.name }}
          </div>
        </div>
      </el-table-column>

      <el-table-column
        v-for="column of columns"
        :key="column"
        :prop="column"
        :label="$t(`spinal-twin.${column}`)"
        align="center"
      >
        <div slot-scope="scope">
          {{ columnValue(scope.row, column) }}
        </div>
      </el-table-column>

      <el-table-column label="" width="65" align="center" key="isGroup">
        <div slot-scope="scope">
          <el-tooltip :content="$t('spinal-twin.Inspect')">
            <el-button
              @click="onSelectItem(scope.row, $event)"
              :icon="handleIcon(scope.row)"
              circle
            ></el-button>
          </el-tooltip>
          <!-- <el-tooltip
            v-if="scope.row.haveChild"
            :content="$t('spinal-twin.NextNode')"
          >
            <el-button
              @click="onSelectItem(scope.row)"
              icon="el-icon-arrow-right"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip v-else :content="$t('spinal-twin.Inspect')">
            <el-button
              @click="onSelectItem(scope.row)"
              icon="el-icon-search"
              circle
            ></el-button>
          </el-tooltip> -->
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ViewManager } from "../../../../services/ViewManager/ViewManager";
import { ColorGenerator } from "../../../../services/utlils/ColorGenerator";
import { EventBus } from "../../../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
import { viewerState } from "./viewerState";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

const CountNames = [
  "BuildingCount",
  "FloorCount",
  "RoomCount",
  "CategoryCount",
  "GroupCount",
  "EquipmentCount",
  "ProcessCount",
  "StepCount",
  "TicketCount",
  "AlarmCount",
  "AlarmProcessCount",
];

export default {
  name: "ContextExplorerNodeTable",
  props: {
    viewKey: { required: true, type: String },
    items: { required: true, type: Array },
    columns: { required: true, type: Array },
    relation: { required: true, type: Array },
    context: { required: true, type: Number },
    depth: { required: false, type: Number, default: 5 },
    hasEvent: { required: false, type: Boolean, default: false },
  },

  data() {
    return {
      data: [],
      loading: true,
      loadingArea: true,
      // haveChildren: false,
      isColored: false,
    };
  },

  watch: {
    items() {
      this.update();
    },
  },

  async mounted() {
    const promise = new Promise((res, rej) => {
      this.update();
      res();
    });
    promise.then(() => {
      if (this.viewKey == "DataApp") {
        EventBus.$emit("dataroom-initialized", this.items);
      }
    });
    // this.update();
    if (this.viewKey == "DataApp" || this.viewKey == "SpaceApp") {
      EventBus.$on("Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT", async (e) => {
        let res = e.selections[0]
        let tableComponent = this.$refs.table;

        if (res.dbIdArray[0] != undefined) {
          let bimObjectNodeModel =
            await window.spinal.BimObjectService.getBIMObject(
              res.dbIdArray[0],
              res.model
            );
          let parents = await SpinalGraphService.getParents(
            bimObjectNodeModel.id.get(),
            "hasReferenceObject.ROOM"
          );
          if (parents.length != 0) {
            let parentNode = SpinalGraphService.getRealNode(
              parents[0].id.get()
            );
            let index = tableComponent.data.findIndex(
              (el) => el.serverId == parentNode._server_id
            );
            if (index != -1) {
              tableComponent.setCurrentRow(this.data[index]);
              let rowsElement = tableComponent.$el.getElementsByClassName(
                "context-node-explorer-table-row"
              );
              rowsElement[index].scrollIntoView({ block: "center" });
            }
          }
        }
      });
    }
  },
  beforeDestroy() {
    EventBus.$off("dataroom-instructions-sent");
    EventBus.$off("Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT");
  },
  methods: {
    selectInView(item) {
      this.$emit("select", item);
    },
    zoom(row, column, event) {
      EventBus.$emit("viewer-zoom", row, this.relation);
    },
    /*hoverSelectInView(item){
      let node = FileSystem._objects[item.serverId];
      if(node != undefined){
        if(node.getType().get() == "geographicRoom"){
          this.$emit("select", item);
        }
      }
    },*/

    SeeEvent(item) {
      this.$emit("isolate", item);
    },

    Isolate() {
      EventBus.$emit("isolate", this.data, this.relation);
    },

    Color() {
      this.isColored = true;
      console.debug("context explorer table color; hasEvent : ", this.hasEvent);
      if (this.hasEvent) {
        EventBus.$emit("app-viewer-color", this.data, this.relation);
        return;
      }
      EventBus.$emit("viewer-color", this.data, this.relation);
      // EventBus.$emit('viewer-color', this.data, this.relation);
    },

    async onSelectItem(item, e) {
      e.stopPropagation();
      EventBus.$emit("contextNodeExplorer-onSelectItem", item);
      let view = ViewManager.getInstance(this.viewKey).back();
      if (view.serverId == 0) {
        ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
        return;
      }
      if (
        ViewManager.getInstance(this.viewKey).breadcrumb.length >=
        this.depth /*||
        !SpinalGraphService.hasChildInContext(
          FileSystem._objects[view.serverId].info.id.get(),
          FileSystem._objects[this.context].info.id.get()
        )*/
      ) {
        ViewManager.getInstance(this.viewKey).pop(false);
      }
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
      // this.$destroy();
    },

    update() {
      this.loading = true;
      this.data = [];
      const colorUsed = [];
      for (const item of this.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
        };
        if (resItem.color) colorUsed.push(resItem.color);
        for (let col of this.columns) {
          resItem[col] = item[col];
        }
        if (item.children) {
          for (const [_, childItems] of item.children) {
            resItem["children"] = childItems.length;
            resItem.haveChild = true;
          }
        } else if (FileSystem._objects[item.serverId] !== undefined) {
          resItem["children"] = 0;
          let thisnode = FileSystem._objects[item.serverId];
          if (thisnode.children.PtrLst !== undefined) {
            for (const name of thisnode.children.PtrLst._attribute_names) {
              resItem[name] = thisnode.children.PtrLst[name].length;
              resItem.haveChild = false;
              this.haveObjects = true;
            }
          }
        }
        this.data.push(resItem);
      }
      this.loading = false;
      this.updateColor(this.data, colorUsed);
      this.isColored = viewerState.colored();
    },

    updateIsolation() {
      EventBus.$emit("viewer-reset-isolate");
      if (viewerState.isolated())
        EventBus.$emit("viewer-isolate", this.data, this.relation);
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
      EventBus.$emit("viewer-reset-color");
      if (viewerState.colored()) {
        EventBus.$emit("viewer-color", this.data, this.relation);
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
      return {
        backgroundColor: color[0] === "#" ? color : `#${color}`,
      };
    },

    columnValue(item, key) {
      if (CountNames.includes(key)) return item["children"];
      if (item[key]) return item[key];
      return 0;
    },
    handleIcon(item) {
      let node = FileSystem._objects[item.serverId];
      if (this.context == 0) {
        let boolean = SpinalGraphService.hasChildInContext(
          node.getId().get(),
          node.getId().get()
        );
        return boolean ? "el-icon-arrow-right" : "el-icon-search";
      } else {
        let context = FileSystem._objects[this.context];
        let boolean = SpinalGraphService.hasChildInContext(
          node.getId().get(),
          context.getId().get()
        );
        return boolean ? "el-icon-arrow-right" : "el-icon-search";
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
        let name = column;
        if (CountNames.includes(column)) name = "children";
        headers.push({
          key: name,
          header: this.$t(name),
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
/* .spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
} */

.div__rectangle {
  width: 5px;
  height: 50%;
  margin-left: 0px;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 25%;
  /* min-height: inherit; */
}

.spl-table {
  height: 800px;
  overflow: auto;
  /* overflow-y: scroll; */
}

.spinal-height-control {
  max-height: 80%;
}

/* .current-row.el-table__cell{
  border: 1px solid #00A2FF;
  background-color: #BCE1FF;

} */
</style>

<style>
.el-table__body tr.current-row > td.el-table__cell {
  background-color: #bce1ff !important;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: inherit;
}
/* .el-table__body-wrapper.is-scrolling-none{
  border: 4px solid black;
} */
</style>
