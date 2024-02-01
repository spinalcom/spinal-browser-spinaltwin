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
  <div id="autodesk_forge_viewer" class="viewerContainer">
    <heatmap-legend></heatmap-legend>
  </div>
</template>

<script>
import { ForgeViewer } from 'spinal-forge-viewer';
import { spinalBackEnd } from '../../../services/spinalBackend';
import { viewerUtils } from '../../../services/viewerUtils/viewerUtils';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { DISABLE_VIEWER } from '../../../constants';

import HeatmapLegendContainer from '../../insight/heatmap-legends/container.vue';

import 'spinal-env-viewer-plugin-forge';
export default {
  name: 'AppViewer',
  components: {
    'heatmap-legend': HeatmapLegendContainer,
  },
  data() {
    this.elementColored = new Map();
    return {
      viewer: null,
      ticketToZoom: [],
      colors: {},
      materials: {},
    };
  },
  mounted() {
    return this.createViewer();
  },
  methods: {
    handleMinized(toShowUI) {
      if (this.viewer) {
        if (toShowUI === false) {
          if (this.viewer.toolbar) this.viewer.toolbar.setDisplay('none'); //// MASQUER DE LA TOOLBAR FORGE
          viewerUtils.setCubeVisible(false);
        } else {
          if (this.viewer.toolbar) this.viewer.toolbar.setDisplay('none'); // MASQUER DE LA TOOLBAR FORGE
          viewerUtils.setCubeVisible(true);
        }
        setTimeout(this.viewer.resize.bind(this.viewer), 400);
      }
    },
    async createViewer() {
      
      const container = document.getElementById('autodesk_forge_viewer');
      this.forgeViewer = new ForgeViewer(container, false);
      await this.forgeViewer.start();
      //   "/models/Resource/3D View/{3D} 341878/{3D}.svf",
      //   true
      this.viewer = this.forgeViewer.viewer;
      await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
      const scenes = await spinalBackEnd.viewerBack.getScenes();
      SpinalGraphService._addNode(scenes[0]);
      if (!DISABLE_VIEWER) {
        let found = false;
        for (const scene of scenes) {
          SpinalGraphService._addNode(scene);
          if (scene.info.autoLoad?.get() === true) {
            await window.spinal.SpinalForgeViewer.loadModelFromNode(
              scene.info.id.get()
            );
            found = true;
            break;
          }
        }
        if (!found && scenes.length > 0)
          await window.spinal.SpinalForgeViewer.loadModelFromNode(
            scenes[0].info.id.get()
          );
      }
      this.$emit('onModelLoadEnd');
      await spinalBackEnd.waitInit();
      // const scenes = await spinalBackEnd.viewerBack.getScenes();
      // await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
      this.viewer.fitToView();
      viewerUtils.initViewer(this.viewer);
      // document.getElementById('guiviewer3d-toolbar').style.display = "none";
    },

    colorsRooms(roomsList, argColor, id) {
      this.elementColored.set(id, roomsList);
      const color = this.convertHewToRGB(argColor);

      roomsList.forEach((child) => {
        let model = window.spinal.BimObjectService.getModelByBimfile(
          child.bimFileId
        );

        model.setThemingColor(
          child.dbid,
          new THREE.Vector4(color.r / 255, color.g / 255, color.b / 255, 0.7),
          true
        );
      });
    },

    restorColor(roomsList, id) {
      this.elementColored.delete(id);
      roomsList.forEach((child) => {
        let model = window.spinal.BimObjectService.getModelByBimfile(
          child.bimFileId
        );

        model.setThemingColor(child.dbid, new THREE.Vector4(0, 0, 0, 0), true);
      });
    },
    restoreAllColor() {
      for (const [, lst] of this.elementColored) {
        for (const child of lst) {
          let model = window.spinal.BimObjectService.getModelByBimfile(
            child.bimFileId
          );

          model.setThemingColor(
            child.dbid,
            new THREE.Vector4(0, 0, 0, 0),
            true
          );
        }
      }
      this.elementColored.clear();
      this.viewer.impl.invalidate(true, true, true);
    },

    pushToModel(targetArray, ids, model) {
      for (const obj of targetArray) {
        if (obj.model === model) {
          for (const id of ids) {
            obj.selection.add(id);
          }
          return;
        }
      }

      const idSet = new Set();
      for (const id of ids) {
        idSet.add(id);
      }
      targetArray.push({
        model,
        selection: idSet,
      });
    },

    convertForIsolate(roomLst) {
      const data = [];
      for (const room of roomLst) {
        let model = window.spinal.BimObjectService.getModelByBimfile(
          room.bimFileId
        );
        this.pushToModel(data, [room.dbid], model);
      }
      return data.map((it) => {
        return { model: it.model, selection: Array.from(it.selection) };
      });
    },

    isoLate(roomsList) {
      viewerUtils.isolateObjects(this.convertForIsolate(roomsList));
    },

    convertHewToRGB(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },

    elementIsColored(elementCol) {
      return this.elementColored.get(elementCol) != undefined;
    },

    allElementAreColored(allElement) {
      for (const element of allElement) {
        if (!this.elementIsColored(element.id)) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style scoped>
.viewerContainer {
  position: relative;
  height: 100%;
  widows: 100%;
}
</style>
