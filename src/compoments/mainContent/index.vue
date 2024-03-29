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
  <div class="spinal-main-container" :class="{ 'have-abs-viewer': absviewer }">
    <div class="spinal-main-container-left">
      <spinalNavbar class="main-navbar"></spinalNavbar>
      <div
        v-show="!absviewer"
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
              <el-button icon="el-icon-minus" @click="onMiniClick"> </el-button>
              <el-button icon="el-icon-copy-document" @click="onPopClick">
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </div>
    <div class="spinal-other-container">
      <router-view></router-view>
    </div>
    <transition name="el-fade-in-linear">
      <div
        v-show="absviewer"
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
</template>

<script>
import createDragElement from "../../services/utlils/createDragElement";
import appViewer from "./viewer/viewer.vue";
import spinalNavbar from "../navbar/spinalNavbar.vue";

export default {
  name: "MainContent",
  components: {
    appViewer,
    spinalNavbar
  },
  data() {
    return {
      showLoadingModel: true,
      absviewer: false,
      hideViewer: false
    };
  },
  mounted() {
    createDragElement(this.$refs.viewerContainerMini, this.$refs.headerViewer);
    // eva.replace();
  },
  methods: {
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
    }
  }
};
</script>

<style>
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
.spinal-main-container-left {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
}
.spinal-other-container {
  width: 50%;
  position: relative;
  display: flex;
  overflow: auto;
}
@media screen and (max-width: 992px) {
  .spinal-viewer-container {
    height: 100%;
    width: 100%;
  }
  .spinal-other-container {
    height: 50%;
    width: 100%;
  }
  .spinal-main-container.have-abs-viewer .spinal-other-container {
    height: unset;
  }

  .spinal-main-container {
    flex-direction: column;
  }
  .spinal-main-container-left {
    height: 50%;
    width: 100%;
  }
}
.content-viewer-view {
  flex-grow: 1;
  height: calc(100% - 68px);
  position: relative;
  margin: 0px 5px 10px 10px;
  background: #fdfdfd;
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
</style>
