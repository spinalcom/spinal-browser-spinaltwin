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
  <div class="spinal-navbar-main-container spinal-scrollbar">
    <el-collapse-transition>
      <div v-if="openMenu" class="nav-list-selector-container">
        <el-button
          class="button-icon-left-focus"
          type="default"
          icon="el-icon-office-building"
          @click="focusItem(building)"
        ></el-button>
        <navItem
          icon="el-icon-office-building"
          label="Etage"
          :items="levels"
          :select="selectedLevel"
          @focusItem="focusItem"
          @select="onLevelChange"
          @onMouseOver="onMouseOver"
        ></navItem>
        <navItem
          icon="el-icon-receiving"
          label="Local"
          :items="selectedLevelRooms"
          :select="selectedRoom"
          @focusItem="focusItem"
          @select="onRoomChange"
          @onMouseOver="onMouseOver"
        ></navItem>
        <!-- <el-button
          class="button-icon-left-focus"
          type="default"
          icon="mdi:rotate-3d"
          @click="focusItem(building)"
        ></el-button> -->
        <el-button v-if="switch3D !=undefined"
          class="button-icon-left-focus"
          type="default"
          icon="el-icon-map-location"
          @click="switch3D"
        ></el-button>
        <!-- <md-button class="md-icon-button">
          <md-icon>3d_rotation</md-icon>
        </md-button> -->
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { EventBus } from '../../services/event';
import navItem from './nav-Item.vue';
import { ViewManager } from '../../services/ViewManager/ViewManager';


export default {
  name: 'SpinalNavbar',
  components: { navItem },
  props: ["switch3D"],
  data() {
    return {
      levels: [],
      selectedLevelRooms: [],
      building: null,
      selectedLevel: null,
      selectedRoom: null,
      openMenu: true,
    };
  },
  mounted() {
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on('side-bar-change', this.sideBarChangeBinded);
    EventBus.$emit('get-side-bar-floors-data');
    EventBus.$on("contextNodeExplorer-onSelectItem", async item => {
      let noeud = FileSystem._objects[item.serverId];
      if(noeud != undefined){
        if(noeud.getType().get() == "geographicFloor"){
          let index = this.levels.findIndex(it => it.server_id == item.serverId);
          if(index != -1) this.onLevelChange(this.levels[index]);
        }
        else if(noeud.getType().get() == "geographicRoom"){
          let floor = await SpinalGraphService.getParents(noeud.getId().get(), "hasGeographicRoom");;
          if(this.selectedLevel != null){
            for(let flr of floor){
              if(flr.id.get() != this.selectedLevel.id){
                let i1 = this.levels.findIndex(l => l.id === flr.id.get());
                if(i1 !=-1){
                  let selectedRooms = this.onLevelChange(this.levels[i1], false);
                  let i2 = selectedRooms.findIndex(it => it.server_id == item.serverId);
                  if(i2 != -1) this.onRoomChange(selectedRooms[i2]);
                }
              }
              else{
                let index = this.selectedLevelRooms.findIndex(it => it.server_id == item.serverId);
                if(index != -1) this.onRoomChange(this.selectedLevelRooms[index]);
                
              }
            }
            
          }
          else{
            // let selectedRooms = this.onLevelChange(floor[0], false);
            // let index = selectedRooms.findIndex(it => it.server_id == item.serverId);
            // if(index != -1) this.onRoomChange(selectedRooms[index]);
            for(let flr of floor){
              let i1 = this.levels.findIndex(l => l.id === flr.id.get());
              if(i1 !=-1){
                let selectedRooms = this.onLevelChange(this.levels[i1], false);
                let i2 = selectedRooms.findIndex(it => it.server_id == item.serverId);
                if(i2 != -1) this.onRoomChange(selectedRooms[i2]);
              }
            }
            
            
          }
          
          
          // let index = this.selectedLevelRooms.findIndex(it => it.server_id == item.serverId);
          // if(index != -1) this.onRoomChange(this.selectedLevelRooms[index]);
        }
      }
      // let index = this.levels.findIndex(it => it.server_id == item.serverId);
      // if(index != -1) this.onLevelChange(this.levels[index]);
    });
    EventBus.$on("spinalNavbar.ask-room-list", () => {
      EventBus.$emit("spinalNavbar.room-list-sent", this.selectedLevelRooms);
    })
  },
  beforeDestroy() {
    EventBus.$off('side-bar-change', this.sideBarChangeBinded);
  },
  methods: {
    sideBarChange(data, building) {
      this.levels = data;
      this.building = building;
    },
    onLevelChange(level, isolate=true) {
      this.selectedLevel = level;
      this.selectedLevelRooms = level.children;
      this.selectedRoom = null;
      if(isolate = true){
        if (level) this.focusItem(level);
        else this.focusItem();
      }
      EventBus.$emit("spinalNavbar.room-list-sent", level.children)
      return level.children;
      
    },
    onRoomChange(room) {
      this.selectedRoom = room;
      if (room) this.focusItem(room);
      else this.focusItem(this.selectedLevel);
    },
    focusItem(item) {
      if (this.building === item) {
        this.selectedLevel = null;
        this.selectedRoom = null;
        EventBus.$emit('sidebar-homeSelect');
      } else EventBus.$emit('sidebar-homeSelect', item);
    },
    onMouseOver(item) {
      EventBus.$emit('sidebar-mouseover-item', item);
    },
  },
};
</script>

<style>
.spinal-navbar-main-container {
  min-height: 60px;
  max-height: 60px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); */
  display: flex;
  flex-wrap: nowrap;
  background: #fdfdfd;
  overflow-x: auto;
  overflow-y: visible;
  /* background-image: radial-gradient(circle at top left, #04092d, #1d3461); */
  /* background-image: radial-gradient(circle at top left, #494949, #58595b); */
  /* background-image: radial-gradient(
    circle at top left,
    #356bab,
    #2d3d93,
    #2d3d93,
    #2d3d93
  ); */
}
.bread {
  display: flex;
  align-self: center;
}
.bread-btn.bread-btn-opened i {
  padding: 8px;
}
.bread > * {
  align-self: center;
  padding: 0 3px;
  margin-top: 1em;
  margin-bottom: 1em;
}
.switch-menu-bread {
  align-self: center;
}
.nav-list-selector-container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding: 5px 0 5px 5px;

  background: #14202C 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border: 1px solid #F7F7F7;
  opacity: 1;
  border-radius: 5px;
  max-height: calc(100vh - 60px);
}
.bread-btn {
  display: flex !important;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 !important;
  color: #fff !important;
  background-color: #1d3461 !important;
  border-color: #1d3461 !important;
  background-image: radial-gradient(
    circle at top left,
    #04092d,
    #1d3461
  ) !important;
}
.bread-btn-opened {
  width: unset;
  border-color: #1e3461 !important;
  background-color: white !important;
  background-image: unset !important;
  color: #1e3461 !important;
}

.bread-btn > * {
  align-self: center;
}

@media screen and (max-width: 567px) {
  .nav-list-selector-container {
    flex-wrap: wrap;
    height: unset;
  }
  .spinal-navbar-main-container {
    height: unset;
  }
}

.nav-list-selector-container .button-icon-left-focus {
  margin: 5px;
  align-self: center;
  height: 38px;

  color: #f9f9f9;
  background: #14202C 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border: 1px solid #F7F7F7;
  opacity: 1;
}

</style>
