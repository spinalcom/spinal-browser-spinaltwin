<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <div class="spinaltwin-nav-bar">
    <el-button
      class="nav-bar-expand"
      :icon="chooseExpandIcon()"
      size="small"
      @click="expandData()"
    ></el-button>
    <el-button
      class="nav-button"
      icon="el-icon-menu"
      v-if="expanded"
    ></el-button>
    <img class="image-spinalcom" :src="logo" v-if="expanded" />
    <div class="application-selection-group" v-if="expanded">
      <div class="application-selection-label" v-if="expanded">APPLICATION</div>
      <el-select
        class="application-selection"
        v-model="currentRoute"
        @change="menuSelect(currentRoute)"
        v-if="expanded"
      >
        <el-option
          v-for="route in routes"
          :key="route.path"
          :label="route.name"
          :value="route.name"
        >
          <span>{{ $t('Routes.' + route.name) }}</span>
        </el-option>
      </el-select>
      <!-- <v-select
          :items="['Foo', 'Bar', 'Fizz', 'Buzz']"
          :menu-props="{ bottom: true, offsetY: true }"
          label="Label"
        ></v-select> -->

      <!-- <el-menu-item
        v-for="route in routes"
        :index="route.name"
        :key="route.path"
        :route="route.path"
        class="drawer-list-item"
        v-ripple
      >
        <span>{{ $t('Routes.' + route.name) }}</span>
      </el-menu-item> -->
    </div>
  </div>
</template>

<script>
import { routesFromApi } from '../../../router/router';
import { EventBus } from '../../../services/event';

export default {
  name: 'appSelector',
  props: {},
  data() {
    return {
      logo: require('../../../assets/imgs/spinalcom_logo_RVB.png'),
      currentRoute: this.$route.name,
      expanded: true,
      routes: [],
    };
  },

  async mounted() {
    const { routesDrawer } = await routesFromApi;
    this.routes = routesDrawer.filter((e) => !e.redirect);
    this.currentRoute = this.$route.name;
  },
  watch: {
    $route() {
      this.currentRoute = this.$route.name;
    },
  },

  methods: {
    // async update() {},
    menuSelect(index) {
      EventBus.$emit('application-change', index);
      if (this.$route.name !== index) {
        this.$router.push({
          name: index,
        });
      }
    },
    chooseExpandIcon() {
      if (this.expanded == true) return 'el-icon-arrow-left';
      else return 'el-icon-arrow-right';
    },
    expandData() {
      const collection = document.getElementsByClassName('spinaltwin-nav-bar');
      for (let i1 = 0; i1 < collection.length; i1++) {
        if (this.expanded == false) {
          collection[i1].style['padding-right'] = '10px';
        } else {
          collection[i1].style['padding-right'] = '0px';
        }
      }
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style scoped>
.nav-bar-expand {
  width: 20px;
  height: 60px;
  border-color: transparent;
}

.spinaltwin-nav-bar {
  /* display: none; */
  display: flex;

  height: 60px;
  max-width: 440px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 10px #49545c29;
  border: 1px solid #f7f7f7;
  border-radius: 0px 10px 10px 0px;
  opacity: 1;
  flex-direction: row;
  align-items: center;
  /* padding-left: 10px; */
  padding-right: 10px;
}
.image-spinalcom {
  height: 40px;
  width: auto;
  align-self: center;
}
.application-selection-group {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
.application-selection-label {
  text-align: left;
  /* font: normal normal normal 7px/8px Charlevoix Pro; */
  font-size: 8px;
  font-family: charlevoix sans-serif;
  letter-spacing: 1px;
  color: #14202c;
  opacity: 1;
  height: 14.5px;
  padding-left: 10px;
}
.nav-button {
  height: 40px;
}
</style>
<style>
.nav-bar-expand.el-button--default.el-button--small {
  padding-right: 0px;
  padding-left: 0px;
  width: fit-content;
}
</style>
