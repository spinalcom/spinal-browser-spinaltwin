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
  <el-row class="spinal-space-tableau-row">
    <el-tabs type="border-card" class="tabs-container">
      <el-tab-pane label="Tableau" class="spinal-space-tab-container">
        <el-row class="barre">
          <el-button
            class="boutton-barre"
            icon="el-icon-download"
            circle
            @click="exportData"
          ></el-button>
          <el-button
            class="boutton-barre"
            icon="el-icon-view"
            circle
            @click="SeeAll"
          ></el-button>
        </el-row>
        <div
          class="spinal-space-table-content spinal-scrollbar"
          v-if="!roomsSelected"
        >
          <el-table
            :data="data"
            class="tab"
            border
            style="width: 100%"
            :header-cell-style="{ 'background-color': '#f0f2f5' }"
            @row-click="SeeEvent"
          >
            <el-table-column :label="$t('SpaceManagement.Nom')">
              <template slot-scope="scope">
                <div>
                  <div
                    class="spinal-table-cell-color"
                    :style="{ 'background-color': scope.row.color }"
                  ></div>
                  <div> {{ scope.row.name }} </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="rooms.length"
              :label="$t('SpaceManagement.NombreDePiece')"
              align="center"
            >
            </el-table-column>
            true
            <el-table-column
              prop="surface"
              :label="$t('SpaceManagement.Surface') + ' (m²)'"
            >
              align="center">
              <template slot-scope="scope">
                {{ scope.row.surface | roundSurface }}
              </template>
            </el-table-column>
            <el-table-column label="" width="65" align="center">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-arrow-right"
                  circle
                  @click="seeRoomTable(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="spinal-space-table-content spinal-scrollbar" v-else>
          <roomLstVue
            ref="roomscomponent"
            :rooms="roomsSelected.rooms"
            :color="roomsSelected.color"
            @seeEvent="SeeEvent"
            @addBreadcrumb="emitBreadcrumb"
          >
          </roomLstVue>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Dashboard" class="spinal-space-tab-container">
        <el-row class="barre">
          <el-button
            class="boutton-barre"
            circle
            icon="el-icon-view"
            @click="SeeAll"
          ></el-button>
        </el-row>
        <div class="spinal-space-table-content spinal-scrollbar">
          <el-carousel height="500px" :loop="false">
            <el-carousel-item>
              <h3 class="small">
                <ChartsPiece :entreprise="data"></ChartsPiece>
              </h3>
            </el-carousel-item>
            <el-carousel-item>
              <h3 class="small">
                <ChartsEsp :entreprise="data"></ChartsEsp>
              </h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- <el-row>

      <el-button @click="exportData">Export</el-button>
    </el-row> -->
  </el-row>
</template>

<script>
import roomLstVue from './roomLstVue';
import ChartsPiece from './ChartsPiece';
import ChartsEsp from './ChartsEsp';
import { EventBus } from '../../../services/event';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import groupManagerUtilities from 'spinal-env-viewer-room-manager/js/utilities';

export default {
  components: { ChartsPiece, ChartsEsp, roomLstVue },
  filters: {
    roundSurface(surface) {
      return Math.round(surface * 100) / 100;
    },
  },
  props: ['selectCategorie'],
  data() {
    return {
      categoryLst: [],
      fields: [],
      items: [],
      roomsSelected: null,
      categorieRoomSelect: null,
    };
  },
  computed: {
    data: function () {
      return this.selectCategorie.groups.map((obj) => {
        let roo = {
          id: obj.id,
          name: obj.name,
          color: obj.color,
          rooms: obj.rooms,
          surface: obj.rooms.reduce((acc, e) => acc + e.surface, 0),
        };

        if (this.roomsSelected && this.roomsSelected.id === roo.id) {
          this.roomsSelected = {
            id: roo.id,
            rooms: roo.rooms,
            color: roo.color,
          };
        }
        return roo;
      });
    },
  },
  mounted() {
    this.roomsSelected = null;
  },
  methods: {
    getColor(color) {
      return { backgroundColor: color[0] === '#' ? color : `#${color}` };
    },
    async SeeEvent(data) {
      const allBimObjects = await this.getAllBimObjects(data);
      EventBus.$emit('see', {
        id: data.id,
        ids: allBimObjects,
        color: data.color,
      });
    },

    async getAllBimObjects(data) {
      // const allBimObjects = await groupManagerUtilities.getBimObjects(id);
      const promises = data.rooms.map((el) =>
        //groupManagerUtilities.getBimObjects(el.id)
        this.getBimObjectsAndRoomReference(el.id)
      );
      const allBimObjects = await Promise.all(promises).then((result) => {
        result = result.flat(10);
        return result;
      });
      return allBimObjects.map((el) => el.get());
    },

    async getBimObjectsAndRoomReference(roomId) {
      let objects = await groupManagerUtilities.getBimObjects(roomId);
      let ref = await SpinalGraphService.getChildren(roomId, [
        'hasReferenceObject.ROOM',
      ]); // la constante dans spinal-env-viewer-context-geographic-service/build/constants.js pas correcte
      return objects.concat(ref);
    },

    async SeeAll() {
      if (this.roomsSelected) {
        this.$refs.roomscomponent.SeeAll();
        return;
      }

      let promises = this.data.map(async (el) => {
        return {
          id: el.id,
          ids: await this.getAllBimObjects(el),
          color: el.color,
        };
      });

      let allBimObjects = await Promise.all(promises);
      EventBus.$emit('seeAll', allBimObjects);
    },
    exportData() {
      //let excelRows = Object.assign({}, this.data);
      //excelRows.rooms = this.data.rooms.length;
      let headers = this.getHeader();
      let excelData = [
        {
          name: 'Tableau',
          author: '',
          data: [
            {
              name: 'Tableau',
              header: headers,
              rows: this.getRow(),
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    },

    seeRoomTable(roomData) {
      this.roomsSelected = {
        id: roomData.id,
        rooms: roomData.rooms,
        color: roomData.color,
      };
      const resetRoomFct = this.$emit('updateBreadcrumb', {
        index: 2,
        item: {
          name: roomData.name,
          click: () => {
            // this.$refs.roomscomponent.resetTabRoom();
            this.$emit('resetRoomSelect');
            const groupSelected = this.selectCategorie.groups.find(
              (el) => el.id === roomData.id
            );

            this.seeRoomTable(groupSelected);
          },
        },
      });

      // this.$emit("addbreadcrumb", {
      //   name: roomData.name,
      //   click: () => {

      //     const groupSelected = this.selectCategorie.groups.find(
      //       el => el.id === roomData.id
      //     );

      //     this.$refs.roomscomponent.resetTabRoom();

      //     this.$emit("updateBreadcrumb", {
      //       index: 2,
      //       item: {
      //         ...groupSelected,
      //         click: () => {
      //           this.$refs.roomscomponent.resetTabRoom();
      //         }
      //       }
      //     });
      //   }
      // });
    },
    emitBreadcrumb(data) {
      this.$emit('addbreadcrumb', data);
    },

    resetRoomSelected() {
      this.roomsSelected = null;
    },
    getHeader() {
      if (this.roomsSelected) {
        return [
          {
            key: 'name',
            header: 'name',
            width: 10,
          },
          {
            key: 'surface',
            header: 'Surface',
            width: 10,
          },
        ];
      } else {
        return [
          {
            key: 'name',
            header: 'name',
            width: 10,
          },
          {
            key: 'rooms',
            header: 'Nombre de pièces',
            width: 10,
          },
          {
            key: 'surface',
            header: 'Surface',
            width: 10,
          },
        ];
      }
    },
    getRow() {
      if (this.roomsSelected) {
        return this.roomsSelected.rooms;
      } else {
        return this.data.map((gitu) => {
          let excelRows = Object.assign({}, gitu);
          excelRows.rooms = gitu.rooms.length;
          return excelRows;
        });
      }
    },
  },
};
</script>

<style scoped>
.butcen {
  text-align: center;
  padding-top: 100px;
}

.boutton-barre {
  padding: 14px !important;
}
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.el-icon-download {
  width: 30px;
}

.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
