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
  <div class="spinal-body-main-container">
    <spinalNavbar
      class="main-navbar-mobile-device"
      v-if="matchMedia() == 'mobile'"
      v-bind:switch3D="mobileSwitch"
    ></spinalNavbar>
    <appSelector class="appSelector"></appSelector>
    <div
      class="spinal-main-container"
      :class="{ 'have-abs-viewer': absviewer }"
    >
      <div class="spinal-main-container-left">
        <!-- <appSelector class="appSelector"></appSelector> -->
        <div
          v-show="
            !absviewer && !dataMode && !inventoryMode && !documentViewerMode
          "
          ref="viewerContainer"
          class="spinal-viewer-container"
          :class="{ 'abs-viewer': absviewer }"
        >
          <div ref="viewerContent" class="viewer-content">
            <div class="content-viewer-view">
              <appViewer
                ref="viewerItem"
                @onModelLoadEnd="showLoadingModel = false"
                v-loading="showLoadingModel"
              >
              </appViewer>
              <el-button-group class="btn-abs-viewer-popio" v-show="!absviewer">
                <el-button icon="el-icon-minus" @click="onMiniClick">
                </el-button>
                <el-button
                  icon="el-icon-copy-document"
                  @click="onPopClick"
                ></el-button>
                <el-button icon="el-icon-menu" @click="onDataClick"></el-button>
                <el-button
                  class="spinal-button-expand"
                  :icon="chooseExpandIcon()"
                  size="small"
                  @click="expandData()"
                  v-if="matchMedia() == 'desktop'"
                ></el-button>
                <el-button
                  icon="el-icon-collection"
                  @click="onInventoryClick"
                ></el-button>
                <el-button
                  icon="el-icon-files"
                  @click="onDocumentViewerClick"
                ></el-button>
              </el-button-group>
            </div>
          </div>
        </div>

        <div
          v-show="dataMode || inventoryMode || documentViewerMode"
          class="spinal-viewer-container"
        >
          <div class="viewer-content">
            <endpoint-chart-viewer-panel
              v-show="dataMode"
              ref="chart"
              v-bind:isChartModalVisible="dataMode"
              v-bind:openChartModal="openDataMode"
            >
            </endpoint-chart-viewer-panel>
            <InventoryPanel
              v-show="inventoryMode"
              ref="inventory"
              v-bind:isInventoryModalVisible="inventoryMode"
              v-bind:openInventoryModal="openInventoryMode"
            >
            </InventoryPanel>
            <DocumentViewerPanel
               v-if="documentViewerMode"
              ref="documentViewer"
              :data="docviewerData"
              v-bind:isDocumentViewerModalVisible="documentViewerMode"
              v-bind:openDocumentViewerModal="openDocumentViewerMode"
            >
            </DocumentViewerPanel>
          </div>
        </div>
      </div>
      <!-- <el-button class="spinal-button-expand" :icon="chooseExpandIcon()" size="small" @click="expandData()"></el-button> -->
      <div class="spinal-other-container">
        <spinalNavbar
          class="main-navbar-desktop-device"
          v-if="matchMedia() == 'desktop'"
        ></spinalNavbar>
        <router-view></router-view>
      </div>
      <transition name="el-fade-in-linear">
        <div
          v-show="absviewer && !dataMode"
          ref="viewerContainerMini"
          class="viewer-container-mini"
          :class="{ hideViewer }"
        >
          <div class="spinal-viewer-header-container">
            <div ref="headerViewer" class="spinal-viewer-header-drag-elm"></div>
            <el-button-group class="btn-abs-viewer-popio">
              <el-button icon="el-icon-minus" @click="onMiniClick"> </el-button>
              <el-button icon="el-icon-copy-document" @click="onPopClick">
              </el-button>
            </el-button-group>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import createDragElement from "../../services/utlils/createDragElement";
import appViewer from "./viewer/viewer.vue";
import spinalNavbar from "../navbar/spinalNavbar.vue";
import { EventBus } from "../../services/event";
import endpointChartViewerPanel from "./chart/endpointChartViewerPanel.vue";
import appSelector from "../drawer/appSelector/appSelector.vue";
import InventoryPanel from "./inventory/InventoryPanel.vue";
import DocumentViewerPanel from "./documentViewer/DocumentViewerPanel.vue";

export default {
  name: "MainContent",
  components: {
    appViewer,
    spinalNavbar,
    endpointChartViewerPanel,
    appSelector,
    InventoryPanel,
    DocumentViewerPanel,
  },
  data() {
    return {
      showLoadingModel: true,
      absviewer: false,
      hideViewer: false,
      dataMode: false,
      expanded: false,
      inventoryMode: false,
      documentViewerMode: false,
      showViewerMobile: true,
      docviewerData: { document:null, type:''},
      // media: 'desktop',          // 'mobile' || 'desktop'
    };
  },
  mounted() {
    if (this.matchMedia() == "mobile") {
      const collection1 = document.getElementsByClassName(
        "spinal-main-container-left"
      );
      // const collection2 = document.getElementsByClassName("spinal-other-container");
      // collection1[0].style.display = "none";
    }
    createDragElement(this.$refs.viewerContainerMini, this.$refs.headerViewer);
    EventBus.$on("data-mode", (data) => {
      this.dataMode = true;
      this.$refs.chart.toogleSelect(data);
    });
    EventBus.$on("inventory-mode", (data) => {
      this.inventoryMode = true;
      this.$refs.inventory.toogleSelect(data);
    });
    EventBus.$on("document-viewer-mode", (data) => {
      this.documentViewerMode = true;
      this.docviewerData = data;
      // this.$refs.documentViewer.toogleSelect(data);
    });
    // spinal-main-container-left
  },
  methods: {
    mobileSwitch() {
      const collection1 = document.getElementsByClassName(
        "spinal-main-container-left"
      );
      const collection2 = document.getElementsByClassName(
        "spinal-other-container"
      );
      if (this.showViewerMobile == true) {
        collection2[0].style.display = "none";
        collection1[0].style.display = "flex";
        // collection2[0].style.width = "0%"
        // collection1[0].style.width = "100%"
        this.showViewerMobile = false;
      } else {
        collection1[0].style.display = "none";
        collection2[0].style.display = "flex";
        // collection1[0].style.width = "0%"
        // collection2[0].style.width = "100%"
        this.showViewerMobile = true;
      }
    },
    matchMedia() {
      if (window.matchMedia("(max-width: 992px)").matches == true)
        return "mobile";
      else return "desktop";
    },
    onPopClick(event) {
      event.stopPropagation();
      this.absviewer = !this.absviewer;
      if (this.absviewer) {
        this.$refs.viewerContainerMini.append(this.$refs.viewerContent);
        this.$refs.viewerItem.handleMinized(false);
      } else {
        this.$refs.viewerContainer.append(this.$refs.viewerContent);
        this.hideViewer = false;
        this.$refs.viewerItem.handleMinized(true);
      }
    },
    onMiniClick(event) {
      event.stopPropagation();
      this.hideViewer = !this.hideViewer;
      if (!this.absviewer) {
        this.absviewer = !this.absviewer;
        this.$refs.viewerContainerMini.append(this.$refs.viewerContent);
        this.$refs.viewerItem.handleMinized(false);
      } else {
        this.$refs.viewerItem.handleMinized(false);
      }
    },
    onDataClick(event) {
      this.dataMode = !this.dataMode;
    },
    onInventoryClick(event) {
      this.inventoryMode = !this.inventoryMode;
    },
    onDocumentViewerClick(event) {
      this.documentViewerMode = !this.documentViewerMode;
    },
    openDataMode() {
      this.dataMode = !this.dataMode;
    },
    openInventoryMode() {
      this.inventoryMode = !this.inventoryMode;
    },
    openDocumentViewerMode() {
      this.documentViewerMode = !this.documentViewerMode;
    },
    expandData() {
      const collection1 = document.getElementsByClassName(
        "spinal-main-container-left"
      );
      const collection2 = document.getElementsByClassName(
        "spinal-other-container"
      );
      if (this.expanded == false) {
        for (let i1 = 0; i1 < collection1.length; i1++) {
          collection1[i1].style.width = "50%";
          // collection1[i1].style.width = "0%";
        }
        for (let i2 = 0; i2 < collection2.length; i2++) {
          collection2[i2].style.width = "50%";
          // collection2[i2].style.width = "100%";
        }
        this.expanded = true;
      } else {
        for (let i1 = 0; i1 < collection1.length; i1++) {
          collection1[i1].style.width = "67%";
          // collection1[i1].style.width = "100%";
        }
        for (let i2 = 0; i2 < collection2.length; i2++) {
          collection2[i2].style.width = "33%";
          // collection2[i2].style.width = "0%";
        }
        // this.expanded=false;
        this.expanded = false;
      }

      // this.expanded;
    },
    chooseExpandIcon() {
      if (this.expanded == false) return "el-icon-arrow-left";
      else return "el-icon-arrow-right";
    },
  },
};
</script>

<style>
.spinal-body-main-container {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  width: 100vw;
  overflow: hidden;
}
.appSelector {
  position: absolute;
  /* top:5px; */
  z-index: 1000;
}
.spinal-main-container,
.spinal-main-container .spinal-viewer-container,
.spinal-main-container .spinal-other-container {
  transition: 200ms all cubic-bezier(0.075, 0.82, 0.165, 1);
}
.spinal-main-container.have-abs-viewer {
  flex-direction: column;
}

.spinal-main-container.have-abs-viewer .spinal-main-container-left {
  width: 100%;
  height: unset;
}
.spinal-main-container.have-abs-viewer .spinal-other-container {
  width: 100%;
  flex-grow: 1;
  /* max-height: 100vh; */
  display: flex;
  flex-direction: column;
}

.spinal-other-container > div {
  width: 100%;
}
.spinal-viewer-header-drag-elm {
  flex: 1;
}
.spinal-main-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
}
.spinal-viewer-header-move-icon {
  align-self: center;
}
.spinal-viewer-container {
  height: 100%;
  width: 100%;
  background-color: #fdfdfd;
  position: relative;
  display: flex;
  flex-grow: 1;
}

.el-button.is-circle {
  background-color: #eaeef0;
}
.el-button.el-button-add {
  background-color: #14202c;
  color: #f9f9f9;
}
.el-button.el-button-delete {
  color: #ef5f32;
  border-color: #ef5f32;
}
.el-button.is-disabled {
  display: none;
}

@media screen and (max-width: 992px) {
  .spinal-viewer-container {
    height: 100%;
    width: 100%;
  }
  .spinal-other-container {
    /* height: 50%; */
    height: calc(100vh - 60px) !important;
    width: 100% !important;
    position: absolute;
    background-color: #f7f7f7;
    z-index: 1;
  }
  .spinal-main-container.have-abs-viewer .spinal-other-container {
    height: unset;
  }

  .spinal-main-container {
    flex-direction: column;
  }
  .spinal-main-container-left {
    /* height: 50%; */
    position: absolute;
    z-index: 0;
    width: 100% !important;
  }
}

.content-viewer-view {
  flex-grow: 1;
  height: calc(100% - 68px);
  position: relative;
  /* margin: 0px 5px 10px 10px; */
  background: transparent;
  border-radius: 4px;
  overflow: hidden;
}
.abs-viewer ~ .spinal-other-container {
  height: 100%;
  width: 100%;
  /* z-index: 0; */
}
.btn-abs-viewer-popio {
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 0 !important;
  padding: 0 !important;
}
.btn-abs-viewer-popio > .el-button {
  padding: 0 !important;
  height: 26px;
  width: 24px;
}
.btn-abs-viewer-mini {
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 0 !important;
}

.spinal-viewer-header-container {
  height: 28px;
  border: 1px solid;
  border-radius: 3px;
  width: 100%;
  cursor: move;
  position: relative;
  background-color: rgb(48, 49, 51);
  display: flex;
}

.viewer-content {
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.viewer-container-mini {
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  --minimized-viewer-width: 300px;
  --minimized-viewer-height: 200px;
  border-radius: 10px;
  z-index: 1;
  width: var(--minimized-viewer-width);
  height: var(--minimized-viewer-height);
  /* transition: all ease-out 0.5s; */
  /* -webkit-transition: all ease-out 0.5s; */
  /* -moz-transition: all ease-out 0.5s; */
  position: absolute;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  left: calc(100% - var(--minimized-viewer-width) - 8px);
  top: calc(100% - var(--minimized-viewer-height) - 8px);
}

.viewer-container-mini.hideViewer .viewer-content {
  display: none;
}
.viewer-container-mini.hideViewer {
  --minimized-viewer-width: 120px;
  --minimized-viewer-height: 30px;
  left: calc(100% - var(--minimized-viewer-width) - 8px);
  top: calc(100% - var(--minimized-viewer-height) - 58px);
  width: var(--minimized-viewer-width);
  height: var(--minimized-viewer-height);
}

.router-view {
  max-height: calc(100%- 60px);
}

*::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.__content *::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #14202c;
  border-radius: 10px;
  border: 3px solid #ffffff;
}

.spinal-main-container-left {
  height: 100%;
  width: 67%;
  /* width: 60%; */
  display: flex;
  flex-direction: column;
}
.spinal-other-container {
  width: 33%;
  /* width: 40%; */
  position: relative;
  display: flex;
  /* overflow: hidden; */
  flex-direction: column;
}
</style>
<style scoped>
/* .spinal-button-expand{
  padding: 0%;
  background-color: #fafafa;
  color:#606266;
  border-color: #dcdfe6;
} */
.spinal-button-expand:hover {
  background-color: #fafafa;
  /* color: #606266; */
  border-color: #dcdfe6;
}
.spinal-button-expand:focus {
  background-color: #fafafa;
  /* color: #606266; */
  border-color: #dcdfe6;
}
</style>
