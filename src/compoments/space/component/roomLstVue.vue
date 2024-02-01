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
  <el-row>
    <el-table
      :data="rooms"
      class="tab"
      border
      style="width: 100%"
      :header-cell-style="{ 'background-color': '#f0f2f5' }"
      @row-click="SeeEvent"
    >
      <el-table-column prop="name" label="Nom" align="center">
      </el-table-column>

      <el-table-column prop="surface" label="Surface (m²)" align="center">
        <template slot-scope="scope">
          {{ scope.row.surface | roundSurface }}
        </template>
      </el-table-column>
      <el-table-column label="" width="65" align="center">
        <template slot-scope="scope">
          <el-button
            v
            icon="el-icon-arrow-right"
            circle
            @click.stop="PaPie(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <room-data v-else
               :nodeId="nodeId"></room-data> -->
  </el-row>
</template>

<script>
// import { EventBus } from "../../../services/event";
import RoomData from '../component/RoomData.vue';
export default {
  components: { 'room-data': RoomData },
  props: ['rooms', 'color'],
  data() {
    return {
      contextLst: [],
      TabRoom: false,
      nodeId: undefined,
    };
  },
  filters: {
    roundSurface(surface) {
      return Math.round(surface * 100) / 100;
    },
  },
  watch: {
    // roomSelected() {
    //   this.rooms = this.roomSelected.rooms;
    // }
  },
  async mounted() {
    // this.rooms = this.roomSelected.rooms;
  },
  beforeDestroy() {},
  methods: {
    SeeEvent(data) {
      this.$emit('seeEvent', { rooms: [data], color: this.color });
    },
    SeeAll() {
      this.$emit('seeEvent', { rooms: this.rooms, color: this.color });
    },
    PaPie(roo) {
      this.TabRoom = true;
      this.nodeId = roo.id;
      this.$emit('addBreadcrumb', {
        name: roo.name,
        roomNodeId: roo.id,
        click: () => {},
      });
    },
    resetTabRoom() {
      this.TabRoom = false;
    },
  },
};
</script>
