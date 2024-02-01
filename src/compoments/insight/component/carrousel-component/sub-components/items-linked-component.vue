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
  <div class="_content" v-if="rooms.length > 0">
    <!-- <div
      v-if="
        variableSelected.type == 'Consigne' &&
        variableSelected.dataType == 'Boolean'
      "
      class="fullWidth"
    > -->
    <div
      v-if="variableSelected.command == 1 &&
      variableSelected.dataType == 'Boolean'"
      class="fullWidth"
    >
      <el-button
        v-on:click="ModifyAll(false)"
        class="_buttonGlobal2"
        circle
        :style="{
          'background-color': getColor(false, this.variableSelected.config),
        }"
      >
      </el-button>
      <p class="modifyAllValuesText"> {{ $t('HeatmapCenter.ModifyAll') }} </p>
      <el-button
        v-on:click="ModifyAll(true)"
        class="_buttonGlobal2"
        circle
        :style="{
          'background-color': getColor(true, this.variableSelected.config),
        }"
      >
      </el-button>
    </div>

    <!-- <div
      v-if="
        variableSelected.type == 'Consigne' &&
        variableSelected.dataType != 'Boolean'
      "
      class="fullWidth"
    > -->
    <div
      v-if="variableSelected.command == 1"
      class="fullWidth"
    >
      <el-button
        v-on:click="openModal()"
        class="_buttonGlobal"
        icon="el-icon-edit"
      >
        {{ $t('HeatmapCenter.ModifyAll') }}
      </el-button>
    </div>

    <value-config-global
      v-if="isModalVisible"
      :config="variableSelected.config"
      :dataType="variableSelected.dataType"
      @globalValue="ModifyAll"
    >
    </value-config-global>

    <endpoint-component class="endpoint-component"
      v-for="room of rooms"
      :name="room.name"
      v-bind:key="room.name"
      :endpoints="room.endpoints"
      :variableSelected="variableSelected"
      :room="room"
      @select="onSelect"
    ></endpoint-component>
  </div>

  <div class="empty" v-else> No item Linked </div>
</template>

<script>
import { spinalBackEnd } from '../../../../../services/spinalBackend';
import endpointComponent from './endpoint-component.vue';
import valueConfigGlobal from './value-config-global.vue';
import { EventBus } from '../../../../../services/event';
const backendService = spinalBackEnd.heatmapBack;

export default {
  components: { endpointComponent, valueConfigGlobal },
  name: 'itemsLinkedComponent',
  props: {
    rooms: {},
    variableSelected: {},
    filterObjects: {},
  },
  data() {
    return {
      isModalVisible: false,
      isIsolate: false,
      isSelect: false,

      isolated: undefined,
      selected: undefined,
    };
  },
  mounted(){
    EventBus.$on("InsightCenter-scroll-to-endpoint", res => {
      let element = this.$el.getElementsByClassName("endpoint-component");
      element.scroll({
        top: 58,
        left: 0,
        behavior: 'smooth'
});
    });
  },
  methods: {
    openModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    ModifyAll(value) {
      if (
        value == undefined ||
        !confirm('Are you sure you want to modify all values')
      ) {
        return;
      }
      this.isModalVisible = false;
      for (var room of this.rooms) {
        var endpoints = room.endpoints;
        var endpoint = endpoints.find(
          (el) => el.id.get() == this.variableSelected.id
        );
        endpoint.currentValue.set(value);
      }
    },
    getColor(endpointValue, config) {
      if (config.enumeration) {
        return backendService.getEnumColor(endpointValue, config.enumeration);
      }
      let gradient = backendService.getGradientColor(
        config.min,
        config.average,
        config.max
      );
      let color = backendService.getColor(
        endpointValue,
        config.min.value,
        config.max.value,
        gradient
      );
      let colorHex = `#${color}`;
      return colorHex;
    },
    onSelect(data) {
      if (this.isSelect && data.id == this.selected) {
        EventBus.$emit('insight-clear-select');
        this.isSelect = false;
      } else {
        EventBus.$emit('sidebar-mouseover-item-without-debounce', data);
        this.isSelect = true;
      }
      this.selected = data.id;
    },
  },
  watch: {
    variableSelected() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style scoped>
.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
}

._buttonGlobal {
  justify-content: center;
  display: inline-block;
  margin-left: 40%;
  margin-right: 40%;
  height: 40px;
  width: 200px;
  padding: 10px;
}

._buttonGlobal2 {
  justify-content: center;
  display: inline-block;
  padding: 10px;
  height: 25px;
  width: 25px;
}

.modifyAllValuesText {
  margin-left: 25%;
  margin-right: 25%;
}

.fullWidth {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

</style>

<style>
._content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
}

</style>
