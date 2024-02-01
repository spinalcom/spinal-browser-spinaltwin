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
  <el-container>
    <el-header>
      <el-tooltip :content="$t('spinal-twin.Back')">
        <el-button
          @click="close"
          style="float: left; margin: 0 10px"
          icon="el-icon-arrow-left"
          circle
        >
        </el-button>
      </el-tooltip>
      <h2>
        {{ event.title }}
      </h2>
    </el-header>

    <el-main>
      <h3> Details </h3>
      <div class="separate">
        <p> Period </p>
        <p> {{ _formatDate(event.start) }} - {{ _formatDate(event.end) }} </p>
      </div>
      <el-tooltip :content="$t('spinal-twin.EventDelete')">
        <el-popconfirm
          @confirm="deleteEvent()"
          :title="$t('spinal-twin.DeleteConfirm')"
        >
          <el-button
            icon="el-icon-delete"
            type="danger"
            circle
            slot="reference"
          ></el-button>
        </el-popconfirm>
      </el-tooltip>
    </el-main>
  </el-container>
</template>

<script>
import { SpinalEventService } from 'spinal-env-viewer-task-service';

export default {
  name: 'NodeCalendarEventDetails',
  components: {},
  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      eventNode: false,
    };
  },

  async mounted() {},

  methods: {
    async deleteEvent() {
      await SpinalEventService.removeEvent(this.event.id);
      this.$emit('update');
    },

    close() {
      this.$emit('close');
    },

    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
  },
};
</script>

<style scoped>
.separate {
  display: flex;
  justify-content: space-between;
}
</style>
