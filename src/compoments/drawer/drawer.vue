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
  <div class="drawer-content">
    <div class="drawer-main-header">
      <div v-ripple class="menu-icon-header-container" @click="$emit('close')">
        <i
          data-eva="arrow-ios-back-outline"
          data-eva-animation="zoom"
          data-eva-fill="#fff"
          data-eva-height="24"
          data-eva-width="24"
        ></i>
      </div>
      <langSelector></langSelector>
    </div>
    <div class="drawer-main-content spinal-scrollbar">
      <appList></appList>
    </div>
    <!-- <div class="drawer-main-footer">
      <a href="http://spinalcom.com/"
         target="_blank">
        <img class="spinalcore-poweredby-image"
             src="../../assets/imgs/spinaltwin_logo_fond_phto_RVB.png" />
      </a>
    </div> -->
  </div>
</template>

<script>
import langSelector from './langSelector/langSelector.vue';
import appList from './appList/appList.vue';

export default {
  data() {
    return {};
  },
  name: 'drawer',
  components: { langSelector, appList },
  mounted() {
    eva.replace();
  },
};
</script>

<style scoped>
.spinalcore-poweredby-image {
  padding: 0;
  height: 56px;
}
</style>

<style>
.drawer-content {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.drawer-main-header {
  background-color: #1f487e;
  background-image: radial-gradient(circle at top left, #444, #222);
  height: 56px;
  width: 100%;
  position: relative;
  display: flex;
  color: #fff;
  justify-content: space-between;
}
.drawer-main-header > * {
  align-self: center;
  padding: 8px;
}
.drawer-content .drawer-main-content {
  height: calc(100% - 112px);
  width: 100%;
  position: relative;
  overflow: auto;
  background-color: #fafafa;
  /* background-image: radial-gradient(
    circle at top right,
    #6290c8,
    #829cbc,
    #829cbc
  ); */
}
.drawer-content .drawer-main-content:last-child {
  height: calc(100% - 56px);
}
.drawer-main-footer {
  height: 56px;
  width: 100%;
  position: relative;
  background-color: #222;
  background-image: radial-gradient(circle, #444, #222);
  display: flex;
  justify-content: center;
}
/* .drawer-main-footer > * {
  align-self: flex-end;
  padding-bottom: 8px;
} */
.menu-icon-header-container {
  cursor: pointer;
}
</style>
