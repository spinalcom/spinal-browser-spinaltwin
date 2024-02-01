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
    <div class="space-assignation-accept-cancel">
      <el-button
        type="danger"
        icon="el-icon-close"
        circle
        class="space-assignation-button-close"
        @click="cancel"
      ></el-button>
      <div class="space-assignation-title">Affectation des espaces</div>
      <el-button
        type="success"
        icon="el-icon-check"
        circle
        class="space-assignation-button-check"
        @click="handleAffectation"
      ></el-button>
    </div>
    <div class="space-assignation-legend">
      <el-divider
      class="space-assignation-legend-divider"
    >
      <span class="space-assignation-legend-divider-text">État actuel</span>
    </el-divider>

      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_DEFAULT }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles non présentes dans un groupe de la catégorie -->
          Non affectées
        </div>
      </div>

      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_IN_GROUP }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles présentes dans le groupe -->
          Affectées au groupe
        </div>
      </div>
      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_IN_CATEGORY }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles présentes dans un autre groupe de la catégorie -->
          Affectées à un autre groupe
        </div>
      </div>
      <el-divider
      class="space-assignation-legend-divider"
    >
      <span class="space-assignation-legend-divider-text">Actions à réaliser</span>
    </el-divider>
      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_TO_AFFECT }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles à affecter au groupe : non présentes dans un autre groupe -->
          À affecter au groupe
        </div>
      </div>
      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_TO_REAFFECT }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles à ré-affecter au groupe : présentes dans un autre groupe -->
          À ré-affecter au groupe
        </div>
      </div>
      <div class="space-assignation-legend-part">
        <div
          :style="{ backgroundColor: COLOR_ROOMS_TO_DESAFFECT }"
          class="div__rectangle-legend"
        ></div>
        <div class="space-assignation-legend-part-description">
          <!-- Salles à enlever du groupe -->
          À désaffecter du groupe
        </div>
      </div>
    </div>

    <el-collapse>
      <el-collapse-item title="Liste des espaces présents dans la vue">
        <el-table
          ref="spaceListTable"
          :data="spaceList"
          highlight-current-row
          row-class-name="current-view-space-list-rows"
          :header-cell-style="{
            'background-color': '#ffffff',
            'text-align': 'left',
            'letter-spacing': '1px',
            color: '#214353',
            opacity: '1',
            height: 'fit-content',
          }"
          :row-style="{
            background: '#ffffff 0% 0% no-repeat padding-box',
            border: '1px solid #F8F8F8',
            'border-radius': '5px',
            opacity: '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            color: '#214353',
            opacity: '1',
          }"
        >
          <el-table-column label="Nom" prop="name" sortable>
            <div slot-scope="scope">
              <div
                :style="{ backgroundColor: getColor(scope.row) }"
                class="div__rectangle"
              ></div>
              <div>
                {{ scope.row.name }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="Surface" prop="area" sortable>
          </el-table-column>
          <el-table-column
            label="Groupe"
            prop="group.name"
            :filters="groupFilterList"
            :filter-method="filterByGroup"
          >
          </el-table-column>
          <el-table-column
            label="Action"
            prop="action"
            :filters="actionList"
            :filter-method="filterByAction"
          >
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="espaces du groupe">
        <el-table
          :data="roomsInGroup"
          :header-cell-style="{
            'background-color': '#ffffff',
            'text-align': 'left',
            'letter-spacing': '1px',
            color: '#214353',
            opacity: '1',
            height: 'fit-content',
          }"
          :row-style="{
            background: '#ffffff 0% 0% no-repeat padding-box',
            border: '1px solid #F8F8F8',
            'border-radius': '5px',
            opacity: '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            color: '#214353',
            opacity: '1',
          }"
          border
        >
          <el-table-column label="Name" prop="name"> </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="autres espaces de la category">
        <el-table
          :data="otherRoomsInCategory"
          :header-cell-style="{
            'background-color': '#ffffff',
            'text-align': 'left',
            'letter-spacing': '1px',
            color: '#214353',
            opacity: '1',
            height: 'fit-content',
          }"
          :row-style="{
            background: '#ffffff 0% 0% no-repeat padding-box',
            border: '1px solid #F8F8F8',
            'border-radius': '5px',
            opacity: '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            color: '#214353',
            opacity: '1',
          }"
          border
        >
          <el-table-column label="Name" prop="name"> </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// imports
import { EventBus } from "../../../../../services/event";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import * as manager from "../../../../../services/groupManager";
import * as constants from "../../../../../constants";

export default {
  name: "SpaceAssignation",
  props: {
    ctxNode: { type: Object, required: true },
  },
  components: {},

  data() {
    return {
      COLOR_ROOMS_IN_GROUP: "#13A9E0", // blue
      COLOR_ROOMS_IN_CATEGORY: "#FFA400", // orange
      COLOR_ROOMS_TO_AFFECT: "#11EDA9", // green
      COLOR_ROOMS_TO_REAFFECT: "#AF97D6", // purple
      COLOR_ROOMS_DEFAULT: "#808080", // grey
      COLOR_ROOMS_TO_DESAFFECT: "#FF000B", // red

      categoryNode: undefined,
      spaceList: [],
      roomsInGroup: [],
      otherRoomsInCategory: [],
      roomsWithActions: [],
      // roomsToAddToGroup: [],
      // roomsToRemoveOfGroup: [],
      groupFilterList: [],
      actionList: [
        { text: "Aucune", value: "" },
        { text: "Affecter", value: "Affecter" },
        { text: "Désaffecter", value: "Désaffecter" },
        { text: "Ré-affecter", value: "Ré-affecter" },
      ],
    };
  },

  watch: {
    async spaceList(newTab, oldTab) {
      for (let sp of this.spaceList) {
        sp.color = this.getColor(sp);
      }
      await this.colorTables(this.spaceList);
      this.getGroupFilterList(this.spaceList);
      // EventBus.$emit("viewer-color", this.spaceList, constants.GE)
    },
  },

  async mounted() {
    this.categoryNode = (await this.ctxNode.getParents("hasGroup"))[0];
    EventBus.$on(
      "Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT",
      async (e) => {
        let res = e.selections[0];
        let tableComponent = this.$refs.spaceListTable;

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
            let parent = SpinalGraphService.getRealNode(parents[0].id.get());
            let index_spaceList = await this.mapTable(parent);
            if (index_spaceList != -1) {
              tableComponent.setCurrentRow(this.spaceList[index_spaceList]);
              let rowsElement = tableComponent.$el.getElementsByClassName(
                "current-view-space-list-rows"
              );
              rowsElement[index_spaceList].scrollIntoView({ block: "center", behavior: "smooth" });
            }
          }
        }
      }
    );
    await this.init();
  },

  methods: {
    async init() {
      this.initEvents().then(EventBus.$emit("spinalNavbar.ask-room-list"));
      // EventBus.$emit("spinalNavbar.ask-room-list");
      await this.getRoomTables(this.ctxNode);
    },
    async getRoomTables(node) {
      let roomsInGroup = await manager.getRoomsInGroup(
        node,
        this.COLOR_ROOMS_IN_GROUP
      );
      this.roomsInGroup = roomsInGroup;
      let otherRoomsInCategory = await manager.getOtherRoomsInCategory(
        node,
        this.COLOR_ROOMS_IN_CATEGORY
      );
      this.otherRoomsInCategory = otherRoomsInCategory;
      this.colorTables(roomsInGroup);
      this.colorTables(otherRoomsInCategory);
    },
    async colorTables(table) {
      EventBus.$emit("viewer-color", table, constants.GEO_RELATIONS);
    },
    async initEvents() {
      EventBus.$on("spinalNavbar.room-list-sent", async (res) => {
        let categoryNode = (await this.ctxNode.getParents("hasGroup"))[0];
        this.categoryNode = categoryNode;
        let spaceList = [];
        for (let r of res) {
          let node = SpinalGraphService.getRealNode(r.id);
          spaceList.push(
            await manager.getInformationsOfRoomInCategory(node, categoryNode)
          );
        }
        this.spaceList = spaceList;
      });
      return 0;
    },
    async mapTable(node) {
      let index_spaceList = this.spaceList.findIndex(
        (elt) => elt.serverId == node._server_id
      );

      let index_roomsInGroup = this.roomsInGroup.findIndex(
        (elt) => elt.serverId == node._server_id
      );
      let index_otherRoomsInCategory = this.otherRoomsInCategory.findIndex(
        (elt) => elt.serverId == node._server_id
      );

      let index_roomsWithActions = this.roomsWithActions.findIndex(
        (elt) => elt.serverId == node._server_id
      );

      if (index_spaceList != -1) {
        if (index_roomsInGroup == -1 && index_otherRoomsInCategory == -1) {
          if (this.spaceList[index_spaceList].action == "Affecter") {
            this.spaceList[index_spaceList].action = "";
          } else {
            this.spaceList[index_spaceList].action = "Affecter";
          }
        } else if (
          index_roomsInGroup != -1 &&
          index_otherRoomsInCategory == -1
        ) {
          {
            if (this.spaceList[index_spaceList].action == "Désaffecter") {
              this.spaceList[index_spaceList].action = "";
            } else {
              this.spaceList[index_spaceList].action = "Désaffecter";
            }
          }
        } else if (
          index_roomsInGroup == -1 &&
          index_otherRoomsInCategory != -1
        ) {
          if (this.spaceList[index_spaceList].action == "Ré-affecter") {
            this.spaceList[index_spaceList].action = "";
          } else {
            this.spaceList[index_spaceList].action = "Ré-affecter";
          }
        }
        this.spaceList[index_spaceList].color = this.getColor(
          this.spaceList[index_spaceList]
        );
        if (index_roomsWithActions != -1) {
          this.roomsWithActions[index_roomsWithActions] =
            this.spaceList[index_spaceList];
        } else {
          this.roomsWithActions.push(this.spaceList[index_spaceList]);
        }
      }

      EventBus.$emit("viewer-color", this.spaceList, constants.GEO_RELATIONS);
      return index_spaceList;
    },
    getColor(row) {
      let color = "";
      if (row.group.id != "") {
        let checkingGroup =
          row.group.id == this.ctxNode.getId().get() ? true : false;
        if (row.action == "")
          color =
            checkingGroup == true
              ? this.COLOR_ROOMS_IN_GROUP
              : this.COLOR_ROOMS_IN_CATEGORY;
        else if (row.action == "Désaffecter")
          color =
            checkingGroup == true
              ? this.COLOR_ROOMS_TO_DESAFFECT
              : this.COLOR_ROOMS_DEFAULT;
        else if (row.action == "Ré-affecter")
          color =
            checkingGroup == true
              ? this.COLOR_ROOMS_DEFAULT
              : this.COLOR_ROOMS_TO_REAFFECT;
        else color = this.COLOR_ROOMS_DEFAULT;
      } else {
        if (row.action == "Affecter") color = this.COLOR_ROOMS_TO_AFFECT;
        else color = this.COLOR_ROOMS_DEFAULT;
      }
      // return { backgroundColor: color };
      return color;
    },
    getGroupFilterList(table) {
      let groupList = [];
      table.forEach((elt) => {
        if (
          groupList.findIndex((element) => element.value == elt.group.id) == -1
        ) {
          groupList.push({ text: elt.group.name, value: elt.group.id });
        }
      });
      this.groupFilterList = groupList;
    },
    filterByGroup(value, row) {
      return row.group.id === value;
    },
    filterByAction(value, row) {
      return row.action === value;
    },
    reinit() {
      this.COLOR_ROOMS_IN_GROUP = "#13A9E0"; // blue
      this.COLOR_ROOMS_IN_CATEGORY = "#FFA400"; // orange
      this.COLOR_ROOMS_TO_AFFECT = "#11EDA9"; // green
      this.COLOR_ROOMS_TO_REAFFECT = "#AF97D6"; // purple
      this.COLOR_ROOMS_DEFAULT = "#808080"; // grey
      this.COLOR_ROOMS_TO_DESAFFECT = "#FF000B"; // red

      this.categoryNode = undefined;
      this.spaceList = [];
      this.roomsInGroup = [];
      this.otherRoomsInCategory = [];
      this.roomsWithActions = [];
      // this.roomsToAddToGroup= [];
      // this.roomsToRemoveOfGroup= [];
      this.groupFilterList = [];
      this.actionList = [
        { text: "Aucune", value: "" },
        { text: "Affecter", value: "Affecter" },
        { text: "Désaffecter", value: "Désaffecter" },
        { text: "Ré-affecter", value: "Ré-affecter" },
      ];
    },
    async handleAffectation() {
      manager
        .handleAffectation(this.roomsWithActions, this.ctxNode)
        .then(() => {
          this.reinit();
          EventBus.$emit("viewer-reset-color");
          this.$emit("close");
        });
    },
    async cancel() {
      this.reinit();
      EventBus.$emit("viewer-reset-color");
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.div__rectangle {
  width: 5px;
  height: 50%;
  margin-left: 0px;
  border-radius: 5px;
  position: absolute;
  left: 0;
  top: 25%;
}
.div__rectangle-legend {
  width: 5px;
  height: 30px;
  margin-left: 0px;
  border-radius: 5px;
  /* position: absolute;
  left: 0;
  top: 25%; */
}
.collapse-space-assign {
  overflow: scroll;
}
.space-assignation-legend-part {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
}
.space-assignation-legend-part-description {
  color: #58727e;
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: 200;
  margin-left: 5px;
}
.space-assignation-accept-cancel {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
.space-assignation-button-close {
  background-color: #f56c6c;
}
.space-assignation-button-check {
  background-color: #67c23a;
}

.space-assignation-legend-divider {
  color: #58727e;
}
.space-assignation-legend-divider-text {
  color: #58727e;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200;
}
.space-assignation-title {
  /* color: #58727e;
  letter-spacing: 1.4px;
  font-size: 30px;
  font-weight: 200; */
  color: #58727e;
    letter-spacing: 1px;
    font-size: 16px;
    font-weight: 200;
}
</style>
