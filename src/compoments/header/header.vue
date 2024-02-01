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
  <div class="spinal-header-container">
    <div>
      <img
        v-for="logo in logos"
        class="spinal-header-logo"
        :src="logo.src"
        :key="logo.name"
        :alt="logo.name"
      />
    </div>
    <div v-ripple class="menu-icon-header-container" @click="drawer = true">
      <i
        data-eva="keypad-outline"
        data-eva-animation="zoom"
        data-eva-height="24"
        data-eva-width="24"
      ></i>
    </div>
    <el-drawer
      class="spinal-drawer"
      :visible.sync="drawer"
      :with-header="false"
    >
      <drawer @close="drawer = false"></drawer>
    </el-drawer>
  </div>
</template>

<script>
import { getDefaultLanguage, loadLanguageAsync } from './../../services/i18n';
import drawer from '../drawer/drawer.vue';
import spinalimg from '../../assets/imgs/spinaltwin_logo_fond_phto_RVB.png';
export default {
  name: 'spinal-header',
  components: { drawer },
  data() {
    return {
      drawer: false,
      logos: [],
    };
  },
  created() {
    this.logos.push({ src: spinalimg, name: 'spinalcom' });
    getDefaultLanguage().then((lang) => {
      this.currentLang = lang;
    });
  },
  mounted() {},
  methods: {
    toLocaleLowerCase(str) {
      return str.toLocaleLowerCase();
    },
    setLang(lang) {
      loadLanguageAsync(lang.toLocaleLowerCase());
      this.currentLang = lang;
    },
  },
};
</script>

<style scoped>
.spinal-header-container {
  height: 60px;
  display: flex;
  align-self: auto;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.spinal-header-logo {
  align-self: auto;
  height: 55px;
}

.menu-icon-header-container > i {
  line-height: 0px;
}
.menu-icon-header-container {
  height: 24px;
  cursor: pointer;
  padding-right: 8px;
}

.spinal-header-container > * {
  display: flex;
  align-self: center;
}
</style>
