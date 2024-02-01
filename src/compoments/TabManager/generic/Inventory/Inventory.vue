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
  <div class="inventory-list">
    <el-divider class="inventory-divider">
      <span class="inventory-divider-text">Inventaire des espaces</span>
    </el-divider>

    <el-button
      v-for="item of inventories.room"
      :key="item"
      v-show="item.display == true"
      class="inventory-tab-buttons"
      @click="item.fct"
      >{{ item.name }}</el-button
    >

    <!-- <el-button class="inventory-tab-buttons" @click="fullRoomInventory"
      >INVENTAIRE COMPLET DES ESPACES</el-button
    >

    <el-button
      class="inventory-tab-buttons"
      :loading="spaceInventoryLoader"
      @click="spaceInventory"
      >INVENTAIRE DES ESPACES DE LA CATEGORIE</el-button
    >

    <el-button class="inventory-tab-buttons" @click="roomInventory('typology')"
      >INVENTAIRE DES TYPOLOGIES D'ESPACES</el-button
    > -->

    <el-divider class="inventory-divider">
      <span class="inventory-divider-text">Inventaire des objets</span>
    </el-divider>

    <el-button
      v-for="item of inventories.equipments"
      :key="item"
      v-show="item.display == true"
      class="inventory-tab-buttons"
      @click="item.fct"
      >{{ item.name }}</el-button
    >

    <!-- <el-button
      class="inventory-tab-buttons"
      @click="equipmentInventory('typology')"
      >INVENTAIRE DES TYPOLOGIES D'OBJETS</el-button
    >
    <el-button
      class="inventory-tab-buttons"
      @click="equipmentInventory('furniture')"
      >INVENTAIRE DU MOBILIER</el-button
    >
    <el-button
      class="inventory-tab-buttons"
      @click="equipmentInventory('staff')"
      >INVENTAIRE DES AFFECTATIONS</el-button
    > -->
  </div>
</template>

<script>
// imports
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import * as inventoryUtils from "../../../../services/utlils/inventory";
import * as constants from "../../../../constants";
import { EventBus } from "../../../../services/event";

export default {
  name: "Inventory",
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
  components: {},

  data() {
    return {
      ctxNode: false,
      endpoints: false,
      controlEndpoints: false,
      context: false,
      spaceInventoryLoader: false,
      inventories: {
        room: [
          {
            name: "INVENTAIRE COMPLET DES ESPACES",
            display: true,
            fct: () => {
              this.fullRoomInventory();
            },
          },
          {
            name: "INVENTAIRE DES ESPACES DE LA CATEGORIE",
            display: true,
            fct: () => {
              this.spaceInventory();
            },
          },
          {
            name: "INVENTAIRE DES TYPOLOGIES D'ESPACES",
            display: true,
            fct: () => {
              this.roomInventory("typology");
            },
          },
          {
            name: "INVENTAIRE DES AFFECTATIONS PAR ENTREPRISE",
            display: true,
            fct: () => {
              this.roomInventory("company_assignment");
            },
          },
          {
            name: "INVENTAIRE DES AFFECTATIONS PAR SERVICE",
            display: true,
            fct: () => {
              this.roomInventory("duty_assignment");
            },
          },
        ],
        equipments: [
          {
            name: "INVENTAIRE DES TYPOLOGIES D'OBJETS",
            display: true,
            fct: () => {
              this.equipmentInventory("typology");
            },
          },
          {
            name: "INVENTAIRE DU MOBILIER",
            display: true,
            fct: () => {
              this.equipmentInventory("furniture");
            },
          },
          {
            name: "INVENTAIRE DES AFFECTATIONS",
            display: true,
            fct: () => {
              this.equipmentInventory("staff");
            },
          },
        ],
      },
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
      this.endpoints = false;
      this.controlEndpoints = false;
      res();
    });
    promise.then(async () => {
      await this.update(this.Properties.view.serverId);
    });
    EventBus.$on("click-on_spinal-twin.Inventory", () =>
      this.update(this.Properties.view.serverId)
    );
  },

  methods: {
    async update(id) {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];
      let index = this.inventories.room.findIndex(
        (elt) => elt.name == "INVENTAIRE DES ESPACES DE LA CATEGORIE"
      );
      if (index != -1) {
        if (
          [
            constants.GEO_BUILDING_TYPE,
            constants.GEO_FLOOR_TYPE,
            constants.GEO_ROOM_TYPE,
            constants.EQUIPMENT_TYPE,
            constants.SPACE_GROUP_TYPE,
            constants.SPATIAL_CONTEXT_TYPE,
            constants.SPACE_CONTEXT_TYPE,
          ].includes(this.ctxNode.getType().get())
        ) {
          this.inventories.room[index].display = false;
        }
        else{
          this.inventories.room[index].display = true;
        }
      }
    },
    async spaceInventory() {
      let data = await inventoryUtils.getRoomOfCategoryInventory(this.ctxNode);
      EventBus.$emit("inventory-mode", data);
      // this.spaceInventoryLoader = true;
      // const promise = new Promise(async (res, rej) => {
      //   if (this.ctxNode.getType().get() == "groupingCategory") {
      //     let data = await inventoryUtils.getRoomCategoryInventory(
      //       this.ctxNode
      //     );
      //     EventBus.$emit("inventory-mode", data);
      //   } else if (
      //     this.ctxNode.getType().get() == "geographicRoomGroupContext"
      //   ) {
      //     let data = await inventoryUtils.getRoomContextInventory(this.ctxNode);
      //     EventBus.$emit("inventory-mode", data);
      //   }
      //   res();
      // });
      // promise.then(() => (this.spaceInventoryLoader = false));
    },
    async equipmentInventory(std_name) {
      let data = await inventoryUtils.getEquipmentCategoryInventory(
        this.ctxNode,
        std_name
      );
      EventBus.$emit("inventory-mode", data);
    },
    async roomInventory(std_name) {
      let data = await inventoryUtils.getRoomCategoryInventory(
        this.ctxNode,
        std_name
      );
      EventBus.$emit("inventory-mode", data);
    },
    async fullRoomInventory() {
      let data = await inventoryUtils.getFullRoomCategoryInventory(
        this.ctxNode
      );
      EventBus.$emit("inventory-mode", data);
    },
  },
};
</script>

<style scoped>
.inventory-list {
  display: flex;
  flex-direction: column;
}
.inventory-tab-buttons {
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
  margin-left: 0px;
}
.inventory-divider {
  color: #58727e;
}
.inventory-divider-text {
  color: #58727e;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200;
}
</style>
