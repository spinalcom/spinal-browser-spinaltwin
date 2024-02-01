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
  <div class="spinal-sidebar-container">
    <sidebarMenu
      ref="sidebarmenu"
      v-loading="loading"
      :title="title"
      :can-go-back="!!selected"
      :items="dataComputed"
      @goBack="goBack"
      @homeSelect="homeSelect"
      @selected="onSelect"
      @onMouseOver="onMouseOver"
    ></sidebarMenu>
    <hr />
    <a href="http://spinalcom.com/" target="_blank">
      <img
        src="../../assets/imgs/spinaltwin_logo_fond_phto_RVB.png"
        alt="spinalcore-poweredby"
      />
    </a>
  </div>
</template>

<script>
import sidebarMenu from './sidebarMenu.vue';
import { EventBus } from '../../services/event';

export default {
  name: 'Sidebar',
  components: { sidebarMenu },
  data() {
    return {
      data: [],
      selected: null,
      path: [],
      loading: true,
      title: '',
    };
  },
  computed: {
    dataComputed() {
      if (this.selected) {
        return this.selected.children;
      }
      return this.data;
    },
  },
  mounted() {
    this.updateTitleButton();
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on('side-bar-change', this.sideBarChangeBinded);
    EventBus.$emit('get-side-bar-floors-data');
  },
  methods: {
    updateTitleButton() {
      if (!this.selected) {
        if (this.building) {
          this.title = this.building.name;
        } else {
          this.title = this.$t('sidebar.topButton.buildingNameDefault');
        }
      } else {
        this.title = this.selected.name;
      }
    },
    sideBarChange(data, building) {
      this.loading = false;
      this.data = data;
      this.building = building;
      this.updateTitleButton();
    },
    onSelect(item) {
      if (!item.children) {
        EventBus.$emit('sidebar-selected-item', item);
        return;
      }
      this.path.push(item);
      this.selected = item;
      EventBus.$emit('sidebar-selected-item', item);
      this.updateTitleButton();
    },
    goBack() {
      this.path.pop();
      if (this.path.length === 0) {
        EventBus.$emit('sidebar-selected-item', null);
        this.selected = null;
      } else {
        this.selected = this.path[this.path.length - 1];
        EventBus.$emit('sidebar-selected-item', this.selected);
      }
      this.updateTitleButton();
      this.homeSelect();
    },
    homeSelect() {
      if (this.selected) {
        EventBus.$emit('sidebar-homeSelect', this.selected);
      } else {
        EventBus.$emit('sidebar-homeSelect');
      }
    },
    onMouseOver(item) {
      EventBus.$emit('sidebar-mouseover-item', item);
    },
  },
};
</script>

<style scoped>
.spinal-sidebar-container {
  height: 100%;
  background-color: #fdfdfd;
}
.spinal-sidebar-container hr {
  color: whitesmoke;
  margin: 0;
}
.spinal-sidebar-container img {
  width: 100%;
}
</style>
