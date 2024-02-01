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
    <div class="container">
      <div class="btn-doc">
        <div class="add-doc">
          <document-create
            :nodeId="nodeId"
            @reload="updateDocument"
          ></document-create>
        </div>
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
      </div>
      <div>
        <el-table
          class="overflow-auto"
          id="style-scroll"
          :data="documents"
          border
          style="width: 100%; height: 780px"
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

          <el-table-column label="" width="70" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-delete"
                type="danger"
                circle
                id="show-modal"
                @click="deleteDocument(scope.$index)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-container>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { FileSystem } from "spinal-core-connectorjs_type";
import documentCreate from "./documentcreate";
import viewerBtn from "./viewerBtn";

export default {
  name: "Documentation",
  components: { "document-create": documentCreate, viewerBtn },
  props: ["nodeId"],

  data() {
    return {
      documents: [],
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      selectedDirectory: undefined,
      showModal: false,
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
    this.documents = await this.getDocuments();
    // this.selectedDirectory = await FileExplorer.getDirectory(this.option.info);
  },
  methods: {
    exportFichier(file) {
      if (file._info.model_type.get() != "Directory") {
        file._ptr.load((path) => {
          if (file._info.model_type.get() == "HttpPath") {
            const element = document.createElement("a");
            const _path =
              path.host.get() +
              "/file/" +
              encodeURIComponent(path.httpRootPath.get()) +
              "/" +
              encodeURIComponent(path.httpPath.get());
            element.setAttribute("href", _path);
            element.setAttribute("download", file.name.get());
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          } else {
            var element = document.createElement("a");
            element.setAttribute("href", "/sceen/_?u=" + path._server_id);
            element.setAttribute("download", file.name);
            element.click();
          }
        });
      } else {
        // check recursive directory & create a ZIP
      }
    },
    getDocuments() {
      return FileExplorer.getDirectory(FileSystem._objects[this.nodeId]).then(
        (directory) => {
          let res = [];
          if (directory) {
            for (let index = 0; index < directory.length; index++) {
              const element = directory[index];
              res.push(element);
            }
          }
          return res;
        }
      );
    },
    async deleteDocument(index) {
      if (confirm("Delete Document !")) {
        const directory = await FileExplorer.getDirectory(
          FileSystem._objects[this.nodeId]
        );
        directory.splice(index, 1);
        await this.updateDocument();
      }
    },
    async updateDocument() {
      this.documents = await this.getDocuments();
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
ul {
  list-style-type: none;
}
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btn-doc {
  display: flex;
  flex-direction: row;
  padding-bottom: 40px;
}
.add-doc {
  width: 20%;
}
.viewer-btn {
  width: 100%;
}

#style-scroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#style-scroll::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

#style-scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(201, 196, 196);
}
</style>
