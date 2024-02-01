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
  <el-row>
    <el-tabs type="border-card">
      <!-- Onglet Tableau -->
      <el-tab-pane :label="$t('Table')">
        <el-button
          class="boutton-barre"
          icon="el-icon-arrow-left"
          circle
          style="position: fixed; z-index: 1"
          @click="goBack()"
        ></el-button>

        <el-row class="barre">
          <el-button
            class="boutton-barre"
            icon="el-icon-download"
            circle
            @click="exportData"
          ></el-button>
        </el-row>
        <!-- Si on a pas encore selectionné de Groupe on affiche une table avec la liste des groupes-->
        <!-- <el-table
          v-if="!groupSelected"
          :data="data"
          class="tab"
          border
          style="width: 100%"
          :header-cell-style="{ 'background-color': '#f0f2f5' }"
        > -->
        <el-table
          v-if="!groupSelected"
          :data="data"
          class="tab"
          border
          style="width: 100%, overflow: auto; height: inherit"
          :header-cell-style="{
            'background-color': '#ffffff',
            'text-align': 'left',
            'letter-spacing': '1px',
            'color': '#214353',
            'opacity': '1',
            'height': 'fit-content',
          }"
          :row-style="{
            'background': '#ffffff 0% 0% no-repeat padding-box',
            'border': '1px solid #F8F8F8',
            'border-radius': '5px',
            'opacity': '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            'color': '#214353',
            'opacity': '1',
          }"
        >
          <!-- @row-click="SeeEvent"> -->
          <el-table-column :label="$t('HeatmapCenter.Groupe')">
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
            :label="$t('HeatmapCenter.Nb_profils')"
            align="center"
          >
          </el-table-column>
          <el-table-column width="65" align="center">
            <template slot-scope="scope">
              <el-button
                @click="SelectGroup(scope.row)"
                icon="el-icon-arrow-right"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import profilLstVue from './profilLstVue';
import { EventBus } from '../../../services/event';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';

import groupManagerUtilities from 'spinal-env-viewer-room-manager/js/utilities';

export default {
  data() {
    return {
      categoryLst: [],
      fields: [],
      items: [],
      groupSelected: null,
    };
  },
  components: { profilLstVue },
  props: ['selectCategorie'],
  methods: {
    getColor(color) {
      return { backgroundColor: color[0] === '#' ? color : `#${color}` };
    },
    async SeeEvent(data) {
      const allBimObjects = await this.getAllBimObjects(data.id);
      EventBus.$emit('see', {
        id: data.id,
        ids: allBimObjects,
        color: data.color,
      });
    },

    async getAllBimObjects(id) {
      const allBimObjects = await groupManagerUtilities.getBimObjects(id);

      return allBimObjects.map((el) => el.get());
    },
    async SeeAll() {
      let promises = this.data.map(async (el) => {
        return {
          id: el.id,
          ids: await this.getAllBimObjects(el.id),
          color: el.color,
        };
      });

      let allBimObjects = await Promise.all(promises);

      EventBus.$emit('seeAll', allBimObjects);
    },
    exportData() {
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

    goBack() {
      this.$emit('goBackCategory');
    },
    //Selecting a group
    seeProfilsTable(profilData) {
      this.groupSelected = {
        profils: profilData.rooms,
        color: profilData.color,
      };
      this.$emit('addbreadcrumb', {
        name: profilData.name,
        click: () => {
          this.$parent.breadcrumbs.slice(1);
          this.groupSelected = null;
          this.$parent.profilSelected = null;
        },
      });
    },

    SelectGroup(group) {
      this.$emit('selectgroup', group);
    },

    resetgroupSelected() {
      this.groupSelected = null;
    },
    getHeader() {
      if (this.groupSelected) {
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
      if (this.groupSelected) {
        return this.groupSelected.profils;
      } else {
        return this.data.map((gitu) => {
          let excelRows = Object.assign({}, gitu);
          excelRows.rooms = gitu.rooms.length;
          return excelRows;
        });
      }
    },
  },

  computed: {
    data: function () {
      return this.selectCategorie.groups.map((obj) => {
        return {
          id: obj.id,
          name: obj.name,
          color: obj.color,
          rooms: obj.rooms,
        };
      });
    },
  },
  watch: {},
  filters: {
    roundSurface(surface) {
      return Math.round(surface * 100) / 100;
    },
  },
  beforeDestroy() {},
  async mounted() {
    this.groupSelected = null;
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
