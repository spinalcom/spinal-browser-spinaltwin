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
  <div class="pull-right" >
    <el-button type="primary"
               icon="el-icon-download"
               @click="download">

      Download
    </el-button>

    <el-button type="primary"
               icon="el-icon-position"
               v-if="displayBtn()"
               @click="restoreState">

      Restore viewpoint
    </el-button>
  </div>
</template>

<script>
export default {
  name: "actionsBtn",
  props: ["hover", "viewPoint"],
  methods: {
    displayBtn() {
      console.log(this.viewPoint);
      if (
        this.viewPoint &&
        this.viewPoint.hasOwnProperty("viewState") &&
        this.viewPoint.hasOwnProperty("objectState")
      )
        return true;
      return false;
    },
    download() {
      this.$emit("download");
    },
    restoreState() {
      this.$emit("restoreState");
    }
  }
};
</script>