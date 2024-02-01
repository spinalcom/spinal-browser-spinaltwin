<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="bouttons">
    <el-button
      title="Export Table"
      icon="el-icon-download"
      circle
      @click.stop="exportToExcel()"
    >
    </el-button>

    <el-button
      title="Color Items "
      icon="el-icon-picture-outline-round"
      circle
      @click.stop="SeeAll()"
    >
    </el-button>
    <el-button
      title="Isolate Items"
      icon="el-icon-aim"
      circle
      @click.stop="isolateAll()"
    >
    </el-button>
  </div>
</template>

<script>
import '../../backend/EventHandler';

export default {
  name: 'viewerBtn',
  components: {},
  props: ['nodeId'],

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
    };
  },
  mounted() {},
  methods: {
    exportToExcel() {},
  },
};
</script>

<style>
.bouttons {
  float: right;
  padding-bottom: 5px;
}
</style>
