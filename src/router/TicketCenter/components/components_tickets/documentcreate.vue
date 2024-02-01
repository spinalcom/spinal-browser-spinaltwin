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
  <div>
    <el-button
      title="Add Document"
      plain
      type="primary"
      icon="el-icon-circle-plus-outline"
      circle
      @click="addPJ"
    >
    </el-button>
  </div>
</template>

<script>
import { FileExplorer } from 'spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer';

export default {
  data() {
    return {
      contextLst: [],
      documents: [],
    };
  },
  name: 'documentCreate',
  components: {},
  props: ['nodeId'],
  methods: {
    addPJ() {
      const maxSize = 25000000;
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.click();
      input.addEventListener(
        'change',
        (event) => {
          const files = event.target.files;
          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }
          // filelist.push(...this.messages.pj);
          const sizes = filelist.map((el) => el.size);
          const filesSize = sizes.reduce((a, b) => a + b);
          if (filesSize > maxSize) {
            alert(
              'The selected file(s) is too large. The maximum size must not exceed 25 MB'
            );
            return;
          }
          // this.messages.pj = filelist;
          FileExplorer.addFileUpload(this.documents, filelist);
          this.$emit('reload');
        },
        false
      );
    },
  },
  async mounted() {
    this.documents = await FileExplorer.createDirectory(
      FileSystem._objects[this.nodeId]
    );
  },

  watch: {},
  beforeDestroy() {},
};
</script>
