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
  <div class="ticket-selected-main-container" v-if="ticket != undefined">
    <div class="ticket-presentation">
      <el-tooltip
        v-if="Properties.viewKey != 'TicketApp'"
        :content="$t('spinal-twin.Back')"
      >
        <el-button
          @click.stop="back()"
          class="spl-el-button"
          style="float: right"
          icon="el-icon-search"
          circle
        >
        </el-button>
      </el-tooltip>

      <div class="ticket-name">{{ ticket.name }}</div>
      <!-- <div v-if="ticket != undefined" class="ticket-name" >{{ ticket.name }}</div>
      <div v-else class="ticket-name" >N.C</div> -->
      <!-- <div class="ticket-row-card">
        <div class="ticket-label-information">Priorité :</div>
        <div class="ticket-label-value">{{ ticket.priority || "0" }}</div>
      </div> -->
      <el-select
        v-model="ticket.step"
        class="ticket-steps"
        @change="changeStep2(ticket.step)"
      >
        <el-option
          v-for="item in ticket.steps"
          :key="item.id.get()"
          :label="item.name.get()"
          :value="item.id.get()"
        />
      </el-select>
    </div>
    <div class="ticket-creation-informations">
      <div class="ticket-row-card">
        <div class="ticket-label-information">
          {{ $t("spinal-twin.Priority") }}
        </div>
        <div class="ticket-label-value">{{getTicketPriority(ticket.ticket.priority)}}</div>
      </div>
      <div class="ticket-row-card">
        <div class="ticket-label-information">
          {{ $t("spinal-twin.TicketAuthor") }}
        </div>
        <div class="ticket-label-value">
          {{
            (ticket.ticket.user &&
              (ticket.ticket.user.name || ticket.ticket.user.username)) ||
            "N.C"
          }}
        </div>
      </div>
    </div>

    <div class="ticket-creation-informations">
      <div class="ticket-row-card">
        <div class="ticket-label-information">
          {{ $t("spinal-twin.CreationTime") }}
        </div>
        <div class="ticket-label-value">
          {{ DateFormat(ticket.creationDate) }}
        </div>
      </div>
      <!-- <div class="ticket-row-card">
        <div class="ticket-label-information">Par</div>
        <div class="ticket-label-value">
          {{
            (ticket.ticket.user &&
              (ticket.ticket.user.name || ticket.ticket.user.username)) ||
            "unknow"
          }}
        </div>
      </div> -->
    </div>
    <div class="ticket-target-informations">
      <div class="ticket-row-card">
        <div class="ticket-label-information">
          {{ $t("spinal-twin.Target") }}
        </div>
        <div class="ticket-label-value">
          <!-- <div>{{ ticket.target.name + " (" + ticket.target.type + ")" }}</div> -->
          <div>{{ ticket.target.name }}</div>
        </div>
      </div>
      <div class="spl-button-bar">
        <el-tooltip :content="$t('spinal-twin.Isolate')">
          <el-button
            @click="isolateTarget(ticket.target.nodeId)"
            class="spl-el-button"
            icon="el-icon-aim"
            size="small"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip v-if="Properties.viewKey == 'TicketApp'" :content="$t('spinal-twin.open-in-dataroom')">
          <el-button
            @click="openInDataRoom(ticket.target.nodeId)"
            class="spl-el-button"
            icon="el-icon-arrow-right"
            size="small"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <!-- parents informations -->
    <div
      class="ticket-target-parent-informations"
      v-if="ticket.target.isGeographic == true"
    >
      <div class="ticket-row-card">
        <div class="ticket-label-information">
          {{ $t("spinal-twin.Target-parent") }}
        </div>
        <div class="ticket-label-value">
          <div>{{ ticket.target.parent.name.get() }}</div>
        </div>
      </div>
      <div class="spl-button-bar">
        <el-tooltip :content="$t('spinal-twin.Isolate')">
          <el-button
            @click="isolateTarget(ticket.target.parent.id.get())"
            class="spl-el-button"
            icon="el-icon-aim"
            size="small"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip v-if="Properties.viewKey == 'TicketApp'" :content="$t('spinal-twin.open-in-dataroom')">
          <el-button
            @click="openInDataRoom(ticket.target.parent.id.get())"
            class="spl-el-button"
            icon="el-icon-arrow-right"
            size="small"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="ticket-description">
      <div class="ticket-label-information">Description</div>
      <!-- <div class="ticket-label-value">{{ ticket.ticket.description || "unknown"}}</div> -->
      <div class="ticket-label-value">
        <div class="description">
          <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam. -->
          {{ ticket.ticket.description || "unknown" }}
        </div>
      </div>
    </div>
    <!-- <div class="ticket-notes-and-events"> -->
    <el-collapse v-model="activeCollapses">
      <!-- <div class="ticket-events"> -->
      <el-collapse-item
        class="ticket-events"
        name="Events"
        :title="$t('spinal-twin.Events')"
      >
        <!-- <div class="ticket-label-information">Events :</div> -->
        <el-table
          :data="ticket.events"
          :header-cell-style="{
            'background-color': '#ffffff',
            'text-align': 'left',
            'letter-spacing': '1px',
            color: '#214353',
            opacity: '1',
            height: 'fit-content',
          }"
          :row-style="{
            background: '#ffffff 0% 0% no-repeat padding-box',
            border: '1px solid #F8F8F8',
            'border-radius': '5px',
            opacity: '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            color: '#214353',
            opacity: '1',
          }"
          border
          style="overflow: auto"
        >
          <el-table-column label="Date">
            <div slot-scope="scope">
              {{ elapsedTimeFormat(scope.row.creationDate) }}
            </div>
          </el-table-column>
          <el-table-column :label="$t('spinal-twin.User')">
            <div slot-scope="scope">
              {{
                (scope.row.user &&
                  (scope.row.user.name || scope.row.user.username)) ||
                "unknow"
              }}
            </div>
          </el-table-column>
          <el-table-column label="Action">
            <div slot-scope="scope">
              {{ logFormat(scope.row.event) }}
            </div>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- </div> -->
      <!-- <div class="ticket-notes"> -->
      <el-collapse-item
        class="ticket-notes"
        name="Notes"
        :title="$t('spinal-twin.TicketNotes')"
      >
        <!-- <div class="ticket-label-information">Commentaires :</div> -->
        <el-container>
          <el-header style="height: 140">
            <node-notes-create
              v-if="ticket.ticket"
              :node="getTicketRealNode(ticket.ticket)"
              @send-note="sendNote"
            >
            </node-notes-create>
          </el-header>

          <div class="note-feed">
            <el-container
              v-for="note of ticket.comments"
              :key="note._server_id"
              style="
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                margin-bottom: 10px;
              "
            >
              <el-main style="padding: 0 0 10px 0">
                <node-notes-message
                  :username="note.element.username.get()"
                  :date="note.element.date.get()"
                  :message="note.element.message.get()"
                  :type="note.element.type.get()"
                  :file="note.element.file ? note.element.file : {}"
                  :viewPoint="
                    note.element.viewPoint ? note.element.viewPoint : null
                  "
                >
                </node-notes-message>
              </el-main>
              <el-tooltip
                :content="$t('spinal-twin.DeleteNote')"
                class="delete-button"
              >
                <el-popconfirm
                  @confirm="delNote(ticket.ticket)"
                  :title="$t('spinal-twin.DeleteConfirm')"
                >
                  <el-button
                    class="el-button-delete"
                    icon="el-icon-delete"
                    type="danger"
                    size="small"
                    circle
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </el-container>
          </div>
        </el-container>
      </el-collapse-item>
      <!-- </div> -->
    </el-collapse>

    <!-- </div> -->
  </div>
</template>

<script>
import moment from "moment";
import NodeNotesMessage from "../NodeNotes/NodeNotesMessage.vue";
import NodeNotesCreate from "../NodeNotes/NodeNotesCreate.vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import {
  SpinalGraphService,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import { LOGS_EVENTS_STRING } from "spinal-service-ticket/src/Constants";

import { spinalServiceTicket } from "spinal-service-ticket";
import { ViewManager } from "../../../../services/ViewManager/ViewManager";
// import { viewerState } from '../../../TabManager/generic/ContextExplorer/viewerState.ts';
import { viewerState } from "../../generic/ContextExplorer/viewerState";
import { getTicketDescription } from "./Ticket";
import * as appEvent from "../../../../services/event";
import EventBus from "../../../space/component/js/event";
// import { GEO_RELATIONS } from "../../constants";
import {
  GEO_BUILDING_TYPE,
  GEO_RELATIONS,
  GEO_ROOM_TYPE,
  GEO_FLOOR_TYPE,
  TICKET_PRIORITY_LIST
} from "../../../../constants";

export default {
  name: "NodeTicketSelected",
  components: { NodeNotesMessage, NodeNotesCreate },
  props: {
    Properties: {
      type: Object,
      required: false,
      default: undefined,
    },
    selected: {
      type: Object,
      required: false,
      default: undefined,
    },
    stepping: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  watch: {
    Properties: {
      handler(oldProps, newProps) {
        this.update();
      },
      deep: true,
    },
    ticket(newTicket, oldTicket){
    }
  },

  data() {
    return {
      steps: [],
      ticket: undefined,
      doStepping: true,
      activeCollapses: ["Details"],
    };
  },

  async mounted() {
    await this.update();
  },

  async created() {
    EventBus.$on(
      "note-added",
      async function () {
        await this.update();
      }.bind(this)
    );
  },

  methods: {
    async sendNote() {
      EventBus.$emit("note-added");
      this.$emit("update");
      await new Promise((r) => setTimeout(r, 300));
      await this.update();
    },

    async update() {
      this.ticket = undefined;
      if (typeof this.selected == "undefined") {
        let ticketinfo = SpinalGraphService.getRealNode(
          this.Properties.selected
        );
        this.ticket = await getTicketDescription(ticketinfo.info);
        this.doStepping = this.Properties.stepping;
      } else {
        this.ticket = this.selected;
        this.doStepping = this.stepping;
      }


      // this.steps = await spinalServiceTicket.getStepsFromProcess(this.ticket.ticket.processId, this.ticket.ticket.contextId);
      // let node = SpinalGraphService.getRealNode(this.ticket.ticket.processId)
    },

    async delNote(note) {
      await serviceDocumentation.delNote(this.ticket.ticket, note);
      this.$emit("update");
    },

    DateFormat(time) {
      if(typeof time == "number"){
        const date = new Date(time);
        return moment(date, "DD/MM/YYYY HH:mm:ss");
      }
      else{
        const date = new Date(time.get());
        return moment(date, "DD/MM/YYYY HH:mm:ss");
      }
      
    },

    elapsedTimeFormat(time) {
      const now = new Date();
      const then = new Date(time);

      var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(
        moment(then, "DD/MM/YYYY HH:mm:ss")
      );
      var d = moment.duration(ms);
      if (d.asDays() < 1) {
        return this.$t("spinal-twin.Today");
      } else if (d.asDays() < 2) {
        return this.$t("spinal-twin.Yesterday");
      }
      return Math.floor(d.asDays()) + this.$t("spinal-twin.DaysAgo");
    },

    async changeStep(step, ticket) {
      let realTicket = ticket.ticket;
      let contextId = await spinalServiceTicket.getTicketContextId(
        realTicket.id
      );
      if (step > 0) {
        let tmpStep = await spinalServiceTicket.moveTicketToNextStep(
          contextId,
          realTicket.processId.get(),
          realTicket.id.get(),
          this.userInfo
        );
        if (tmpStep) {
          SpinalGraphService.setInfo(realTicket.id.get());
          let realStep = SpinalGraphService.getRealNode(tmpStep.id);
          ViewManager.getInstance(this.Properties.viewKey).breadcrumb[3].name =
            realStep.info.name.get();
          ViewManager.getInstance(
            this.Properties.viewKey
          ).breadcrumb[3].serverId = realStep._server_id;
        }
      } else if (step < 0) {
        let tmpStep = await spinalServiceTicket.moveTicketToPreviousStep(
          contextId,
          realTicket.processId.get(),
          realTicket.id.get(),
          this.userInfo
        );
        if (tmpStep) {
          SpinalGraphService.setInfo(realTicket.id.get());
          let realStep = SpinalGraphService.getRealNode(tmpStep.id);
          ViewManager.getInstance(this.Properties.viewKey).breadcrumb[3].name =
            realStep.info.name.get();
          ViewManager.getInstance(
            this.Properties.viewKey
          ).breadcrumb[3].serverId = realStep._server_id;
        }
      } else {
        return;
      }
      this.$emit("update");
      await this.update();
    },
    async changeStep2(step) {

      await spinalServiceTicket.moveTicket(
        this.ticket.ticket.id,
        this.ticket.ticket.stepId,
        this.ticket.step,
        this.ticket.ticket.contextId
      );
      if (this.Properties.viewKey == "TicketApp") {
        let realStep = SpinalGraphService.getRealNode(step);
        SpinalGraphService._addNode(realStep);
        ViewManager.getInstance(this.Properties.viewKey).breadcrumb[3].name =
          realStep.info.name.get();
        ViewManager.getInstance(
          this.Properties.viewKey
        ).breadcrumb[3].serverId = realStep._server_id;
      }
      this.$emit("update");
      await this.update();
    },

    back() {
      this.$emit("back");
    },

    logFormat(n) {
      return LOGS_EVENTS_STRING[n];
    },

    getTarget() {
      return this.ticket.target;
    },

    debug(what) {
      console.debug("debug", what);
    },

    getTicketRealNode(ticket) {
      if (ticket instanceof SpinalNode) return ticket;
      return SpinalGraphService.getRealNode(ticket.id);
    },
    isolateTarget(id) {
      // if(item.nodeId != undefined){
      //   var id = item.nodeId
      //   var name = item.name
      // }
      // else{
      //   var id = item.id.get()
      //   var name = item.name.get()
      // }
      viewerState.changeIsolation();
      appEvent.EventBus.$emit("viewer-reset-isolate");
      // let node = SpinalGraphService.getRealNode(this.ticket.target.parent.id.get());
      // let node = SpinalGraphService.getRealNode(item.id.get());
      let node = SpinalGraphService.getRealNode(id);
      // this.isolated = false;
      if (viewerState.isolated()) {
        let obj = {
          // name: item.name.get(),
          name: node.getName().get(),
          serverId: node._server_id,
        };
        // this.isolated = true;
        appEvent.EventBus.$emit("viewer-isolate", [obj], GEO_RELATIONS);
      }
    },
    async openInDataRoom(id) {
      let node = SpinalGraphService.getRealNode(id);
      SpinalGraphService._addNode(node);
      let path = await this.getPathOfTicket(node, [
      ]);
      appEvent.EventBus.$emit("switch-to-dataroom", path);
    },
    async getPathOfTicket(node, path) {
      let tab = [{ name: node.getName().get(), serverId: node._server_id }];
      let temp = tab.concat(path);
      let parentNode = (await node.getParents(GEO_RELATIONS)).filter((parent) =>
        [
          "geographicContext",
          GEO_BUILDING_TYPE,
          GEO_FLOOR_TYPE,
          GEO_ROOM_TYPE,
        ].includes(parent.getType().get())
      );
      if (parentNode.length != 0) {
        // let temp = path.concat({name: parentNode[0].getName().get(), serverId: parentNode[0]._server_id}, path)
        return await this.getPathOfTicket(parentNode[0], temp);
      } else return temp;
    },
    getTicketPriority(priority){
      if(typeof priority == "object"){
        return TICKET_PRIORITY_LIST[priority.get()];
        // return priority.get();
      }
      else{
        return TICKET_PRIORITY_LIST[priority];
        // return priority;
      }
    }
  },
};
</script>

<style scoped>
.ticket-presentation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
  align-items: center;
}
/* .ticket-steps{
  text-align: left;
  letter-spacing: .75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
} */

.ticket-creation-informations {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px;
}
.ticket-target-informations {
  /* display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px; */
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px;
}
.ticket-target-parent-informations {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px;
}
.spl-button-bar {
  margin-left: 20px;
}
.ticket-description {
  border: 1px solid #eaeef0;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
}
.description {
  margin-top: 10px;
  letter-spacing: 1.2px;
  font-size: 15px;
}

.ticket-row-card {
  display: flex;
  flex-direction: row;
  border: 1px solid #eaeef0;
  background-color: #f9f9f9;
  align-items: center;
  /* padding-left: 10px;
  padding-right: 10px; */
  border-radius: 10px;
  padding: 10px;
}
.ticket-label-information {
  letter-spacing: 0.75px;
  color: #14202c;
  opacity: 1;
  font-size: 15px;
}
.ticket-name {
  letter-spacing: 0.75px;
  color: #14202c;
  opacity: 1;
  font-size: 15px;
  padding: 10px;
  max-width: 35%;
}
.ticket-events {
  border: 1px solid #eaeef0;
  background-color: #f9f9f9;
  margin: 10px;
}
.ticket-label-value {
  color: #949da6;
  letter-spacing: 0.75px;
  font-size: 15px;
  padding-left: 1.5px;
  margin-left: 10px;
}
.ticket-notes-and-events {
  display: flex;
  flex-direction: row;
}
.ticket-notes {
  border: 1px solid #eaeef0;
  background-color: #f9f9f9;
  margin: 10px;
}

/* ************************************OLD STYLES ******************************** */

/*
.ticketSelectedHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticketSelectedHeader .name {
  width: 150px;
  display: flex;
  align-items: center;
}

.separate {
  display: flex;
  justify-content: space-between;
}

.note-feed {
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
}

.delete-button {
  padding: 25px 10px 10px 10px;
}

.spl-el-button {
  background-color: green;
}
*/
</style>
<style>
.el-collapse-item__header {
  letter-spacing: 0.75px !important;
  color: #14202c !important;
  opacity: 1 !important;
  font-size: 15px !important;
  padding-left: 10px !important;
}

/* a voir pourquoi ici ça bug avec les notes */
.ticket-steps > .el-input--suffix > .el-input__inner {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
}
/* .el-scrollbar {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c !important;
  border-radius: 10px;
} */
.el-select-dropdown__item.hover {
  background-color: #14202c;
  color: #448aff;
}
.el-select-dropdown__item {
  color: #f9f9f9;
}

.el-select-dropdown.el-popper {
  background-color: #14202c;
  border-color: #14202c;
}
.ticket-selected-main-container {
  max-height: 80vh;
  overflow: scroll;
  width: 100%;
}

.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #14202c;
}
.el-popper[x-placement^="bottom"] .popper__arrow:after {
  border-bottom-color: #14202c;
}
</style>
