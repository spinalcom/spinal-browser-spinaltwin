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
    <el-header v-if="!addingEvent && !selectedEvent">
      <el-tooltip :content="$t('spinal-twin.EventAdd')"></el-tooltip>
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        type="primary"
        circle
        @click="addingEvent = true"
      >
      </el-button>
    </el-header>
    <node-calendar-event-create
      v-if="addingEvent"
      :nodeId="ctxNode._server_id"
      @reload="update(Properties.view.serverId)"
      @cancel="addingEvent = false"
    ></node-calendar-event-create>
    <node-calendar-event-details
      v-else-if="selectedEvent"
      :event="selectedEvent"
      @close="selectedEvent = false"
      @update="update(Properties.view.serverId)"
    ></node-calendar-event-details>
    <el-main v-else-if="ctxNode && events">
      <node-calendar-table
        :events="events"
        @select="select"
        :ref="'calendarTable'"
      ></node-calendar-table>
    </el-main>
  </el-container>
</template>

<script>
// imports
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { SpinalEventService } from 'spinal-env-viewer-task-service';

import NodeCalendarTable from './NodeCalendarTable.vue';
import NodeCalendarEventCreate from './NodeCalendarEventCreate.vue';
import NodeCalendarEventDetails from './NodeCalendarEventDetails.vue';

export default {
  name: 'NodeCalendar',
  components: {
    NodeCalendarTable,
    NodeCalendarEventCreate,
    NodeCalendarEventDetails,
  },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      addingEvent: false,
      selectedEvent: false,
      events: false,
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async loadCalendar() {
      this.events = await SpinalEventService.getEvents(
        this.ctxNode.getId().get()
      ).then((rest) => {
        return rest.map((el) => {
          const event = el.get();
          return {
            title: event.name,
            start: this._formatDate(event.startDate),
            end: this._formatDate(event.endDate),
            class: event.groupId,
            id: event.id,
            event: event,
          };
        });
      });
    },

    async update(id) {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];
      await this.loadCalendar();
      this.addingEvent = false;
      this.selectedEvent = false;
    },

    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    select(event) {
      this.selectedEvent = event;
    },
  },
};
</script>
