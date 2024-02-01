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
    class="spl-table"
    border
    style="width: 100%"
    :header-cell-style="{ 'background-color': '#f0f2f5' }"
    @row-click="selectInView"
    @row-dblclick="SeeEvent"
  >
    <el-table-column :label="$t('DataRoom.Name')">
      <template slot-scope="scope">
        <div>
          <div
            v-if="scope.row.color"
            class="spinal-table-cell-color"
            :style="getColor(scope.row.color)"
          ></div>
          <div> {{ scope.row.name }} </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      v-if="haveArea"
      align="center"
      :label="$t(`DataRoom.Area`)"
    >
      <template slot-scope="scope">
        <div v-loading="loadingArea">
          {{ roundNumber(scope.row.area) }} m²
        </div>
      </template>
    </el-table-column>

    <el-table-column
      v-for="collum in collums"
      :key="collum"
      align="center"
      :label="$t(`DataRoom.${collum}`)"
    >
      <template slot-scope="scope">
        {{ collumValue(scope.row, collum) }}
      </template>
    </el-table-column>

    <el-table-column v-if="haveChildren" label="" width="65" align="center">
      <template slot-scope="scope">
        <el-button
          icon="el-icon-arrow-right"
          circle
          @click="onSelectItem(scope.row)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ViewManager } from '../../services/ViewManager/ViewManager';
import { roundNumber } from '../../services/utlils/roundNumber';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';
import { ColorGenerator } from '../../services/utlils/ColorGenerator';
import { EventBus } from '../../services/event';

export default {
  name: 'DataRoomTypeTable',
  props: {
    nodeType: { required: true, type: String },
    collums: { required: false, type: Array, default: () => [] },
    items: { required: true, type: Array },
    viewKey: { require: true, type: String, default: '' },
  },
  data() {
    return {
      haveChildren: false,
      data: [],
      loading: true,
      loadingArea: true,
      haveArea: false,
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
    getColor(color) {
      return { backgroundColor: color[0] === '#' ? color : `#${color}` };
    },
    collumValue(item, key) {
      if (item[key]) return item[key];
      return 0;
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
    onSelectItem(item) {
      localStorage.setItem('roomId', item.nodeId);
      localStorage.setItem('roomServerId', item.serverId);
      ViewManager.getInstance(this.viewKey).push(
        item.name,
        item.serverId,
        item.nodeId
      );
    },
    popView() {
      ViewManager.getInstance(this.viewKey).pop();
    },
    update() {
      this.loading = true;
      this.loadingArea = true;
      this.haveArea = false;
      const res = [];
      let haveChild = false;
      const prom = [];
      const colorUsed = [];
      for (const item of this.items) {
        const resItem = {
          name: item.name,
          nodeId: item.nodeId,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
          area: 0,
        };
        if (resItem.color) colorUsed.push(resItem.color);
        if (item.isLocationType()) this.haveArea = true;
        prom.push(
          item.getArea().then((result) => {
            resItem.area = result;
          })
        );
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
        this.loadingArea = false;
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
    getItemFromServerId(serverId) {
      for (const item of this.items) {
        if (item.serverId === serverId) {
          return item;
        }
      }
    },
    exportToExcel() {
      let headers = [
        {
          key: 'name',
          header: this.$t('name'),
          width: 20,
        },
        {
          key: 'area',
          header: this.$t('Area'),
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
    selectInView(item) {
      EventBus.$emit('data-room-select-item', {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeEvent(item) {
      EventBus.$emit('data-room-color-item', {
        server_id: item.serverId,
        color: item.color,
      });
    },
    isolateAll(zone) {
      EventBus.$emit('view-isolate-all', { server_id: zone });
    },
    SeeAll(zone) {
      let items = this.data.map((item) => {
        return { server_id: item.serverId, color: item.color };
      });
      EventBus.$emit('data-room-color-all', items, { server_id: zone });
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
.spl-table {
  overflow-y: unset auto;
}
</style>
