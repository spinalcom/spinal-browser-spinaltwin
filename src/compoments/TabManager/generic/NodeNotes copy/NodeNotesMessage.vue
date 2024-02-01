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
  <el-container style="padding: 0 0 10px 0">
    <el-header class="spl-chat-header" style="height: min-content">
      <b>
        {{ username }}
      </b>
      , {{ DateFormat(date) }}
    </el-header>

    <el-main class="spl-chat-box">
      {{ message }}
      <img
        v-if="(type == 'img' || type == 'view') && image != false"
        :src="`/sceen/_?u=${image}`"
        alt="image"
        class="spl-message-image"
      />
      <i
        v-else-if="type == 'img' || type == 'view'"
        class="el-icon-document-delete"
      ></i>
    </el-main>

    <div>
      <!-- <el-button
        v-if="type == 'img' || type == 'view' || type == 'file'"
        v-on:click.native="downloadImage()"
        type="primary"
        square
        style="width: min-content"
      > -->
      <el-button
        v-if="type == 'img' || type == 'file'"
        v-on:click.native="downloadImage()"
        type="primary"
        square
        style="width: min-content"
      >
        {{ $t('spinal-twin.NoteDownload') }}
      </el-button>
      <el-button
        v-if="type == 'view'"
        v-on:click.native="restoreView()"
        type="primary"
        square
        style="width: min-content"
      >
        {{ $t('spinal-twin.NoteRestore') }}
      </el-button>
    </div>
  </el-container>
</template>

<script>
import moment from 'moment';

export default {
  name: 'NodeNotesMessage',
  props: {
    username: { type: String, required: true },
    date: { type: Number, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    file: { type: Object, required: true },
    viewPoint: { type: Object, required: false, default: null },
  },

  data() {
    return {
      image: false,
    };
  },

  mounted() {
    this.getImage();

  },

  methods: {
    DateFormat(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },

    async waitimageReady(path) {
      return new Promise((resolve) => {
        const aibe = setInterval(() => {
          if (path.remaining.get() === 0) {
            clearInterval(aibe);
            return resolve();
          }
        }, 500);
      });
    },

    getImage() {
      if (!this.file.load) {
        return;
      }
      this.file.load((f) => {
        if (typeof f === 'undefined') {
          return;
        }
        f.load(async (l) => {
          await this.waitimageReady(l);
          this.image = f._ptr.data.value;
          this.image_name = f.name.get();
        });
      });
    },

    restoreView() {
      const viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
      if (Object.keys(this.viewPoint).length === 0) return;
      const viewStateString = this.viewPoint.viewState.get();
      const objectStateString = this.viewPoint.objectState.get();
      const viewState = JSON.parse(viewStateString);
      const objectState = JSON.parse(objectStateString);
      viewer.restoreState(viewState);
      this.selection(viewer, objectState.selected);
      this.isolate(viewer, objectState.isolated);
    },

    isolate(viewer, items) {
      const bimObjectService = window.spinal.BimObjectService;
      items.map((el) => {
        const bimFileId =
          bimObjectService.mappingModelIdBimFileId[el.modelId].bimFileId;
        const model = spinal.BimObjectService.getModelByBimfile(bimFileId);
        viewer.impl.visibilityManager.isolate(el.ids, model);
      });
    },

    selection(viewer, items) {
      const bimObjectService = window.spinal.BimObjectService;
      items.map((el) => {
        const bimFileId =
          bimObjectService.mappingModelIdBimFileId[el.modelId].bimFileId;
        const model = spinal.BimObjectService.getModelByBimfile(bimFileId);
        model.selector.setSelection(el.selection, model, 'selectOnly');
      });
    },

    downloadImage() {
      var element = document.createElement('a');
      element.setAttribute('href', '/sceen/_?u=' + this.image);
      element.setAttribute('download', this.image_name);
      element.click();
    },
  },
};
</script>

<style scoped>
.spl-message-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  float: right;
}

.spl-chat-box {
  border: 2px solid transparent;
  background-color: #dedede;
  border-radius: 5px;
  padding: 10px;
  margin: 0;
  display: inline-block;
  width: 100%;
}

.spl-chat-header {
  border: 0 0 2px 0 solid transparent;
  border-radius: 5px 5px 0px 0px;
  height: min-content;
}
</style>
