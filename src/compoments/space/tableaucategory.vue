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
        <header-bar
          :header="getHeader()"
          :content="getRow()"
          :data="categories"
        ></header-bar>
        <div class="spinal-space-table-content spinal-scrollbar">
          <el-table
            :data="categories"
            border
            style="width: 100%"
            :header-row-style="{
              'min-height': '0px',
              height: '50px',
              padding: '0px',
            }"
            :header-cell-style="{ 'background-color': '#f0f2f5' }"
          >
            <el-table-column
              prop="name"
              :label="$t('SpaceManagement.Nom')"
              width="180"
            >
            </el-table-column>

            <el-table-column
              prop="groups.length"
              :label="$t('SpaceManagement.NombreTotalGroupe')"
              align="center"
            >
            </el-table-column>

            <el-table-column
              :label="$t('SpaceManagement.NombreTotalPiece')"
              align="center"
            >
              <template slot-scope="scope">
                {{ getRoomsCount(scope.row) }}
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('SpaceManagement.SurfaceTotale') + ' (m²)'"
              align="center"
            >
              <template slot-scope="scope">
                {{ getSurfaceTotale(scope.row) }}
              </template>
            </el-table-column>
            <el-table-column label="" width="65" align="center">
              <template slot-scope="scope">
                <el-button
                  v
                  icon="el-icon-arrow-right"
                  circle
                  @click="seeGroups(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import SpinalBackend from '../../services/spinalBackend';
import headerBarVue from './component/headerBar.vue';

export default {
  components: {
    'header-bar': headerBarVue,
  },
  props: ['contextSelected'],
  data() {
    return {
      categories: [],
    };
  },
  watch: {
    contextSelected() {
      this.categories = this.contextSelected.categories;
    },
  },
  async mounted() {
    this.categories = this.contextSelected.categories;
  },
  beforeDestroy() {},
  methods: {
    getRoomsCount(category) {
      return SpinalBackend.spaceBack.getCategoriesRoomCount(category);
    },

    getSurfaceTotale(category) {
      const surfaceTotal =
        SpinalBackend.spaceBack.getCategoriesSurface(category);
      return Math.round(surfaceTotal * 100) / 100;
    },

    seeGroups(category) {
      this.$emit('seeGroups', category);
    },

    getHeader() {
      return [
        {
          key: 'name',
          header: 'name',
          width: 10,
        },
        {
          key: 'groups',
          header: 'Groupes',
          width: 10,
        },
        {
          key: 'rooms',
          header: 'Nombre de pièces',
          width: 10,
        },
        {
          key: 'surface',
          header: 'Surface Totale',
          width: 10,
        },
      ];
    },

    getRow() {
      return this.categories.map((el) => {
        return {
          name: el.name,
          groups: el.groups.length,
          rooms: this.getRoomsCount(el),
          surface: this.getSurfaceTotale(el),
        };
      });
    },
  },
};
</script>

<style scoped>
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
</style>
