<!--
Copyright 2018 SpinalCom - www.spinalcom.com

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
  <div class="inventory-panel">
    <div class="inventory-panel-button-group">
      <el-tooltip :content="$t('spinal-twin.DocumentDownload')">
        <el-button
          @click.native="exportData"
          icon="el-icon-download"
          circle
          
        ></el-button>
      </el-tooltip>
      <md-button
        style="background: red"
        class="inventory-panel-button-close"
        @click="openInventoryModal"
        >{{ $t("node-type.close-chart") }}
      </md-button>
    </div>
    <div class="inventory-title">{{ title }}</div>

    <BarChart
      v-if="displayChart == true"
      class="inventory-bar-chart"
      :labels="barLabels"
      :datasets="barChartData"
    ></BarChart>

    <div
      class="inventory-panel-table-div"
      v-if="displayTable == true"
      :style="getStyleOfTable()"
    >
      <el-table
        class="inventory-panel-table"
        :cell-class-name="cellClassChecker"
        table-layout="fixed"
        height="100%"
        :max-height="displayChart == true ? '40vh' : '80vh'"
        :data="tableData"
        border
        resizable
        :header-cell-style="{
          'background-color': '#ffffff',
          'letter-spacing': '1px',
          color: '#214353',
          opacity: '1',
          height: 'fit-content',
          'text-align-last': 'center',
        }"
        :row-style="{
          background: '#ffffff 0% 0% no-repeat padding-box',
          opacity: '1',
          'text-align-last': 'center',
          'letter-spacing': '0.9px',
          color: '#214353',
          opacity: '1',
        }"
      >
        <el-table-column
          class="inventory-panel-table-columns"
          v-for="head in tableDataHeaders"
          :key="head"
          :prop="head"
          :label="head"
          :sortable="isSortable(head)"
          :filters="isFilterable(head)"
          :filter-method="isSortable(head) == true ? undefined : filterHandler"
          :fixed="head == tableDataHeaders[0] || head == tableDataHeaders[1]"
          min-width="150"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { spinalBackEnd } from "../../../services/spinalBackend";
import BarChart from "../../TabManager/generic/charts/BarChart.vue";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";

import tinygradient from "tinygradient";
export default {
  name: "InventoryPanel",
  components: { BarChart },
  props: ["isInventoryModalVisible", "openInventoryModal"],
  data() {
    return {
      displayTable: false,
      displayChart: false,
      title: "",
      tableData: [],
      tableDataHeaders: [],
      barLabels: [],
      barChartData: [],
      sortableHeaders: ["Nom", "Surface", "Salle"],
    };
  },
  methods: {
    async toogleSelect(data) {
      this.title = data.title;
      this.displayTable = data.arrayComponent.display;
      this.tableData = data.arrayComponent.data;
      this.displayChart = data.barChartComponent.display;
      this.barLabels = data.barChartComponent.labels;
      this.tableDataHeaders = data.arrayComponent.header;
      this.barChartData = data.barChartComponent.barChartData;
      // EY TO REMOVE
      if(this.title.includes('Affectation du poste') == true ){
        this.displayChart = false;
      }
    },
    cellClassChecker(e) {
      if (e.row[e.column.property] == undefined)
        return "inventory-panel-table-cell-empty";
    },
    // formatBarChart(tab) {
    //   let labels = Object.keys(tab.resume);
    //   let colors = tinygradient(["#14202C", "#13A9E0", "#CADEE2"]).rgb(
    //     labels.length
    //   );
    //   let returnTab = [];
    //   for (let label of labels) {
    //     let index = labels.findIndex((l) => l == label);
    //     if (tab.resume[label][1] != 0) {
    //       let obj = {
    //         label: label,
    //         backgroundColor: `#${colors[index].toHex()}`,
    //         data: [tab.resume[label][1]],
    //       };
    //       returnTab.push(obj);
    //     }
    //   }
    //   return returnTab;
    // },
    getBarChartData(tab) {
      this.barLabels = Object.keys(tab.resume);
      let obj = [
        {
          label: "Surface en m²",
          hidden: false,
          backgroundColor: "#153284",
          data: [],
        },
        {
          label: "Nombre",
          hidden: true,
          backgroundColor: "#CADEE2",
          data: [],
        },
      ];
      let keys = Object.keys(tab.resume);
      let length = Object.keys(tab.resume).length;
      for (let key of keys) {
        obj[0].data.push(tab.resume[key][1]);
        obj[1].data.push(tab.resume[key][0]);
      }
      return obj;
    },
    getStyleOfTable() {
      // if(this.displayChart == true) return {'max-height':'40vh'};
      // else return {'max-height':'80vh'};
      if (this.displayChart == true) return { height: "40vh" };
      else return { height: "80vh" };
    },
    isSortable(head) {
      if (this.sortableHeaders.includes(head) == true) return true;
      else return false;
    },
    isFilterable(head) {
      if (this.sortableHeaders.includes(head) == false) {
        const props = this.tableData.map((elt) => {
          return {
            text: elt[head] == undefined ? "(vide)" : elt[head],
            value: elt[head],
          };
        });
        let propsFiltered = props.filter((elt, index) => {
          return props.findIndex((e) => e.value == elt.value) == index;
        });
        return propsFiltered;
      } else return undefined;
    },
    filterHandler(value, row, column) {
      return row[column.label] == value;
    },
    exportData() {
      let headers = this.tableDataHeaders.map((elt) => {
        return {
          key: elt,
          header: elt,
        };
      });
      let excelData = [
        {
          name: "Inventaire",
          author: "SpinalCom",
          data: [
            {
              name: "Inventaire",
              header: headers,
              rows: this.tableData,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `Inventaire.xlsx`);
      });
    },
  },
};
</script>

<style>
.inventory-panel {
  background-color: #fafafa;
  max-height: 100vh;
  height: 100vh;
}
.inventory-panel-button-group {
  display: flex;
  justify-content: flex-end;
  height: 60px;
  align-items: center;
}
.inventory-panel-button-close {
  width: fit-content;
}
.inventory-title {
  text-align: left;
  color: #58727e;
  letter-spacing: 1.4px;
  font-size: 30px;
  font-weight: 200;
  /* margin-top: 10px; */
  margin-top: 2%;
  margin-left: 5%;
  margin-bottom: 1%;
  /* margin-left: 5%; */
}
/* .inventory-title-1{
  color: #58727e;
}
.inventory-title-2{
  color: #14202c;
} */

.inventory-resume {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
/* .inventory-resume-item{

} */

.inventory-resume-content {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  /* justify-content: flex-start; */
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
  margin: 0px 5px 10px 5px;
  width: fit-content;
}

.inventory-resume-content-value {
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 20px;
  text-align: center;
  padding: 5px 0px 5px 5px;
}
.inventory-resume-content-unit {
  /* margin-left: 2px; */
  letter-spacing: 1.2px;
  color: #14202c;
  opacity: 1;
  font-size: 15px;
}

.inventory-resume-content-name {
  color: #58727e;
  /* letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200; */
  letter-spacing: 1.2px;
  opacity: 1;
  font-size: 15px;
  text-align: center;
  margin-left: 2px;
  /* color: #949da6;
  letter-spacing: 1.1px;
  font-size: 15px; */
  /* margin-left: 6px; */
}
.inventory-bar-chart {
  margin-right: 5%;
  margin-left: 5%;
}
.inventory-panel-table-div {
  margin-right: 5%;
  margin-left: 5%;
}
.inventory-panel-table {
  /* text-align: center; */
  text-align-last: left;
  /* width: max-content; */
  /* overflow: scroll; */
  /* max-height: 70vh; */
  /* margin: 10px; */
}
.inventory-panel {
  overflow: auto;
}
.inventory-panel-table-cell-empty {
  /* background-color: #EAEEF0; */
  background-color: #f4f4f4;
}

/* .el-table-filter.el-table-filter__content.el-scrollbar.el-table-filter__wrap.el-scrollbar__wrap.el-checkbox-group.el-table-filter__checkbox-group{
  background-color: #ffff;
} */
</style>

