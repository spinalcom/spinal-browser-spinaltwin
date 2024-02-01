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
  <md-dialog
    class="endpoint-chart-viewer-panel-dialog-chart-option"
    :md-active.sync="isOpenComputed"
    :md-close-on-esc="true"
    :md-click-outside-to-close="true"
    :md-closed="onClose"
  >
    <md-dialog-title>Chart Preferences</md-dialog-title>
    <md-dialog-content class="md-scrollbar">
      <div>
        <div class="endpoint-chart-viewer-panel-dialog-chart-option-container">
          <h5
            class="endpoint-chart-viewer-panel-dialog-chart-option-postion-header"
          >
            Line Mode</h5
          >
          <md-radio v-model="lineModeComputed" value="lines">Lines</md-radio>
          <md-radio v-model="lineModeComputed" value="markers"
            >Markers</md-radio
          >
          <md-radio v-model="lineModeComputed" value="lines+markers"
            >Lines + Markers</md-radio
          >
        </div>
        <div class="endpoint-chart-viewer-panel-dialog-chart-option-container">
          <md-checkbox
            v-tooltip="'you may need to resize the panel.'"
            v-model="rangeSlider"
            >Use range slider</md-checkbox
          >
          <div v-if="rangeSlider">
            <em>If the pannel is too small the range slider may not showup.</em>
          </div>
        </div>
        <div
          class="endpoint-chart-viewer-panel-dialog-chart-option-container"
          :class="{
            'endpoint-chart-viewer-panel-dialog-chart-option-container-border':
              showLegendComputed,
          }"
        >
          <md-checkbox v-model="showLegendComputed">Show Legend</md-checkbox>
          <div
            v-if="showLegendComputed"
            class="endpoint-chart-viewer-panel-dialog-chart-option-container-legend"
          >
            <div>
              <md-radio v-model="orientation" value="h">Horizontal</md-radio>
              <md-radio v-model="orientation" value="v">Vertical</md-radio>
            </div>
            <div
              :class="{
                'endpoint-chart-viewer-panel-dialog-chart-option-container-legend-subcontainer':
                  position,
              }"
            >
              <md-checkbox v-model="position"
                >Override default Position</md-checkbox
              >
              <div v-if="position">
                <hr />
                <div>
                  <h5
                    class="endpoint-chart-viewer-panel-dialog-chart-option-postion-header"
                    >Vertical Position</h5
                  >
                  <md-radio v-model="positionX" value="0">left</md-radio>
                  <md-radio v-model="positionX" value="0.5">center</md-radio>
                  <md-radio v-model="positionX" value="1">right</md-radio>
                </div>
                <hr />
                <div>
                  <h5
                    class="endpoint-chart-viewer-panel-dialog-chart-option-postion-header"
                    >Vertical Anchor Position</h5
                  >
                  <md-radio v-model="positionAnchorX" value="auto"
                    >auto</md-radio
                  >
                  <md-radio v-model="positionAnchorX" value="left"
                    >left</md-radio
                  >
                  <md-radio v-model="positionAnchorX" value="center"
                    >center</md-radio
                  >
                  <md-radio v-model="positionAnchorX" value="right"
                    >right</md-radio
                  >
                </div>
                <hr />
                <div>
                  <h5
                    class="endpoint-chart-viewer-panel-dialog-chart-option-postion-header"
                    >Horizontal Position</h5
                  >
                  <md-radio v-model="positionY" value="1">top</md-radio>
                  <md-radio v-model="positionY" value="0.5">middle</md-radio>
                  <md-radio v-model="positionY" value="0">bottom</md-radio>
                </div>
                <hr />
                <div>
                  <h5
                    class="endpoint-chart-viewer-panel-dialog-chart-option-postion-header"
                    >Horizontal Anchor Position</h5
                  >
                  <md-radio v-model="positionAnchorY" value="auto"
                    >auto</md-radio
                  >
                  <md-radio v-model="positionAnchorY" value="top">top</md-radio>
                  <md-radio v-model="positionAnchorY" value="middle"
                    >middle</md-radio
                  >
                  <md-radio v-model="positionAnchorY" value="bottom"
                    >bottom</md-radio
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog">Close</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'chartOptionDialog',
  data() {
    return {
      something: true,
    };
  },
  props: ['isOpen', 'layoutOption', 'lineMode'],
  computed: {
    lineModeComputed: {
      get() {
        return this.lineMode;
      },
      set(value) {
        this.$emit('updateLineMode', value);
      },
    },
    isOpenComputed: {
      get() {
        return this.isOpen;
      },
      set(value) {
        if (value === false) {
          this.onClose();
        }
      },
    },
    showLegendComputed: {
      get() {
        return this.layoutOption.showlegend;
      },
      set(value) {
        this.$emit('updateOptions', { showlegend: value });
      },
    },
    orientation: {
      get() {
        return this.layoutOption.legend.orientation;
      },
      set(value) {
        this.$emit('updateOptions', { legend: { orientation: value } });
      },
    },
    position: {
      get() {
        if (
          this.layoutOption.legend.x === null ||
          this.layoutOption.legend.y === null
        ) {
          return false;
        }
        return true;
      },
      set(value) {
        if (value === true) {
          this.$emit('updateOptions', this.getOptionPosition(0, 1));
        } else {
          this.$emit('updateOptions', {
            legend: {
              x: null,
              y: null,
              xanchor: 'auto',
              yanchor: 'auto',
            },
          });
        }
      },
    },
    positionX: {
      get() {
        return this.layoutOption.legend.x.toString();
      },
      set(value) {
        let x = value,
          y = this.layoutOption.legend.y;
        if (this.layoutOption.legend.y === null) y = 0;
        this.$emit('updateOptions', this.getOptionPosition(x, y));
      },
    },
    positionY: {
      get() {
        return this.layoutOption.legend.y.toString();
      },
      set(value) {
        let x = this.layoutOption.legend.x,
          y = value;
        if (this.layoutOption.legend.x === null) x = 0;
        this.$emit('updateOptions', this.getOptionPosition(x, y));
      },
    },
    positionAnchorX: {
      get() {
        return this.layoutOption.legend.xanchor;
      },
      set(value) {
        this.$emit('updateOptions', {
          legend: {
            xanchor: value,
          },
        });
      },
    },
    positionAnchorY: {
      get() {
        return this.layoutOption.legend.yanchor;
      },
      set(value) {
        this.$emit('updateOptions', {
          legend: {
            yanchor: value,
          },
        });
      },
    },
    rangeSlider: {
      get() {
        if (this.layoutOption.xaxis.rangeslider === null) return false;
        return true;
      },
      set(value) {
        this.$emit('updateOptions', {
          xaxis: { rangeslider: value ? {} : null },
        });
      },
    },
  },
  methods: {
    getOptionPosition(x, y) {
      return {
        legend: {
          x,
          y,
        },
      };
    },
    closeDialog() {
      this.isOpenComputed = false;
    },
    onClose() {
      this.$emit('closeDialog');
    },
  },
};
</script>

<style>
.endpoint-chart-viewer-panel-dialog-chart-option > .md-dialog-container {
  max-height: 80vh;
}

.endpoint-chart-viewer-panel-dialog-chart-option-container {
  padding: 0 10px;
}
.endpoint-chart-viewer-panel-dialog-chart-option-container-legend
  > .endpoint-chart-viewer-panel-dialog-chart-option-container-legend-subcontainer {
  border: 1px solid #a6a6a7;
  padding: 0 10px;
  margin-bottom: 10px;
}

.endpoint-chart-viewer-panel-dialog-chart-option-container-border {
  border: 1px solid #a6a6a7;
}
.endpoint-chart-viewer-panel-dialog-chart-option-postion-header {
  margin: unset;
}
.endpoint-chart-viewer-panel-dialog-chart-option
  .md-scrollbar::-webkit-scrollbar {
  background-color: #121212;
}
.endpoint-chart-viewer-panel-dialog-chart-option
  .md-scrollbar::-webkit-scrollbar-thumb {
  background-color: #737374;
}
</style>
