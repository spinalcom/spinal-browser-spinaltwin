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
    <el-menu class="drawer-app-list"
             @select="menuSelect"
             background-color="transparent"
             :default-active="$route.name">
      <el-menu-item v-for="route in routes"
                    :index="route.name"
                    :key="route.path"
                    :route="route.path"
                    class="drawer-list-item"
                    v-ripple>
        <i class="el-icon-document drawer-list-item-icon"></i>
        <span>{{route.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { routes } from "../../../router/router";
export default {
  data() {
    return {
      routerTrue: true
    };
  },
  name: "appList",
  computed: {
    routes() {
      return routes.filter(e => !e.redirect);
    }
  },
  methods: {
    menuSelect(index) {
      if (this.$route.name !== index) {
        this.$router.push({
          name: index
        });
      }
    }
  }
};
</script>

<style scoped>
.drawer-app-list {
  border-right: none;
}
.drawer-list-item,
.drawer-list-item-icon {
  color: #1d3461;
}

.drawer-list-item.is-active {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.drawer-list-item.is-active:hover {
  background-color: rgb(204, 204, 204) !important;
}

.drawer-list-item.is-active span,
.drawer-list-item.is-active .drawer-list-item-icon {
  text-decoration: underline;
  /* color: #fff1e2; */
}
.drawer-list-item.is-active:hover span,
.drawer-list-item.is-active:hover .drawer-list-item-icon {
  color: #1d3461;
}
</style>
