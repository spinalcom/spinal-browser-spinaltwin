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
  <div class="_heatmapContainer spaceL-top">
    <!-- <div class="buttons"> -->
    <!-- <el-button
        class="boutton-barre"
        icon="el-icon-arrow-left"
        circle
        style="position: fixed; z-index: 1"
        @click="goBack()"
      > -->
    <div class="endpoint-selector-block">
      <el-button
        class="boutton-barre"
        icon="el-icon-arrow-left"
        circle
        @click="goBack()"
      >
      </el-button>
      <!-- </div> -->
      <!-- <div class="btn no-shadow btn-size space-right center-div">
        <i @click="decreaseIndex()" class="arrow left"></i>
        {{ variableSelected ? variableSelected.name : '' }}
        <i @click="increaseIndex()" class="arrow right"></i>
      </div> -->
      <!-- <el-button
        class="boutton-barre"
        icon="el-icon-add"
        circle
        @click="genSprite()"
      > -->
      <el-tooltip :content="$t('spinal-twin.insight-center.display-sprites')">
        <el-switch
          v-model="showSprites"
          class="boutton-barre"
          style="--el-switch-on-color: #14202c; --el-switch-off-color: #ff4949"
          icon="el-icon-add"
          circle
          @change="genSprite()"
        >
        </el-switch>
      </el-tooltip>
      <div class="endpoint-selector-label">{{
        $t('HeatmapCenter.visualized-insight')
      }}</div>
      <el-select v-model="index" class="endpoint-selector">
        <el-option
          v-for="(item, index) in variables"
          :key="index"
          :label="variables[index].name"
          :value="index"
        />
      </el-select>
    </div>

    <vueper-slides
      :slide-ratio="1 / 2"
      :touchable="false"
      prevent-y-scroll
      class="no-shadow"
    >
      <vueper-slide class="heights" v-for="(slide, i) in slides" :key="i">
        <!--Profil info component-->
        <template v-slot:content>
          <component
            :is="renderComponent(i)"
            :variableSelected="variableSelected"
            :profil="profil"
            :filterObjects="filter"
            :showSprites="showSprites"
            @sendDataUpdated="sendDataUpdated"
          />
        </template>
      </vueper-slide>
    </vueper-slides>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
// import { EventBus } from "../../../services/event";
import { spinalBackEnd } from '../../../services/spinalBackend';
import { EventBus } from '../../../services/event';

import 'vueperslides/dist/vueperslides.css';

import profilInfoComponent from './carrousel-component/profil_info_component.vue';
import chartComponent from './carrousel-component/chart_component.vue';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import AttributeService from 'spinal-env-viewer-plugin-documentation-service';

const backendService = spinalBackEnd.heatmapBack;

export default {
  props: ['profil', 'filter'],
  data() {
    return {
      showSprites: false,
      variableSelected: undefined,
      endpoints: [],
      details: [],
      variables: [],
      index: undefined,
      slides: [
        {
          title: 'Profil info',
          content: profilInfoComponent,
        },
      ],
    };
  },
  components: {
    VueperSlides,
    VueperSlide,
    profilInfoComponent,
    chartComponent,
  },
  methods: {
    async genSprite() {
      EventBus.$emit('remove-sprites');
      if (this.showSprites == true) {
        EventBus.$emit('InsightCenter-display-sprites');
      } else {
        // EventBus.$off("sprite-clicked", data.endpoint);
        EventBus.$emit('remove-sprites');
      }
    },
    renderComponent(i) {
      return this.slides[i].content;
    },

    decreaseIndex() {
      if (this.index > 0) this.index--;
      else {
        this.index = this.variables.length - 1;
      }
    },

    increaseIndex() {
      if (this.index < this.variables.length - 1) this.index++;
      else {
        this.index = 0;
      }
    },

    async formatAndSendData(variableSelected) {
      // console.trace(variableSelected)
      const gradients = this.getColorGradient(variableSelected.config);
      this.endpoints = await this.getEndpointToBind(variableSelected.id);
      const obj = {
        profil: variableSelected,
        gradients,
        endpoints: this.endpoints,
      };
      EventBus.$emit('seeHeatMap', obj);
    },

    sendDataUpdated() {
      const gradients = this.getColorGradient(this.variableSelected.config);
      EventBus.$emit('seeHeatMap', {
        profil: this.variableSelected,
        gradients,
        endpoints: this.endpoints,
      });
    },

    getColorGradient(config) {
      if (config.enumeration) {
        return backendService.getEnumGradientColor(config.enumeration);
      }
      let _colors = backendService.getGradientColor(
        config.min,
        config.average,
        config.max
      );
      return _colors.map((el, index) => {
        return {
          color: `#${el.toHex()}`,
          value: this.getValue(index, config.max.value, config.min.value),
        };
      });
    },

    getValue(index, max, min) {
      if (isNaN(parseInt(min)) && isNaN(parseInt(max)))
        return index ? 'True' : 'False';
      return Number(min) + ((Number(max) - Number(min)) * Number(index)) / 10;
    },

    getEndpointToBind(endpointId) {
      // console.trace(this.profil)
      const promises = this.profil.rooms.map(async (el) => {
        const endpoint = el.endpoints.find((e) => e.id.get() == endpointId);
        return {
          endpoint,
          ids: el.references,
          target: el,
        };
      });

      return Promise.all(promises);
    },

    goBack() {
      this.$emit('goBackProfil');
    },
  },

  mounted() {
    if (
      this.profil.endpointsProfils &&
      this.profil.endpointsProfils.length > 0
    ) {
      this.variables = this.profil.endpointsProfils;
      this.index = 0;
    }

    /*// Update references
      for(const element of this.profil.rooms){
            element.references = await backendService._getRoomReferences(element.id);
      }*/
  },

  watch: {
    filter: async function () {
      // this.genSprite();
      // EventBus.$emit("remove-sprites");
      // EventBus.$emit('InsightCenter-display-sprites');
      await this.formatAndSendData(this.variableSelected);

    },
    variableSelected() {
      if (this.variableSelected) {
        // const parsed = JSON.parse(this.variableSelected);
        this.formatAndSendData(this.variableSelected);
      }
    },

    index() {
      if (typeof this.index !== 'undefined') {
        this.variableSelected = this.variables[this.index];
      }
    },
  },

  beforeDestroy() {
    EventBus.$emit('hide-heatmap');
  },
};
</script>

<style scoped>
._heatmapContainer {
  width: 100%;
  height: 100%;
  /* padding: 35px 10px; */
}

._heatmapContainer .name {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  font-size: 1.5em;
  /* background-color: green; */
}

/* ._heatmapContainer .buttons {
  width: 100%;
  margin: 10px;
}

._heatmapContainer .buttons .btn {
  width: 300px;
  height: 100%;
  color: #333;
  background-color: #fff;
  border-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

._heatmapContainer .buttons .btn .arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

/* ._heatmapContainer .buttons .btn .arrow.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

._heatmapContainer .buttons .btn .arrow.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg); 
}*/

._heatmapContainer .no-shadow {
  width: 100%;
  /* height: calc(100% - 140px); */
  height: 100%;
  padding-bottom: 20px;
}

._heatmapContainer .no-shadow .heights {
  width: 100%;
  height: 100%;
}

/* .center-div {
  margin: 0 auto;
  width: 100px;
} */

.boutton-barre {
  padding: 14px !important;
}
</style>

<style>
._heatmapContainer .no-shadow .vueperslides__inner {
  width: 100%;
  height: 100%;
}

._heatmapContainer
  .no-shadow
  .vueperslides__inner
  .vueperslides__parallax-wrapper {
  width: 100%;
  height: 100%;
}

.vueperslides__arrow {
  color: black;
}

.endpoint-selector-block {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
.endpoint-selector-label {
  color: #949da6;
  letter-spacing: 1.3px;
  font-size: 20px;
}

.endpoint-selector > .el-input--suffix > .el-input__inner {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
}
/* .el-scrollbar {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c !important;
  border-radius: 10px;
} */

.el-select-dropdown__item.hover {
  background-color: #14202c;
  color: #448aff;
}
.el-select-dropdown__item {
  color: #f9f9f9;
}

.el-select-dropdown.el-popper {
  background-color: #14202c;
  border-color: #14202c;
}
</style>
