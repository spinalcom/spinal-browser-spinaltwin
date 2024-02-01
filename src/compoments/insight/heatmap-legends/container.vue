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
  <div class="md-scrollbar heatmap_legends_container" v-if="seeLegend">
    <div class="legend">
      <heatmap-legend
        :gradients="gradients"
        :endpoints="endpoints"
        :profil="profil"
      ></heatmap-legend>
    </div>
  </div>
</template>

<script>
import HeatmapLegend from './legend.vue';
import { EventBus } from '../../../services/event';

export default {
  name: 'heatmapPanel',
  components: {
    'heatmap-legend': HeatmapLegend,
  },
  data() {
    this.button;
    return {
      seeLegend: false,
      profil: {},
      gradients: [],
      endpoints: [],
    };
  },
  mounted() {
    this.openEvent();
    this.getUpdateEvent();
    this.destroyLegend();
  },
  methods: {
    closeLegend() {},

    destroyLegend(id) {
      EventBus.$on('hide-heatmap', (data) => {
        this.seeLegend = false;
      });
    },

    closed() {},

    openEvent() {
      EventBus.$on('seeHeatMap', (option) => {
        this.seeLegend = true;
        this.gradients = option.gradients;
        this.endpoints = option.endpoints;
        this.profil = option.profil;
      });
    },

    getUpdateEvent() {
      EventBus.$on('update-controlPoint', (option) => {});
    },
  },

  beforeDestroy() {},
};
</script>

<style scoped>
.heatmap_legends_container {
  max-width: 200px;
  height: calc(40%);
  overflow-x: auto;
  position: absolute;
  left: 0px;
  top: calc(20%);
  padding: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  flex-wrap: wrap;
  z-index: 998;
}

.heatmap_legends_container .legend {
  width: 60px;
  height: calc(98% - 20px);
  color: #000000;
  padding: 5px;
  display: inline-block;
  font-weight: bold;
  margin: 10px 10px 10px 0;
}

.heatmap_legends_container:last-child {
  margin-right: 0px;
}
</style>
