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
  <div class="document-viewer-panel">
    <div class="document-viewer-panel-button-group">
      <md-button
        style="background: red"
        class="document-viewer-panel-button-close"
        @click="openDocumentViewerModal"
        >{{ $t('node-type.close-chart') }}
      </md-button>
    </div>
    <div style="position: relative; height: calc(100vh - 60px); width: 100%">

      <PDFViewer v-if="data.type == 'pdf'"
        ref="pdfviewer"
        :source="data.document"
        :controls="['print','rotate','zoom','catalog']"
        style="height: 100%; width: 100%"
      />
      <iframe v-if="data.type == 'other'"
        ref="documentViewer"
        :src="data.document"
        style="height: calc(100vh - 60px); width: 100%; max-height: calc(100vh - 60px); max-width: 100%"
        frameborder="0"
        scrolling="yes"
        charset="utf-8"
    ></iframe>
    </div>
  </div>
</template>

<script>
import PDFViewer from 'pdf-viewer-vue/dist/vue2-pdf-viewer';

export default {
  name: 'DocumentViewerPanel',
  components: { PDFViewer },
  props: ['isDocumentViewerModalVisible', 'openDocumentViewerModal', 'data'],
  mounted(){
  },

  data() {
    return {
      srcP: '',
      type:'',
    };
  },
  methods: {
    handleDownload() {
    },
  },
};
</script>

<style>
.document-viewer-panel {
  background-color: #fafafa;
  max-height: calc(100vh);
}
.document-viewer-panel-button-group {
  display: flex;
  justify-content: flex-end;
  height: 60px;
}
.document-viewer-panel-button-close {
  width: fit-content;
}
</style>