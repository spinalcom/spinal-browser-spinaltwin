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
  <div v-loading="loading" class="side-bar-compomenet-container">
    <div class="side-bar-header-container">
      <el-button
        class="button-icon-building-focus"
        type="info"
        icon="el-icon-s-home"
        size="small"
      >
        {{ buildingName }}
      </el-button>
    </div>
    <el-menu
      ref="sideBarMenu"
      class="spinal-side-bar-menu spinal-scrollbar"
      background-color="#303133"
      :collapse="collapse"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="uniqueOpened"
      @select="onSelect"
      @open="onOpen"
      @close="onClose"
    >
      <el-popover
        v-for="floor in data"
        :key="floor.id"
        placement="right"
        trigger="hover"
        :content="floor.name"
      >
        <el-submenu slot="reference" :index="floor.id">
          <template slot="title">
            <span>{{ floor.name }}</span>
          </template>
          <el-popover
            v-for="room in floor.children"
            :key="room.id"
            placement="right"
            trigger="hover"
            :content="room.name"
          >
            <el-menu-item
              slot="reference"
              :class="{
                'side-bar-selected-room-item': room.id === roomIdSelected,
              }"
              :index="room.id"
            >
              <template slot="title">
                <span>{{ room.name }}</span>
              </template>
            </el-menu-item>
          </el-popover>
        </el-submenu>
      </el-popover>
    </el-menu>
  </div>
</template>

<script>
import { EventBus } from '../../services/event';

export default {
  name: 'SidebarFloorList',
  data() {
    return {
      loading: true,
      activeName: '',
      data: [],
      building: null,
      uniqueOpened: true,
      floorIdSelected: '',
      roomIdSelected: '',
      collapse: false,
    };
  },
  computed: {
    buildingName() {
      if (this.building) {
        return this.building.name;
      } else {
        return 'Batiment';
      }
    },
  },
  mounted() {
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on('side-bar-change', this.sideBarChangeBinded);
    EventBus.$emit('get-side-bar-floors-data');
  },
  beforeDestroy() {
    EventBus.$off('side-bar-change', this.sideBarChangeBinded);
  },
  methods: {
    onSelect(a, [floorId, roomId]) {
      this.roomIdSelected = roomId;
      EventBus.$emit(
        'sidebar-selected-floor',
        this.getRoomFromFloorId(floorId, roomId)
      );
    },
    onOpen(floorId) {
      EventBus.$emit('sidebar-selected-floor', this.getFloorById(floorId));
    },
    onClose(floorId) {
      EventBus.$emit('sidebar-selected-floor', this.getFloorById(floorId));
    },
    sideBarChange(data, building) {
      this.loading = false;
      this.data = data;
      this.building = building;
    },
    onSelectFloor(floor) {
      // this.$emit("selected-floor", floor);
      this.roomIdSelected = null;
      this.floorIdSelected = floor.id;
      EventBus.$emit('sidebar-selected-floor', floor);
    },
    getFloorById(id) {
      for (const floor of this.data) {
        if (floor.id === id) return floor;
      }
    },
    getRoomFromFloorId(floorId, roomId) {
      const floor = this.getFloorById(floorId);
      for (const room of floor.children) {
        if (room.id === roomId) return room;
      }
    },
  },
};
</script>

<style scoped>
.side-bar-compomenet-container {
  height: 100%;
}
.side-bar-header-container {
  display: flex;
  align-self: auto;
  height: 56px;
  /* line-height: 56px; */
  background-color: #1d3461;
  background-image: radial-gradient(circle at bottom, #3646b1, #1d3461);
  /* color: white; */
  justify-content: center;
}
/* .side-bar-header-container > * {
  display: flex;
  align-self: center;
  margin-left: 5px;
}
.side-bar-header-container > h4 {
  margin-left: 8px;
} */
.spinal-side-bar-menu {
  height: calc(100% - 56px);
  border-right: none !important;
  overflow: auto;
}

.side-bar-header-container .button-icon-building-focus {
  background: white;
  color: #1d4b5e;
  padding: 5px !important;
  align-self: center;
  display: flex;
  margin: 0 4px;
  max-width: calc(100% - 8px);
}
</style>

<style>
.side-bar-header-container .button-icon-building-focus span {
  align-self: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.side-bar-header-container .button-icon-building-focus i {
  align-self: center;
  font-size: 20px;
}
.spinal-side-bar-menu li.el-submenu.is-opened > .el-submenu__title {
  background-color: #8cc5ff !important;
  color: black !important;
}
.spinal-side-bar-menu li.el-menu-item.side-bar-selected-room-item {
  background-color: #909398 !important;
  padding-right: 10px;
  color: black !important;
}
.spinal-side-bar-menu li.el-submenu:focus {
  outline: none;
}
.spinal-side-bar-menu li.el-submenu > .el-menu {
  background-color: #e5eefc;
}
.spinal-side-bar-menu li.el-submenu > .el-menu .el-menu-item {
  padding-right: 10px;
}

.spinal-side-bar-menu li.el-submenu.is-opened > .el-submenu__title i {
  color: black !important;
}

.spinal-side-bar-menu .el-submenu__title:hover,
.spinal-side-bar-menu .el-menu-item:hover {
  /* background-color: #606266 !important; */
  color: black !important;
}
.spinal-side-bar-menu .el-submenu__title:hover i,
.spinal-side-bar-menu .el-menu-item:hover i {
  color: black !important;
}
</style>
