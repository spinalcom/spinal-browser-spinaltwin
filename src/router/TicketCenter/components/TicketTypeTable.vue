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
    <el-table-column :label="$t('explorer.Name')">
      <template slot-scope="scope">
        <div>
          <div
            v-if="scope.row.color"
            class="spinal-table-cell-color"
            :style="getColor(scope.row.color)"
          ></div>
          <div>{{ scope.row.name }}</div>
        </div>
      </template>
    </el-table-column>

    <el-table-column
      v-if="haveProcess"
      align="center"
      :label="$t(`view.Process`)"
    >
      <template slot-scope="scope">
        <div v-loading="loadingProcess">
          {{ roundNumber(scope.row.Process) }}
        </div>
      </template>
    </el-table-column>

    <el-table-column
      v-for="collum in collums"
      :key="collum"
      align="center"
      :label="$t(`view.${collum}`)"
    >
      <template slot-scope="scope">
        {{ collumValue(scope.row, collum) }}
      </template>
    </el-table-column>

    <el-table-column v-if="haveChildren" label="" width="65" align="center">
      <template slot-scope="scope">
        <el-button
          v-if="scope.row.haveChild"
          icon="el-icon-arrow-right"
          circle
          @click="onSelectItem(scope.row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ViewManager } from '../../../services/ViewManager/ViewManager';
import { roundNumber } from '../../../services/utlils/roundNumber';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';
import { ColorGenerator } from '../../../services/utlils/ColorGenerator';
import { EventBus } from '../../../services/event';

export default {
  name: 'TicketTypeTable',
  props: {
    viewKey: { require: true, type: String, default: '' },
    items: { required: true, type: Array },
    collums: { required: false, type: Array, default: () => [] },
    nodeType: { required: true, type: String },
  },
  data() {
    return {
      data: [],
      loading: true,
      loadingProcess: true,
      haveChildren: false,
      haveProcess: false,
    };
  },
  watch: {
    items() {
      this.update();
    },
  },
  mounted() {
    this.update();
  },
  methods: {
    roundNumber,
    selectInView(item) {
      EventBus.$emit('view-select-item', {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeEvent(item) {
      EventBus.$emit('view-color-item', {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeAll(zone) {
      let items = this.data.map((item) => {
        return { server_id: item.serverId, color: item.color };
      });
      EventBus.$emit('view-color-all', items, { server_id: zone });
    },
    onSelectItem(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
    },
    async update() {
      this.loading = true;
      this.loadingProcess = true;
      this.haveProcess = false;
      const res = [];
      let haveChild = false;
      const prom = [];
      const colorUsed = [];
      for (const item of this.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
          process: 0,
        };
        if (resItem.color) colorUsed.push(resItem.color);
        // if (item.isLocationType()) this.haveProcess = true;
        // prom.push;
        // (await item.getProcess()).then((result) => {
        // resItem.process = await item.getProcess();
        // })();
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            haveChild = true;
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
          }
        }
        res.push(resItem);
      }

      this.updateColor(res, colorUsed);
      this.haveChildren = haveChild;
      this.data = res;
      this.loading = false;
      Promise.all(prom).then(() => {
        this.loadingProcess = false;
      });
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
      return { backgroundColor: color[0] === '#' ? color : `#${color}` };
    },
    collumValue(item, key) {
      if (item[key]) return item[key];
      return 0;
    },
    seeAll() {
      let items = this.data.map((item) => {
        return { server_id: item.serverId, color: item.color };
      });
      EventBus.$emit('view-color-all', items, { server_id: zone });
    },
    exportToExcel() {
      let headers = [
        {
          key: 'name',
          header: this.$t('name'),
          width: 20,
        },
        {
          key: 'process',
          header: this.$t('Process'),
          width: 10,
        },
      ];
      for (const collum of this.collums) {
        headers.push({
          key: collum,
          header: this.$t(collum),
          width: 10,
        });
      }
      let excelData = [
        {
          name: 'Tableau',
          author: '',
          data: [
            {
              name: 'Tableau',
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
    rowHaveChildren(item) {
      if (item.children) {
        // eslint-disable-next-line no-unused-vars
        for (const it of item.children) {
          return true;
        }
      }
      return false;
    },
    getItemFromServerId(serverId) {
      for (const item of this.items) {
        if (item.serverId === serverId) {
          return item;
        }
      }
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
