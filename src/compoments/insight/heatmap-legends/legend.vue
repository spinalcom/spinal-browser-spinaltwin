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
  <div class="colors">
    <div class="boxContainer" v-for="(g, index) in gradients" :key="index">
      <div class="boxColor" :style="{ 'background-color': g.color }"></div>
      <div class="boxValue" v-tooltip="g.value + ''">{{ g.value }}</div>
    </div>
  </div>
</template>
<script>
import { spinalBackEnd } from '../../../services/spinalBackend';
const backendService = spinalBackEnd.heatmapBack;

export default {
  props: {
    gradients: {},
    endpoints: {},
    profil: {},
  },
  data() {
    this.bindProcessMap = new Map();
    this.bimObjectsColored = [];
    return {};
  },
  mounted() {
    this.colorElement();
  },

  beforeDestroy() {
    this.unBindAll();
    this.restoreColor();
  },

  methods: {
    unBindAll() {
      this.bindProcessMap.forEach((value, key) => {
        key.currentValue.unbind(value);
        this.bindProcessMap.delete(key);
      });
      this.bindProcessMap = new Map();
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
      return backendService.getColor(
        endpointValue,
        config.min.value,
        config.max.value,
        gradient
      );
    },

    colorElement() {
      this.unBindAll();
      this.endpoints.map(({ endpoint, ids }) => {
        if (!endpoint) return;
        let bindProcess = endpoint.currentValue.bind(() => {
          const value = endpoint.currentValue.get();
          let color = this.getColor(value, this.profil.config);
          let vector = backendService.convertColorToVector(color);
          ids.forEach((el) => {
            if (el.model) {
              this.bimObjectsColored.push({ model: el.model, ids: el.ids });

              el.ids.forEach((id) => {
                el.model.setThemingColor(id, vector, true);
              });
            }
          });

          spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(true);
        });
        this.bindProcessMap.set(endpoint, bindProcess);
      });
    },

    restoreColor() {
      const vector = new THREE.Vector4(0, 0, 0, 0);
      this.bimObjectsColored.forEach(({ model, ids }) => {
        ids.forEach((dbid) => model.setThemingColor(dbid, vector, true));
      });
      spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(true);
      this.bimObjectsColored = [];
    },
  },

  watch: {
    endpoints() {
      this.unBindAll();
      this.restoreColor();

      this.colorElement();
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
      return backendService.getColor(
        endpointValue,
        config.min.value,
        config.max.value,
        gradient
      );
    },

    colorElement() {
      this.unBindAll();
      this.endpoints.map(({ endpoint, ids }) => {
        if (!endpoint) return;
        let bindProcess = endpoint.currentValue.bind(() => {
          const value = endpoint.currentValue.get();
          let color = this.getColor(value, this.profil.config);
          let vector = backendService.convertColorToVector(color);
          ids.forEach((el) => {
            if (el.model) {
              this.bimObjectsColored.push({ model: el.model, ids: el.ids });

              el.ids.forEach((id) => {
                el.model.setThemingColor(id, vector, true);
              });
            }
          });

          spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(true);
        });
        this.bindProcessMap.set(endpoint, bindProcess);
      });
    },

    restoreColor() {
      const vector = new THREE.Vector4(0, 0, 0, 0);
      this.bimObjectsColored.forEach(({ model, ids }) => {
        ids.forEach((dbid) => model.setThemingColor(dbid, vector, true));
      });
      spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(true);
      this.bimObjectsColored = [];
    },
  },

  watch: {
    endpoints() {
      this.unBindAll();
      this.restoreColor();

      this.colorElement();
    },

    gradients() {
      this.colorElement();
    },
  },
};
</script>
<style scoped>
.colors {
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column-reverse;
}
.colors .boxContainer {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  position: relative;
}

.colors .boxContainer .boxColor {
  width: 20%;
  background-color: red;
}

.colors .boxContainer .boxValue {
  width: calc(80%);
  align-self: flex-end;
  justify-self: flex-end;
  max-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  padding-left: 4px;
  position: absolute;
  bottom: -10px;
  left: 10px;
}
</style>
