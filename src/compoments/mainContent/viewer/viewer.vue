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
  <div id="autodesk_forge_viewer"
       class="viewerContainer">
  </div>
</template>

<script>
import { ForgeViewer } from "spinal-forge-viewer";
// import GraphService from "../../config/GraphService";
// import { forgeExtentionManager } from "./ForgeExtentionManager";
// import { eventViewerManager } from "./EventViewerManager";
import { spinalBackEnd } from "../../../services/spinalBackend";
import { viewerUtils } from "../../../services/viewerUtils/viewerUtils";
import { EventBus } from "../../../services/event";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { DISABLE_VIEWER } from "../../../constants";

import "spinal-env-viewer-plugin-forge";
export default {
  name: "AppViewer",
  props: ["isMinimized"],
  data() {
    this.elementColored = new Map();
    return {
      viewer: null,
      ticketToZoom: [],
      colors: {},
      materials: {}
    };
  },
  watch: {
    isMinimized() {
      if (this.viewer && this.viewer.toolbar && this.viewer.viewCubeUi) {
        if (this.isMinimized) {
          this.viewer.toolbar.setDisplay("none");
          this.viewer.viewCubeUi.setVisible(false);
        } else {
          this.viewer.toolbar.setDisplay("");
          this.viewer.viewCubeUi.setVisible(true);
        }
        setTimeout(this.viewer.resize.bind(this.viewer), 400);
      }
    }
  },
  mounted() {
    EventBus.$on("see", data => {
      this.isoLate(data.ids);
      this.restoreAllColor();
      // if (this.elementIsColored(data.id)) {
      //   this.restorColor(data.ids, data.id);
      // } else {
      this.colorsRooms(data.ids, data.color, data.id);
      // }
    });

    EventBus.$on("seeAll", data => {
      if (this.allElementAreColored(data)) {
        this.restoreAllColor();
        //   data.forEach(element => {
        //     ids.push(...element.ids);
        //     this.restorColor(element.ids, element.id);
        //   });
      } else {
        let ids = [];
        this.restoreAllColor();
        data.forEach(element => {
          ids.push(...element.ids);
          this.colorsRooms(element.ids, element.color, element.id);
        });
        this.isoLate(ids);
      }
    });

    return this.createViewer();
    // const container = document.getElementById("autodesk_forge_viewer");
    // this.forgeViewer = new ForgeViewer(container, false);
    // // forgeExtentionManager.viewer = this.forgeViewer.viewer;
    // await this.forgeViewer.start(
    //   "/models/Resource/3D View/{3D} 341878/{3D}.svf",
    //   true
    // );

    // // await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
    // // let scenes = await GraphService.getScene();
    // // await window.spinal.SpinalForgeViewer.loadModelFromNode(
    // //   scenes[0].info.id.get()
    // // );
    // this.viewer = this.forgeViewer.viewer;

    // await spinalBackEnd.waitInit();
    // const scenes = await spinalBackEnd.viewerBack.getScenes();
    // await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
    // this.viewer.fitToView();
    // // // viewerUtils.initViewer(this.forgeViewer.viewer);
    // // // this.createSetColor();
    // // // this.createRestoreColor();
    // // // this.getEvents();
    // // const exten = forgeExtentionManager.getExtentions();

    // // exten.forEach(ext => {
    // //   this.forgeViewer.loadExtension(ext);
    // // });

    // // viewerUtils.fitToView();
    // // eventViewerManager.init(this.viewer, forgeExtentionManager);
  },
  methods: {
    async createViewer() {
      const container = document.getElementById("autodesk_forge_viewer");
      this.forgeViewer = new ForgeViewer(container, false);
      await this.forgeViewer.start(
        "/models/Resource/3D View/{3D} 341878/{3D}.svf",
        true
      );
      this.viewer = this.forgeViewer.viewer;
      await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
      const scenes = await spinalBackEnd.viewerBack.getScenes();
      SpinalGraphService._addNode(scenes[0]);
      if (!DISABLE_VIEWER) {
        await window.spinal.SpinalForgeViewer.loadModelFromNode(
          scenes[0].info.id.get()
        );
      }
      await spinalBackEnd.waitInit();
      // const scenes = await spinalBackEnd.viewerBack.getScenes();
      // await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
      this.viewer.fitToView();
      viewerUtils.initViewer(this.viewer);
    },

    colorsRooms(roomsList, argColor, id) {
      this.elementColored.set(id, roomsList);
      const color = this.convertHewToRGB(argColor);

      roomsList.forEach(child => {
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
      roomsList.forEach(child => {
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

    isoLate(roomsList) {
      let dbIds = roomsList.map(el => el.dbid);
      if (roomsList.length === 0) {
        this.viewer.isolate(dbIds, this.viewer.model);
      } else {
        let model = window.spinal.BimObjectService.getModelByBimfile(
          roomsList[0].bimFileId
        );

        this.viewer.isolate(dbIds, model);
      }
    },

    convertHewToRGB(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
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
    }
  }
};
</script>

<style scoped>
.viewerContainer {
  position: relative;
  height: 100%;
  widows: 100%;
}
</style>
