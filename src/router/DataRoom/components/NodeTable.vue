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
  <el-table
    v-loading="loading"
    :data="data"
    border
    class="spl-table spl-height-control"
    :header-cell-style="{ 'background-color': '#f0f2f5' }"
    @row-click="selectInView"
    @row-dblclick="SeeEvent"
  >
    <el-table-column :label="$t('explorer.Name')">
      <div slot-scope="scope">
        <div
          v-if="scope.row.color"
          class="spinal-table-cell-color"
          :style="getColor(scope.row.color)"
        ></div>
        <div> {{ scope.row.name }} </div>
      </div>
    </el-table-column>

    <el-table-column
      v-for="column in columns"
      :key="column"
      align="center"
      :label="$t(`node-type.${column}`)"
    >
      <div slot-scope="scope">
        {{ columnValue(scope.row, column) }}
      </div>
    </el-table-column>

    <el-table-column v-if="haveChildren" label="" width="65" align="center">
      <div slot-scope="scope">
        <el-button
          v-if="scope.row.haveChild"
          icon="el-icon-arrow-right"
          circle
          @click="onSelectItem(scope.row)"
        ></el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
import { ViewManager } from '../../../services/ViewManager/ViewManager';
import { ColorGenerator } from '../../../services/utlils/ColorGenerator';
import { EventBus } from '../../../services/event';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';
export default {
  name: 'NodeTable',
  props: {
    viewKey: { required: true, type: String },
    items: { required: true, type: Array },
    columns: { required: true, type: Array },
  },
  data() {
    return {
      data: [],
      loading: true,
      loadingArea: true,
      haveChildren: false,
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
    selectInView(item) {
      EventBus.$emit('view-select-item', {
        server_id: item.serverId,
        color: item.color,
      });
    },
    SeeEvent(item) {
      EventBus.$emit('view-isolate-item', {
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
    ShowAll() {
      EventBus.$emit('view-show-all');
    },
    isolateAll(zone) {
      EventBus.$emit('view-isolate-all', { server_id: zone });
    },
    onSelectItem(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
    },
    update() {
      this.loading = true;
      const res = [];
      const colorUsed = [];
      let haveChild = false;
      for (const item of this.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
        };
        if (resItem.color) colorUsed.push(resItem.color);
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
            haveChild = true;
          }
        } else if (FileSystem._objects[item.serverId] !== undefined) {
          let thisnode = FileSystem._objects[item.serverId];
          if (thisnode.children.PtrLst !== undefined) {
            for (const name of thisnode.children.PtrLst._attribute_names) {
              resItem[name] = thisnode.children.PtrLst[name].length;
              resItem.haveChild = true;
              this.haveObjects = true;
            }
            // for (const [childTypes, childItems] of FileSystem._objects[item.serverId].children.PtrLst ) {
            //   resItem[childTypes] = childItems.length;
            //   resItem.haveChild = true;
            //   haveObjects = true;
            // }
          }
        }
        res.push(resItem);
      }
      this.data = res;
      this.updateColor(this.data, colorUsed);
      this.haveChildren = haveChild;
      this.loading = false;
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
    columnValue(item, key) {
      if (item[key]) return item[key];
      return 0;
    },
    exportToExcel() {
      let headers = [
        {
          key: 'name',
          header: this.$t('name'),
          width: 20,
        },
      ];
      for (const column of this.columns) {
        headers.push({
          key: column,
          header: this.$t(column),
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
  height: 85%;
  overflow: auto;
}
</style>
