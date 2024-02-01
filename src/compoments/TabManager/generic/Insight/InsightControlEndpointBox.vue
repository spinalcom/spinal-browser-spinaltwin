<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
 <v-list-item class="data-table-item">
      <v-list-item-content>
        <v-list-item-title>
        <div
          class="div__rectangle"
          :style="{
            'background-color': 'transparent'
          }"
        ></div>
        
        <div class="value" v-tooltip="`${value} ${unit}`">
        {{ value | filterValue }}
      </div>
      <div class="unit" v-tooltip="`${unit}`">{{ unit }}</div>
          <div class="name" v-tooltip="name">
      {{ name }}
    </div>
        </v-list-item-title>
      </v-list-item-content>
      
      <v-list-item-action class="data-table-item-btn-container">
          <el-button
            v-on:click="openChartModal()"
            :disabled="endpoint.saveTimeSeries === 0"
            class="dashboard-btn custom-icon circled-button"
            :class="{
              'dashboard-btn-disabled': parseInt(endpoint['timeSeries maxDay']) != NaN,
              'dashboard-btn-on': isDataMode,
              'dashboard-btn-off': !isDataMode,
            }"
            circle
            icon="el-icon-menu"
          >
          </el-button>

          <el-button
            v-on:click="downloadTimeSeries()"
            :disabled="endpoint.saveTimeSeries === 0"
            class="dashboard-btn custom-icon circled-button"
            circle
            icon="el-icon-download"
          >
          </el-button>
      </v-list-item-action>
    </v-list-item>

</template>

<script>
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { EventBus } from "../../../../services/event";
import { NetworkService } from "spinal-model-bmsnetwork";
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';

export default {
  name: 'InsightControlEndpointBox',
  props: {
    name: { required: true, type: String },
    endpoint: { required: true, type: Object },
    targetName: { required: false, type: String}
  },
  data() {
    return {
      value: undefined,
      unit: undefined,
      bindProcess: undefined,
      isDataMode: false,
    };
  },
  mounted() {
    this.selectedNode = SpinalGraphService.getRealNode(this.endpoint.endpointNodeId);
    this.value = this.endpoint.currentValue;
    this.unit = this.endpoint.unit;
  },

  methods: {
    updateEndpoint() {
      if (this.endpoint) {
        this.bindProcess = this.endpoint.currentValue.bind(() => {
          this.value = this.endpoint.currentValue.get();
          this.unit = this.endpoint.unit.get();
        });
      }
    },
    openChartModal() {
      let data = this.selectedNode.info;
      // let data = this.endpoint;
      // data.objectName = this.name;
      data.objectName = this.targetName;
      data.unit = this.unit;
      EventBus.$emit("data-mode", data);
      this.isDataMode = !this.isDataMode;
    },
    async downloadTimeSeries(){
      // let eNode = SpinalGraphService.getRealNode(this.endpoint.endpointNodeId);
      // SpinalGraphService._addNode(eNode);

      // let timeSeries = await SpinalGraphService.getChildren(this.endpoint.endpointNodeId, "hasTimeSeries");
      // if(timeSeries.length != 0){
      //   let tsNode = SpinalGraphService.getRealNode(timeSeries[0].timeSeriesId.get());
      //   SpinalGraphService._addNode(tsNode);
      // }

      let netWorkService = new NetworkService();
      let tsNode = await netWorkService.getTimeseries(this.endpoint.endpointNodeId);
      let tsValues = await tsNode.getFromIntervalTime();
      let headers = [
        {
          key: 'date',
          header: 'date',
          width: 20,
        },
        {
          key: 'value',
          header: 'value',
          width: 20,
        }
      ];
      let excelData = [
        {
          name: 'Tableau',
          author: '',
          data: [
            {
              name: 'Tableau',
              header: headers,
              rows: tsValues,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), this.endpoint.name + `.xlsx`);
      });
      
    }
  },

  filters: {
    filterValue(value) {
      if (typeof value == 'string' && value != '') {
        return value;
      } else if (typeof value !== 'undefined') {
        const isBoolean = typeof value === 'boolean';
        if (isBoolean) return value.toString().toUpperCase();
        if (value.toString().trim().length === 0) return 'NULL';
        return value.toFixed(2);
      } else return 'NULL';
    },
  },
};
</script>

<style scoped>
/* .control-endpoint-box {
  width: 30%;
  margin: 10px;
  height: 10%;
} */

/* .div__content {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  align-items: center;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
} */
.relative {
  min-height: inherit;
}
.div__rectangle {
  width: 10px;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  /* min-height: inherit; */
}
/* .stat-card {
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */
.data-table-item-btn-container {
  flex-direction: row;
  display: flex;
  opacity: 0;
  /* transition: opacity 0.5s linear, left 0.2s linear; */
  transition: opacity 0.5s linear;
  overflow: hidden;
  position: relative;
  left: 0px;
  width: 0;
  /* min-width: 1px; */
  min-width: 20%;
  margin-left: 0;
}

.data-table-item:hover .data-table-item-btn-container{
  width: fit-content;
  opacity: 1;
  position: relative;
  /* left: 20px; */
  /* margin-left: 20px; */
  margin-right: 20px;
  /* max-width: 20%; */
}

.v-list-item__title{
  display: flex;
  flex-direction: row;
  align-items: center;
}
/* .data-table-item{
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */

.data-table-item{
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
  margin-top: 4px;
  width: 100%;
}
.v-list-item-content{
  max-width:60%;
}
.value{
  letter-spacing: 1.5px;
  color: #14202C;
  opacity: 1;
  font-size: 20px;
}
.unit{
  margin-left: 2px;
  letter-spacing: 1.5px;
  color: #14202C;
  opacity: 1;
  font-size: 10px;
}
.name{
  color:#949DA6;
  letter-spacing: 1.1px;
  margin-left: 6px;
}
</style>
