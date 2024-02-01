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
  <el-row class="spinal-space-tableau-row">
    <el-tabs class="tabs-container" type="border-card">
      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Équipements /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->

      <el-tab-pane label="Equipement" class="spinal-space-tab-container">
        <div class="spinal-space-table-content spinal-scrollbar">
          <el-table
            :data="equipement"
            border
            style="width: 100%"
            :header-row-style="{
              'min-height': '0px',
              height: '50px',
              padding: '0px',
            }"
            :header-cell-style="{ 'background-color': '#f0f2f5' }"
          >
            <el-table-column prop="name" :label="$t('SpaceManagement.Nom')">
            </el-table-column>
            <el-table-column align="center" width="65">
              <template>
                <el-button icon="el-icon-arrow-right" circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane class="spinal-space-tab-container" label="Tickets">
        <div class="barre">
          <ticket-create
            v-bind:nodeId="nodeId"
            @reload="updateticket"
          ></ticket-create>
          <header-bar
            :header="ticketHeader"
            :content="ticketContent"
            :data="ticketData"
          ></header-bar>
        </div>
        <div class="spinal-space-table-content spinal-scrollbar">
          <el-table
            :data="tickets"
            border
            style="width: 100%"
            :header-row-style="{
              'min-height': '0px',
              height: '50px',
              padding: '0px',
            }"
            :header-cell-style="{ 'background-color': '#f0f2f5' }"
          >
            <el-table-column
              prop="name"
              :label="$t('SpaceManagement.Nom')"
              width="180"
            >
            </el-table-column>

            <el-table-column prop="priority" label="Priorités" align="center">
            </el-table-column>

            <el-table-column label="utilisateur" align="center">
            </el-table-column>

            <el-table-column label="Date de création" align="center">
              <template slot-scope="scope">
                {{ scope.row.creationDate | formatDate }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// DOCUMENTATION /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane class="spinal-space-tab-container" label="Documentation">
        <div class="barre">
          <document-create
            v-bind:nodeId="nodeId"
            @reload="updateDocument"
          ></document-create>
          <header-bar
            :header="ticketHeader"
            :content="ticketContent"
            :data="ticketData"
          ></header-bar>
        </div>
        <div class="spinal-space-table-content spinal-scrollbar">
          <el-table
            :data="documents"
            border
            style="width: 100%"
            :header-row-style="{
              'min-height': '0px',
              height: '50px',
              padding: '0px',
            }"
            :header-cell-style="{ 'background-color': '#f0f2f5' }"
          >
            <el-table-column :label="$t('SpaceManagement.Nom')">
              <template slot-scope="scope">
                {{ scope.row.name.get() }}
              </template>
            </el-table-column>

            <el-table-column label="" width="70" align="center">
              <template slot-scope="scope">
                <el-button
                  v
                  icon="el-icon-download"
                  circle
                  @click="exportFichier(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane class="spinal-space-tab-container tab-class" label="Notes">
        <el-container class="container-class">
          <message-component :node-info="nodeInfo"></message-component>
        </el-container>
      </el-tab-pane>

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Calendrier /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane class="spinal-space-tab-container" label="Calendrier">
        <div class="barre">
          <create-date
            v-bind:nodeId="nodeId"
            @reload="updateDate"
          ></create-date>
          <header-bar
            :header="ticketHeader"
            :content="ticketContent"
            :data="ticketData"
          ></header-bar>
        </div>

        <div class="spinal-space-table-content spinal-scrollbar">
          <vueCal
            :events="calendrier"
            :on-event-click="onEventClick"
            v-if="!showDialog"
          ></vueCal>

          <el-form
            v-if="showDialog"
            ref="form"
            :model="form"
            label-width="120px"
          >
            <el-form-item label="Name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="Start date">
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="form.value1"
                  type="datetime"
                  placeholder="Select date and time"
                >
                </el-date-picker>
              </div>
            </el-form-item>

            <el-form-item label="End date">
              <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                  v-model="form.value2"
                  type="datetime"
                  placeholder="Select date and time"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <!-- slot="footer" -->
            <el-form-item class="dialog-footer">
              <el-button @click="showDialog = false">Annuler</el-button>
              <el-button type="danger" @click="deleteDate">Supprimer</el-button>
              <el-button type="primary" @click="confirmDate"
                >Confirmer</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { serviceTicketPersonalized } from 'spinal-service-ticket';
import { FileExplorer } from 'spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import messageComponent from './messageComponent.vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { SpinalEventService } from 'spinal-env-viewer-task-service';
import GeographicContext from 'spinal-env-viewer-context-geographic-service';
import ticketcreate from './ticketcreate.vue';
import headerBarVue from './headerBar.vue';
import documentcreateVue from './documentcreate.vue';
import createDate from './createDate.vue';
export default {
  components: {
    'message-component': messageComponent,
    VueCal,
    'ticket-create': ticketcreate,
    'header-bar': headerBarVue,
    'document-create': documentcreateVue,
    'create-date': createDate,
  },
  filters: {
    formatDate: function (date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}/${
        newDate.getMonth() + 1
      }/${newDate.getFullYear()}`;
    },
  },
  props: ['nodeId'],
  data() {
    return {
      tickets: [],
      documents: [],
      ticketHeader: [],
      ticketData: [],
      ticketContent: [],
      nodeInfo: { selectedNode: SpinalGraphService.getRealNode(this.nodeId) },
      calendrier: [],
      equipement: [],
      selectedEvent: {},
      showDialog: false,
      form: {
        name: '',
        value1: '',
        value2: '',
      },
      EventInterface: {
        nodeId: this.nodeId,
        startDate: '',
        endDate: '',
        name: '',
      },
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: SpinalGraphService.getRealNode(this.nodeId),
      };
    },
  },
  async mounted() {
    this.calendrier = await this.getEvents();

    this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
      this.nodeId
    );

    this.ticketHeader = [
      { key: 'name', header: 'name', width: 15 },
      { key: 'priority', header: 'priority', width: 15 },
      { key: 'user', header: 'utilisateur', width: 15 },
      { key: 'creationDate', header: 'date de création', width: 15 },
    ];

    this.ticketContent = this.tickets.map((el) => ({
      name: el.name,
      priority: el.priority,
      user: el.user ? el.user.name : 'unknow',
      creationDate: this._formatDate(el.creationDate),
    }));

    const salle = SpinalGraphService.getInfo(this.nodeId).get();

    /**
     * Pas une bonne idée de parcourir tout le tableau pour la même salle
     * ajouter une condition dans headerBar.vue pour regler ce probleme
     */
    this.ticketData = this.tickets.map((el) => {
      el.rooms = [salle];
      return el;
    });

    this.documents = await this.getDocuments();
    let varEquipement = await SpinalGraphService.getChildren(
      this.nodeId,
      GeographicContext.constants.EQUIPMENT_RELATION
    );
    this.equipement = varEquipement.map((item) => {
      return item.get();
    });
  },
  beforeDestroy() {},
  methods: {
    exportFichier(file) {
      if (file._info.model_type.get() != 'Directory') {
        file._ptr.load((path) => {
          if (file._info.model_type.get() == 'HttpPath') {
            const element = document.createElement('a');
            const _path =
              path.host.get() +
              '/file/' +
              encodeURIComponent(path.httpRootPath.get()) +
              '/' +
              encodeURIComponent(path.httpPath.get());
            element.setAttribute('href', _path);
            element.setAttribute('download', file.name.get());
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          } else {
            var element = document.createElement('a');
            element.setAttribute('href', '/sceen/_?u=' + path._server_id);
            element.setAttribute('download', file.name);
            element.click();
          }
        });
      } else {
        // check recursive directory & create a ZIP
      }
    },
    // _formatDate(argDate) {
    //   let date = new Date(argDate);
    //   return `${date.getFullYear()}-${date.getMonth() +
    //     1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    // },
    async updateticket() {
      this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
        this.nodeId
      );
    },
    getDocuments() {
      return FileExplorer.getDirectory(
        SpinalGraphService.getRealNode(this.nodeId)
      ).then((directory) => {
        let res = [];
        for (let index = 0; index < directory.length; index++) {
          const element = directory[index];
          res.push(element);
        }
        return res;
      });
    },
    async updateDocument() {
      this.documents = await this.getDocuments();
    },
    async getEvents() {
      const events = await SpinalEventService.getEvents(this.nodeId);
      const promises = events.map((el) => this._formatEvent(el.get()));
      return Promise.all(promises);
    },
    _formatEvent(event) {
      event.title = event.name;
      event.start = this._formatDate(event.startDate);
      event.end = this._formatDate(event.endDate);
      event.class = event.id;

      // event.deletable = true;
      // event.titleEditable = false;
      // event.textColor = "#ffffff";

      delete event.startDate;
      delete event.endDate;
      return event;
    },

    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    async updateDate() {
      this.calendrier = await this.getEvents(this.nodeId);
    },
    onEventClick(event, e) {
      this.selectedEvent = event;
      this.showDialog = true;
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
    },
    confirmDate() {
      this.showDialog = false;
      this.EventInterface.startDate = new Date(this.form.value1).getTime();
      this.EventInterface.endDate = new Date(this.form.value2).getTime();
      this.EventInterface.name = this.form.name;
      SpinalEventService.updateEvent(
        this.selectedEvent.class,
        this.EventInterface
      ).then(async (result) => {
        this.calendrier = await this.getEvents();
      });
    },
    async deleteDate() {
      await SpinalEventService.removeEvent(this.selectedEvent.class);

      this.calendrier = await this.getEvents();
      this.showDialog = false;
    },
  },
};
</script>

<style scoped>
.tabsContainer {
  width: 100%;
  height: 100%;
}
.button-ajouter {
  display: inline-block;
}
.button-supprimer {
  display: inline-block;
}
.pane-ticket {
  position: relative;
  height: calc(100% - 20px);
}
.container-class,
.tab-class {
  height: 100%;
}
</style>

<style>
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}

.barre {
  display: flex;
  justify-content: space-between;
}
</style>
