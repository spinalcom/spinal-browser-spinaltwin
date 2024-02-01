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
</template>

<script>
import fileSaver from 'file-saver';
import { EventBus } from '../../../services/event';
import groupManagerUtilities from 'spinal-env-viewer-room-manager/js/utilities';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

export default {
  data() {
    return {};
  },
  components: {},
  props: ['header', 'content', 'data'],
  methods: {
    exportData() {
      let excelData = [
        {
          name: 'Tableau',
          author: '',
          data: [
            {
              name: 'Tableau',
              header: this.header,
              rows: this.content,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    },
    async SeeAll() {
      let listes = this.data.map((el) => this.getSalles(el));
      listes = listes.flat(10);
      const promises = listes.map(async (element) => {
        const allBimObjects = await this.getAllBimObjects(element.id);
        return {
          id: element.id,
          ids: allBimObjects,
          color: element.color,
        };
      });

      const bims = await Promise.all(promises);
      EventBus.$emit('seeAll', bims);
    },

    async getAllBimObjects(id) {
      let allBimObjects = await groupManagerUtilities.getBimObjects(id);
      let ref = await SpinalGraphService.getChildren(id, [
        'hasReferenceObject.ROOM',
      ]);
      allBimObjects = allBimObjects.concat(ref);
      return allBimObjects.map((el) => el.get());
    },

    getSalles(item) {
      if (item.rooms) {
        return item.rooms.map((el) => {
          el['color'] = item.color ? item.color : '#ffffff';
          return el;
        });
      } else if (item.groups) {
        return item.groups.map((el) => this.getSalles(el));
      } else if (item.categories) {
        return item.categories.map((el) => this.getSalles(el));
      } else {
        return [];
      }
    },
  },
  async mounted() {},
  watch: {},
  beforeDestroy() {},
};
</script>

<style scoped>
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

/* .boutton-barre {
  width: 40px;
} */
</style>
