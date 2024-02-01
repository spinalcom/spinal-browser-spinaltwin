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
  <div class="content">
    <div class="md-caption">{{file.name}}</div>
    <div class="md-caption delete"
         @click="remove">X</div>
  </div>
</template>

<script>
export default {
  name: "attachment",
  props: ["file"],
  data() {
    return {};
  },
  methods: {
    remove() {
      this.$emit("remove", this.file);
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  font-weight: bold;
  justify-content: space-between;
}

.content .delete {
  margin-right: 30px;
}

.content .delete:hover {
  cursor: pointer;
}
</style>