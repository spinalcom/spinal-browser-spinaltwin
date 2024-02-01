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
        >{{ $t("node-type.close-chart") }}
      </md-button>
    </div>
    <div>
    <PDFViewer
      ref="pdfviewer"
      :source="srcP"
      style="height: calc(100vh - 60px); width: 100%"
      @download="handleDownload"
    />
    </div>
  </div>
</template>

<script>
import PDFViewer from "pdf-viewer-vue/dist/vue2-pdf-viewer";

export default {
  name: "DocumentViewerPanel",
  components: { PDFViewer },
  props: ["isDocumentViewerModalVisible", "openDocumentViewerModal"],
 
  data() {
    return {
      srcP: "",
    };
  },
  methods: {
    async toogleSelect(data) {
      this.srcP = data;
      // let element = this.$refs.pdfviewer.$refs.viewer.$refs.viewerScroller.children[0].children[0].children[0];
      // element.style.width = "100%";
      setTimeout(()=>{this.$refs.pdfviewer.$refs.viewer.handleResize()}, 2000);
    },
    handleDownload() {
      console.log ("DOWNLOAD HAS TO BE DONE")

    }/*,
    coucou(){
      this.$emit('close')
      // this.openDocumentViewerModal()
    }*/
  },
};
</script>

<style>
/* .document-viewer-panel
  .pdf-viewer
  .pdf-viewer__body
  .iframe
  .html
  .body
  .div
  .viewer-container
  .scroller.viewer
  .div {
  width: 100% !important;
} */
.document-viewer-panel {
  background-color: #fafafa;
  max-height: calc(100vh)
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

