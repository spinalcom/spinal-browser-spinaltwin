<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
    <div class="ticket-view">
      <div class="buttons">
        <div class="viewer-btn" :nodeId="nodeId">
          <div class="bouttons">
            <el-button
              title="Export Table"
              icon="el-icon-download"
              circle
              @click.stop="exportToExcel()"
            >
            </el-button>

            <el-button
              title="Color Items "
              icon="el-icon-picture-outline-round"
              circle
              @click.stop="SeeAll()"
            >
            </el-button>
            <el-button
              title="Isolate Items"
              icon="el-icon-aim"
              circle
              @click.stop="isoItem()"
            >
            </el-button>
          </div>
        </div>
        <div class="perv-next">
          <el-button
            title="Pass Ticket To Previous Step"
            icon="el-icon-caret-left"
            circle
            plain
            type="primary"
            @click.stop="PassToPreviousStep()"
          ></el-button>
          <el-button
            title="Pass Ticket To Next Step"
            icon="el-icon-caret-right"
            type="primary"
            circle
            plain
            @click.stop="PassToNextStep()"
          ></el-button>
        </div>
      </div>

      <div class="ticket-Details">
        <table class="table-hover">
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                {{ this.nodeInfo.selectedNode.info.name.get() }}
              </td>
            </tr>
            <tr>
              <th>Actual Step</th>
              <td>
                {{ ActualStep() }}
              </td>
            </tr>
            <tr>
              <th>Priority</th>
              <td>
                {{ this.nodeInfo.selectedNode.info.priority }}
              </td>
            </tr>
            <tr>
              <th>Created By</th>
              <td>
                {{ this.nodeInfo.selectedNode.info.user.name }}
              </td>
            </tr>
            <tr>
              <th>Creation</th>
              <td>{{ CreationDate() }}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{{ this.nodeInfo.selectedNode.info.description }}</td>
            </tr>
            <tr>
              <th>Room</th>
              <td>{{ this.Room_Ticket }}</td>
            </tr>
            <tr>
              <th>Floor</th>
              <td>{{ this.Floor_Ticket }}</td>
            </tr>
            <tr>
              <th>Building</th>
              <td>{{ this.Building_Ticket }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-container>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { serviceTicketPersonalized } from "spinal-service-ticket";
import { FileSystem } from "spinal-core-connectorjs_type";
import { EventBus } from "../../backend/event";
import viewerBtn from "./viewerBtn";
import moment from "moment";
import fileSaver from "file-saver";

export default {
  name: "TicketDetailss",
  components: { viewerBtn },
  props: ["nodeId"],

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      Room_Ticket: "",
      Floor_Ticket: "",
      Building_Ticket: "",
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: FileSystem._objects[this.nodeId],
      };
    },
  },
  async mounted() {
    await this.tree();
  },
  methods: {
    CreationDate() {
      return moment(
        this.nodeInfo.selectedNode.info.creationDate.get()
      ).fromNow();
    },
    ActualStep() {
      SpinalGraphService._addNode(this.nodeInfo.selectedNode);

      const stepRealNode = SpinalGraphService.getRealNode(
        this.nodeInfo.selectedNode.info.stepId.get()
      );
      // return stepRealNode.info.name.get();
      return "";
    },
    async PassToPreviousStep() {
      if (confirm("Pass To Previous Step!")) {
        const ticket = this.nodeInfo.selectedNode;
        const step = SpinalGraphService.getRealNode(ticket.info.stepId.get());
        const process = SpinalGraphService.getRealNode(
          step.info.processId.get()
        );
        const workflows = await process.getParents(
          "SpinalSystemServiceTicketHasProcess"
        );
        var user = {
          username: "admin",
          userId: 0,
        };
        await serviceTicketPersonalized.moveTicketToPreviousStep(
          workflows[0].getId().get(),
          process.getId().get(),
          ticket.getId().get(),
          user
        );
        this.ActualStep();
      }
    },
    async PassToNextStep() {
      if (confirm("Pass To Next Step!")) {
        const ticket = this.nodeInfo.selectedNode;
        const step = SpinalGraphService.getRealNode(ticket.info.stepId.get());
        const process = SpinalGraphService.getRealNode(
          step.info.processId.get()
        );
        const workflows = await process.getParents(
          "SpinalSystemServiceTicketHasProcess"
        );
        var user = {
          username: window.spinal.spinalSystem.user.username,
          userId: 0,
        };
        await serviceTicketPersonalized.moveTicketToNextStep(
          workflows[0].getId().get(),
          process.getId().get(),
          ticket.getId().get(),
          user
        );
      }
    },
    async tree() {
      if (this.nodeInfo.selectedNode) {
        const ticket = this.nodeInfo.selectedNode;
        const Room_Ticket = await ticket
          .getParents("SpinalSystemServiceTicketHasTicket")
          .then((parents) => {
            for (const parent of parents) {
              if (parent.getType().get() === "geographicRoom") {
                return parent;
              }
            }
          });
        const Floor_Ticket = await Room_Ticket.getParents(
          "hasGeographicRoom"
        ).then((parents) => {
          for (const parent of parents) {
            if (parent.getType().get() === "geographicFloor") {
              return parent;
            }
          }
        });

        const Building_Ticket = await Floor_Ticket.getParents(
          "hasGeographicFloor"
        ).then((parents) => {
          for (const parent of parents) {
            if (parent.getType().get() === "geographicBuilding") {
              return parent;
            }
          }
        });
        this.Room_Ticket = Room_Ticket.getName().get();
        this.Floor_Ticket = Floor_Ticket.getName().get();
        this.Building_Ticket = Building_Ticket.getName().get();
      }
    },
    exportToExcel() {
      let headers = [
        {
          key: "name",
          header: this.$t("name"),
          width: 20,
        },
      ];
      // for (const column of this.columns) {
      //   headers.push({
      //     key: column,
      //     header: this.$t(column),
      //     width: 10,
      //   });
      // }
      let excelData = [
        {
          name: "Ticket Details",
          author: "",
          data: [
            {
              name: "Ticket Details",
              header: headers,
              rows: deta,
            },
          ],
        },
      ];

      let deta = [
        { colA: "Hello", colB: "World" },
        {
          colA: "Multi-line",
          /* Multi-line value: */
          colB:
            "This is a long paragraph\nwith multiple lines\nthat should show in a single cell.",
        },
        { colA: "Another", colB: "Regular cell" },
      ];

      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `ticket_details.xlsx`);
      });
    },
    isoItem() {
      let item = {
        server_id: this.nodeId,
        color: "blue",
      };
      EventBus.$emit("view-isolate-item", item);
    },
    SeeItem() {
      let item = {
        server_id: this.nodeId,
        color: "blue",
      };
      EventBus.$emit("view-color-item", item);
    },
    SeeAll() {
      EventBus.$emit(
        "view-color-all",
        [{ server_id: this.nodeId, color: "blue" }],
        { server_id: this.nodeId }
      );
    },
    ShowAll() {
      EventBus.$emit("view-show-all");
    },
    isolateAll(zone) {
      EventBus.$emit("view-isolate-all", { server_id: zone });
    },
  },

  beforeDestroy() {},
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
.ticket-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.ticket-Details {
  width: 100%;
}
.items {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  text-align: center;
}

.table-hover {
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 10px #c5c5c5a8;
  font-size: 14px;
  /* color: #606266; */
}
.bouttons {
  float: right;
  padding-bottom: 5px;
}
.table-hover tr {
  border: 1px solid #c7c7c7;
}
.table-hover th {
  padding: 14px;
  border: 1px solid #c7c7c7;
  width: 20%;
  background-color: #f0f2f5;
}
.table-hover td {
  text-align: center;
}
.buttons {
  padding-bottom: 40px;
}
.button3 {
  width: 50%;
  display: inline-block;
  padding: 1px;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  color: #ffffff;
  background-color: #4eb5f1;
  transition: all 0.2s;
}

.button3:hover {
  background-color: #4095c6;
}

@media all and (max-width: 30em) {
   a.button3 {
    display: block;
    margin: 0.2em auto;
  }
}
</style>
