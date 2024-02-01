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
      <h5 style="margin: 20px">
        {{ $t('spinal-twin.TicketDeclare') }}
      </h5>
    </el-header>

    <el-main>
      <el-form
        ref="TicketDeclarationForm"
        :model="newTicket"
        label-width="80px"
      >
        <el-form-item label="Context">
          <el-select
            v-model="newTicket.context"
            @change="setProcesses()"
            placeholder="---"
            style="width: 500px"
          >
            <!-- :placeholder="$t('spinal-twin.SelectContext')" -->
            <el-option
              v-for="context in contexts"
              :key="context.id"
              :label="context.name"
              :value="context.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="processes" label="Process">
          <el-select
            v-model="newTicket.process"
            placeholder="---"
            @change="setIncidents()"
            style="width: 500px"
          >
            <!-- :placeholder="$t('spinal-twin.SelectProcess')" -->
            <el-option
              v-for="process in processes"
              :key="process.id.get()"
              :label="process.name.get()"
              :value="process.id.get()"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="incidents" label="Incident">
          <el-autocomplete
            v-model="newTicket.incident"
            :fetch-suggestions="suggestIncidents"
            @select="selected"
            style="width: 500px"
            placeholder="---"
          >
            <!-- :placeholder="$t('spinal-twin.SelectIncident')" -->
            <div slot-scope="{ item }">
              <div>{{ item }}</div>
            </div>
          </el-autocomplete>
        </el-form-item>

        <el-form-item
          v-show="newTicket.incident != '' && newTicket.incident != undefined"
          :label="$t('spinal-twin.Priority')"
        >
          <el-radio-group v-model="newTicket.priority">
            <el-radio label="Occasionally"></el-radio>
            <el-radio label="Normal"></el-radio>
            <el-radio label="Urgent"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="newTicket.incident != '' && newTicket.incident != undefined"
          :label="$t('spinal-twin.Description')"
        >
          <el-input
            v-model="newTicket.description"
            autosize
            placeholder="---"
            type="textarea"
          ></el-input>
          <!-- :placeholder="$t('spinal-twin.Description')" -->
        </el-form-item>
      </el-form>
    </el-main>

    <el-footer style="position: absolute; bottom: 50px">
      <el-button @click="close()">
        {{ $t('Cancel') }}
      </el-button>
      <el-button
        @click="confirm()"
        type="primary"
        :disabled="newTicket.priority == '' || newTicket.incident == ''"
      >
        {{ $t('Confirm') }}
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { spinalServiceTicket } from 'spinal-service-ticket';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

export default {
  name: 'TicketDeclarationForm',
  props: {
    node: {
      required: true,
      type: Object,
    },
    active: {
      required: true,
      type: Boolean,
    },
  },

  computed: {
    user() {
      return {
        username: 'admin',
        id: FileSystem._userid,
      };
    },
  },

  data() {
    return {
      newTicket: {
        context: '',
        process: '',
        incident: '',
        priority: '',
        description: '',
      },
      contexts: false,
      processes: false,
      incidents: false,
    };
  },

  async mounted() {
    this.contexts = await spinalServiceTicket.getContexts();
  },

  methods: {
    async setProcesses() {
      this.processes = await spinalServiceTicket.getAllProcess(
        this.newTicket.context
      );
    },

    async setIncidents() {
      this.incidents = await spinalServiceTicket.getCommonIncident(
        this.newTicket.process
      );
    },

    async suggestIncidents(query = '', callback) {
      let res = [];
      for (const incident of this.incidents) {
        if (incident.name.toLowerCase().includes(query.toLowerCase())) {
          res.push(incident.name);
        }
      }
      callback(res);
    },

    selected(item) {
      this.newTicket.incident = item;
    },

    close() {
      this.$emit('close');
    },

    async confirm() {
      let infos = {
        processId: this.newTicket.process,
        name: this.newTicket.incident,
        user: this.user,
      };
      switch (this.newTicket.priority) {
        case 'Occasionally':
          infos.priority = 0;
          break;
        case 'Normal':
          infos.priority = 1;
          break;
        case 'Urgent':
          infos.priority = 2;
          break;
        default:
          infos.priority = 0;
      }
      let ticketId = await spinalServiceTicket.addTicket(
        infos,
        this.newTicket.process,
        this.newTicket.context,
        this.node.info.id.get()
      );
      if (
        this.newTicket.description != undefined &&
        this.newTicket.description != ''
      ) {
        let ticketnode = await SpinalGraphService.getRealNode(ticketId);
        await serviceDocumentation.addNote(
          ticketnode,
          this.user,
          this.newTicket.description,
          'text'
        );
      }
      this.$emit('update');
    },
  },
};
</script>
