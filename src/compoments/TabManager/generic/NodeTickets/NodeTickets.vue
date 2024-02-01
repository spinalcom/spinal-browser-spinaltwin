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

<!--ATTENTION C'EST UN ONGLET DES AUTRES APPS, PAS DE TICKET APP-->

<template>
  <div>
    <el-container v-if="selected" >
      <node-tickets-selected
        :selected="selected"
        :stepping="stepping"
        :Properties="Properties"
        @update="update(Properties.view.serverId, true)"
        @back="selected = false"
      >
      </node-tickets-selected>
    </el-container>

    <el-container v-else-if="addingTicket">
      <ticket-declaration-form
        v-if="this.ctxNode"
        :node="this.ctxNode"
        :active.sync="addingTicket"
        @close="addingTicket = false"
        @update="update(Properties.view.serverId)"
      >
      </ticket-declaration-form>
    </el-container>

    <div v-else style="height: fit-content">
      <div class="spl-button-bar">
        <el-tooltip
          :content="$t('spinal-twin.TicketDeclare')"
          style="float: right"
        >
          <el-button
            @click.native="addingTicket = true"
            icon="el-icon-plus"
            circle
            class="el-button-add"
          ></el-button>
        </el-tooltip>
      </div>

      <div style="height: fit-content">
        <node-tickets-list
          v-if="tickets"
          :tickets="tickets"
          @select="select"
          @archive="archive"
          style="height: fit-content"
        >
        </node-tickets-list>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { spinalServiceTicket } from 'spinal-service-ticket';
import { LOGS_EVENTS } from 'spinal-service-ticket/src/Constants';
import { FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import NodeTicketsList from './NodeTicketsList.vue';
import NodeTicketsSelected from './NodeTicketsSelected.vue';
import TicketDeclarationForm from './TicketDeclarationForm.vue';
import { getTicketDescription } from './Ticket';
import {EventBus} from "../../../../services/event";

export default {
  name: 'NodeTickets',
  components: { NodeTicketsList, NodeTicketsSelected, TicketDeclarationForm },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      tickets: false,
      selected: false,
      addingTicket: false,
      stepping: false,
    };
  },

  computed: {
    userInfo() {
      return {
        username: 'admin',
        userId: FileSystem._user_id || '',
      };
    },
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          // await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    // this.update(this.Properties.view.serverId);
    EventBus.$on("click-on_spinal-twin.Tickets", () => this.update(this.Properties.view.serverId));

  },

  methods: {
    async update(id, keepSelected = false) {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];
      const node = await SpinalGraphService.findNode(
        this.ctxNode.info.id.get()
      );
      if (this.Properties && this.Properties.stepping) {
        this.stepping = this.Properties.stepping;
      }
      let ticketList = await spinalServiceTicket.getTicketsFromNode(
        node.id.get()
      );
      this.tickets = [];
      let arrayId = 0;
      for (let ticket of ticketList) {
        let ticketDesc = await getTicketDescription(ticket);
        ticketDesc.id = arrayId;
        ticketDesc.creation = this.elapsedTimeFormat(ticket.creationDate);
        ticketDesc.priority = this.$t(ticketDesc.priority);
        this.tickets.push(ticketDesc);
        arrayId += 1;
      }
      if (keepSelected) {
        this.select(this.tickets[this.selected.id]);
        return;
      }
      this.selected = false;
      this.addingTicket = false;
    },

    DateFormat(time) {
      const date = new Date(time);

      return moment(date, 'DD/MM/YYYY HH:mm:ss');
    },

    elapsedTimeFormat(time) {
      const now = new Date();
      const then = new Date(time);

      var ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
        moment(then, 'DD/MM/YYYY HH:mm:ss')
      );
      var d = moment.duration(ms);
      if (d.asDays() < 1) {
        return this.$t('spinal-twin.Today');
      } else if (d.asDays() < 2) {
        return this.$t('spinal-twin.Yesterday');
      }
      return Math.floor(d.asDays()) + this.$t('spinal-twin.DaysAgo');
    },

    logFormat(n) {
      return LOGS_EVENTS[n];
    },

    select(ticket) {
      this.selected = ticket;

    },

    async archive(ticket) {
      let realTicket = ticket.ticket;
      let contextId = await spinalServiceTicket.getTicketContextId(
        realTicket.id
      );
      if (ticket.step == 'Archived') {
        await spinalServiceTicket.unarchiveTicket(
          contextId,
          realTicket.processId,
          realTicket.id,
          this.userInfo
        );
        this.update(this.Properties.view.serverId);
        return;
      }
      await spinalServiceTicket.ArchiveTickets(
        contextId,
        realTicket.processId,
        realTicket.id,
        this.userInfo
      );
      this.update(this.Properties.view.serverId);
    },
  },
};
</script>

<style scoped>
.spl-button-bar {
  overflow: hidden;
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}

.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 0;
}

.columnize {
  display: flex;
  flex-direction: column;
}

.rowify {
  display: flex;
  flex-direction: row;
}
</style>
<style>
/* .node-tickets-list{
  max-height: 40vh;
  overflow-y:scroll;
} */
</style>
