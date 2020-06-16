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
  <div>

    <el-table :data="process.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">
      <el-table-column label="Name"
                       prop="name">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header"
                  slot-scope="scope">
          <el-input v-model="search"
                    size="mini"
                    placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <!-- <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">Edit
          </el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">Delete
          </el-button> -->
          <!-- {{scope.row.steps}} -->
          <div v-for="step in scope.row.steps"
               :key="step.name">
            {{step.name}}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div v-for="proc in process">
      {{proc.name}}
    </div> -->
  </div>
</template>

<script>
export default {
  name: "MaintenanceBookTicketConsultProcess",
  data() {
    return {
      search: "",
      process: []
    };
  },
  mounted() {
    function createProcess(name) {
      return {
        name,
        steps: [
          createSteps("En attente de Validation", "#ff00ff"),
          createSteps("En attente de Confirmation", "#ff00ff"),
          createSteps("En attente de réalisation", "#e1dd04"),
          createSteps("En réalisation partielle", "#04aef2"),
          createSteps("Refusées", "#ff0000"),
          createSteps("Terminées", "#5cc037")
        ]
      };
    }
    function createSteps(name, color) {
      return {
        name,
        color,
        ticket: []
      };
    }
    // function createTicket(name) {}

    this.process = [
      createProcess("BATIMENT_SECOND ŒUVRE"),
      createProcess("CHAUFFAGE_VENTILATION_CLIM"),
      createProcess("ELECTRICITE")
    ];
  }
};
</script>
