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
  <md-content class="chart-data-endpoint-graph-container">
    <md-content id="chart-data-endpoint-graph-container-plotgraph"></md-content>

    <md-empty-state
      v-if="isReady && chartData.length <= 0"
      class="chart-data-endpoint-graph-container-empty"
      md-icon="show_chart"
      md-label="No Endpoint selected"
    >
    </md-empty-state>
    <md-empty-state
      v-else-if="isReady && !haveData"
      class="chart-data-endpoint-graph-container-empty"
      md-icon="show_chart"
      md-label="No Data"
      md-description="No data to show in the Endpoint(s) Selected !"
      v-tooltip="selectedNames"
    >
    </md-empty-state>
    <md-button
      class="md-icon-button md-primary md-raised chart-data-endpoint-graph-container-option-button"
      :class="{ autodeskv6: isviewerV6 }"
      @click="optionOpen = true"
    >
      <md-icon>settings</md-icon>
    </md-button>

    <chartOptionDialog
      :isOpen="optionOpen"
      :layoutOption="this.layout"
      :lineMode="lineMode"
      @updateLineMode="updateLineMode"
      @closeDialog="optionOpen = false"
      @updateOptions="updateOptions"
    ></chartOptionDialog>
  </md-content>
</template>

<script>
import chartOptionDialog from './chartOptionDialog.vue';
import { timeSeriesMap } from './map';
const globalType = typeof window === 'undefined' ? global : window;

export default {
  name: 'plotlyComponent',
  components: { chartOptionDialog },
  data() {
    return {
      chartData: [],
      selectedNames: '',
      colors: [
        '#17becf',
        '#bcbd22',
        '#7f7f7f',
        '#e377c2',
        '#8c564b',
        '#9467bd',
        '#d62728',
        '#2ca02c',
        '#ff7f0e',
        '1f77b4',
      ],
      color_map: {},
      optionOpen: false,
      isReady: false,
      haveData: false,
      lineMode: 'lines',
      layout: {
        margin: {
          b: 90,
          t: 8,
          pad: 4,
        },
        font: {
          size: 15,
          color: '#000000',
        },
        paper_bgcolor: 'rgba(10,10,10,0.1)',
        plot_bgcolor: 'rgba(10,10,10,0)',
        xaxis: {
          rangeslider: null,
          showgrid: true,
          showline: true,
          type: 'date',
          tickformat: '%d/%m/%Y %H:%M',
        },
        yaxis: {
          showgrid: true,
          showline: true,
        },
        showlegend: true,
        legend: {
          xanchor: 'auto',
          yanchor: 'auto',
          orientation: 'v',
          x: 0,
          y: null,
          traceorder: 'normal',
          font: {
            family: 'sans-serif',
            size: 12,
            color: '#FFF',
          },
          bgcolor: 'rgba(34,34,34,.9)',
          bordercolor: '#424242',
          borderwidth: 2,
        },
      },
    };
  },
  props: ['data', 'reloadData'],
  computed: {
    isviewerV6() {
      return parseInt(window.LMV_VIEWER_VERSION) === 6;
    },
  },
  mounted() {
    this.setChartData();
    this.init();
    this._graph_ = this.createGraph();

    this.intervalResize = setInterval(() => {
      this.resize(this._graph_.gd, this._graph_.gd3);
    }, 1000);
  },
  watch: {
    data: function () {
      this.refreshData();
    },
    reloadData: function () {
      this.refreshData();
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalResize);
  },
  methods: {
    init() {
      this.promUpdate = null;
      this.rect = {
        w: '100px',
        h: '100px',
      };
      this.my_chartData = [];
      this._graph_ = null;
    },
    updateObj(obj, data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (
            Array.isArray(data[key]) === false &&
            typeof data[key] === 'object' &&
            data[key] !== null
          ) {
            if (typeof obj[key] === 'undefined' || obj[key] === null) {
              obj[key] = {};
            }
            this.updateObj(obj[key], data[key]);
          } else {
            obj[key] = data[key];
          }
        }
      }
    },
    updateOptions(data) {
      this.updateObj(this.layout, data);
      globalType.Plotly.react(this._graph_.gd, this.my_chartData, this.layout, {
        modeBarButtonsToRemove: ['sendDataToCloud'],
        displaylogo: false,
        responsive: true,
      });
    },
    updateLineMode(lineMode) {
      this.lineMode = lineMode;
      for (let idx = 0; idx < this.my_chartData.length; idx++) {
        const myElement = this.my_chartData[idx];
        myElement.mode = lineMode;
      }
      globalType.Plotly.react(this._graph_.gd, this.my_chartData, this.layout, {
        modeBarButtonsToRemove: ['sendDataToCloud'],
        displaylogo: false,
        responsive: true,
      });
    },
    updateGraph: function (chartData) {
      for (let index = 0; index < chartData.length; index++) {
        const element = chartData[index];
        let found = false;
        for (let idx = 0; idx < this.my_chartData.length; idx++) {
          const myElement = this.my_chartData[idx];
          if (element.nodeId === myElement.nodeId) {
            if (
              element.x.length !== myElement.x.length ||
              (element.x[0] && element.x[0] !== myElement.x[0])
            ) {
              (myElement.x = element.x), (myElement.y = element.y);
            }
            found = true;
            break;
          }
        }
        if (found === false) {
          let col = this.colors.length != 0 ? this.colors.pop() : 'black';
          this.color_map[element.nodeId] = col;
          this.my_chartData.push({
            nodeId: element.nodeId,
            mode: this.lineMode,
            type: 'scatter',
            name: element.name,
            x: element.x,
            y: element.y,
            line: {
              color: col,
            },
          });
        }
      }
      const toDelete = [];
      for (let idx = 0; idx < this.my_chartData.length; idx++) {
        const myElement = this.my_chartData[idx];
        let found = false;
        for (let index = 0; index < chartData.length; index++) {
          const element = chartData[index];
          if (element.nodeId === myElement.nodeId) {
            found = true;
          }
        }
        if (found === false) {
          toDelete.push(myElement);
        }
      }

      for (let index = 0; index < toDelete.length; index++) {
        const element = toDelete[index];
        if (this.color_map[element.nodeId] != 'black') {
          this.colors.push(this.color_map[element.nodeId]);
        }
        delete this.color_map[element.nodeId];
        const idx = this.my_chartData.indexOf(element);
        this.my_chartData.splice(idx, 1);
      }
      globalType.Plotly.react(this._graph_.gd, this.my_chartData, this.layout, {
        modeBarButtonsToRemove: ['sendDataToCloud'],
        displaylogo: false,
        responsive: true,
      });
      for (let index = 0; index < this.my_chartData.length; index++) {
        const element = this.my_chartData[index];
        if (element.x.length > 0) {
          this.haveData = true;
          this.isReady = true;
          return;
        }
      }
      this.haveData = false;
      this.isReady = true;
      this.selectedNames = this.my_chartData.map((e) => e.name).join(', ');
    },

    createGraph: function () {
      var d3 = globalType.Plotly.d3;
      var graphWidth = 100,
        graphHeight = 100;
      var gd3 = d3
        .select(
          document.getElementById(
            'chart-data-endpoint-graph-container-plotgraph'
          )
        )
        .style({
          width: graphWidth + '%',
          height: graphHeight + '%',
        });
      var gd = gd3.node();
      return { gd: gd, gd3: gd3 };
    },
    resize: function (gd, gd3) {
      let w = gd3.style('width');
      let h = gd3.style('height');
      if (this.rect.w !== w || this.rect.h !== h) {
        this.rect.w = w;
        this.rect.h = h;
        globalType.Plotly.Plots.resize(gd);
      }
    },

    setChartData() {
      this.chartData = Array.from(timeSeriesMap.values());
    },

    refreshData() {
      this.setChartData();
      this.updateGraph(this.chartData);
    },
  },
};
</script>
<style>
.chart-data-endpoint-graph-container-plotgraph
  .js-plotly-plot
  .plotly
  .modebar {
  left: 0;
}
</style>

<style scoped>
.chart-data-endpoint-graph-container {
  height: 100%;
  width: 100%;
  background-color: rgba(10, 10, 10, 0.1);
}
.chart-data-endpoint-graph-container-empty {
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: unset;
}
.chart-data-endpoint-graph-container-option-button {
  bottom: 5px;
  left: 0;
  position: absolute;
}

.chart-data-endpoint-graph-container-option-button.autodeskv6 {
  bottom: 24px;
}
</style>
