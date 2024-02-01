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
  <div style="height: inherit">
    <div class="spl-button-bar">
      <el-tooltip :content="$t('spinal-twin.DocumentAdd')">
        <el-button
          :disabled="ctxNode == false"
          @click.native="addDocument()"
          icon="el-icon-plus"
          circle
          class="el-button-add"
        ></el-button>
      </el-tooltip>
    </div>

    <div style="height: inherit; max-height: 650px; overflow-y: scroll">
      <el-table
        :data="documents"
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
        <el-table-column label="Document Name">
          <div slot-scope="scope">
            {{ scope.row.name }}
          </div>
        </el-table-column>
        <el-table-column label="Actions" width="150">
          <div class="actions-documentation" slot-scope="scope">
            <el-tooltip :content="$t('spinal-twin.explore-document')">
              <el-button
                @click.native="exploreDocument(scope.row._server_id)"
                icon="el-icon-search"
                circle
                size="small"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('spinal-twin.DocumentDownload')">
              <el-button
                @click.native="downloadDocument(scope.row._server_id)"
                icon="el-icon-download"
                circle
                size="small"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('spinal-twin.DocumentRemove')">
              <el-popconfirm
                @confirm="delDocument(scope.row._server_id)"
                :title="$t('spinal-twin.DeleteConfirm')"
              >
                <el-button
                  icon="el-icon-delete"
                  circle
                  slot="reference"
                  class="el-button-delete"
                  size="small"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
      <el-divider v-if="parentDocuments.length !=0" class="parent-document-divider">
        <span class="parent-document-divider-text">Parents Documents</span>
      </el-divider>

      <el-collapse>
        <el-collapse-item v-for="parent in parentDocuments" :key="parent" :title="parent.name">
          <el-table
            :data="parent.documents"
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
            style="overflow: auto; height: 100%"
          >
            <el-table-column label="Document Name">
              <div slot-scope="scope">
                {{ scope.row.name }}
              </div>
            </el-table-column>
            <el-table-column label="Actions" width="150">
              <div class="actions-documentation" slot-scope="scope">
                <el-tooltip :content="$t('spinal-twin.explore-document')">
                  <el-button
                    @click.native="exploreDocument(scope.row._server_id)"
                    icon="el-icon-search"
                    circle
                    size="small"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('spinal-twin.DocumentDownload')">
                  <el-button
                    @click.native="downloadDocument(scope.row._server_id)"
                    icon="el-icon-download"
                    circle
                    size="small"
                  ></el-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <!-- <div v-for="parent in parentDocuments" :key="parent">
        <div style="height: inherit">
          <el-table
            :data="parent.documents"
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
            style="overflow: auto; height: 100%"
          >
            <el-table-column :label="parent.name">
              <div slot-scope="scope">
                {{ scope.row.name }}
              </div>
            </el-table-column>
            <el-table-column label="Actions" width="120">
              <div slot-scope="scope">
                <el-tooltip :content="$t('spinal-twin.explore-document')">
                  <el-button
                    @click.native="exploreDocument(scope.row._server_id)"
                    icon="el-icon-search"
                    circle
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('spinal-twin.DocumentDownload')">
                  <el-button
                    @click.native="downloadDocument(scope.row._server_id)"
                    icon="el-icon-download"
                    circle
                  ></el-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
    </div>
    <!-- <div v-for="parent in parentDocuments" :key="parent">
    cc
      {{ parent.name }}

      <div style="height: inherit">
      <el-table
        :data="parent.documents"
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
        style="overflow: auto; height: 100%"
      >
        <el-table-column label="Document">
          <div slot-scope="scope">
            {{ scope.row.name }}
          </div>
        </el-table-column>
        <el-table-column label="Actions" width="120">
          <div slot-scope="scope">
            <el-tooltip :content="$t('spinal-twin.explore-document')">
              <el-button
                @click.native="exploreDocument(scope.row._server_id)"
                icon="el-icon-search"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('spinal-twin.DocumentDownload')">
              <el-button
                @click.native="downloadDocument(scope.row._server_id)"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('spinal-twin.DocumentRemove')">
              <el-popconfirm
                @confirm="delDocument(scope.row._server_id)"
                :title="$t('spinal-twin.DeleteConfirm')"
              >
                <el-button
                  icon="el-icon-delete"
                  circle
                  slot="reference"
                  class="el-button-delete"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
    </div>
      
    </div> -->
  </div>
</template>

<script>
import { FileSystem } from "spinal-core-connectorjs_type";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { EventBus } from "../../../services/event";
// import pdf from 'pdfvuer'
import PDFViewer from "pdf-viewer-vue/dist/vue2-pdf-viewer";

const axios = require("axios");

export default {
  name: "NodeDocumentation",
  components: { PDFViewer },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      ctxNodeName: "",
      documents: [],
      directory: false,
      parentDocuments: [],
      srcP: "",
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
    // this.update(this.Properties.view.serverId);
    EventBus.$on("click-on_spinal-twin.Documentation", () =>
      this.update(this.Properties.view.serverId)
    );
  },

  methods: {
    async update(id) {
      this.ctxNode = FileSystem._objects[id];
      this.ctxNodeName = FileSystem._objects[id].getName().get();
      this.directory = await FileExplorer.getDirectory(this.ctxNode);
      let parentNodes = await FileSystem._objects[id].getParents();
      this.getDocuments().then();
      this.getParentDocuments(parentNodes).then(
        
      );
    },

    docAt(serverId) {
      for (const doc of this.documents) {
        if (doc._server_id == serverId) {
          return doc;
        }
      }
      for (const parent of this.parentDocuments) {
        for (const doc of parent.documents) {
          if (doc._server_id == serverId) {
            return doc;
          }
        }
      }
      return null;
    },

    async getDocuments() {
      this.documents = [];
      if (!this.directory) return;
      for (let i = 0; i < this.directory.length; ++i) {
        this.documents.push(this.directory[i]);
      }
    },
    getDocumentsFromDirectory(directory) {
      let documents = [];
      for (let i = 0; i < directory.length; ++i) {
        documents.push(directory[i]);
      }
      return documents;
    },
    async getParentDocuments(parentNodes) {
      this.parentDocuments = [];
      for (let p of parentNodes) {
        let directory = await FileExplorer.getDirectory(p);
        if (directory) {
          this.parentDocuments.push({
            name: p.getName().get(),
            documents: this.getDocumentsFromDirectory(directory),
          });
        }
      }
    },

    // async addDocument() {
    //   const maxSize = 25000000;
    //   const input = document.createElement("input");

    //   if (!this.directory) {
    //     this.directory = await FileExplorer.createDirectory(this.ctxNode);
    //   }
    //   input.type = "file";
    //   input.multiple = true;
    //   input.click();
    //   input.addEventListener(
    //     "change",
    //     (event) => {
    //       const files = event.target.files;
    //       let filelist = [];
    //       for (const file of files) {
    //         filelist.push(file);
    //       }
    //       const sizes = filelist.map((el) => el.size);
    //       const filesSize = sizes.reduce((a, b) => a + b);
    //       if (filesSize > maxSize) {
    //         alert(
    //           this.$t("spinal-twin.ErrorFileTooLarge") +
    //             maxSize / 1000000 +
    //             " MB"
    //         );
    //         return;
    //       }
    //       FileExplorer.addFileUpload(this.directory, filelist);
    //       this.$emit("reload");
    //       this.update(this.Properties.view.serverId);
    //     },
    //     false
    //   );
    // },
    async addDocument() {
      const maxSize = 25000000;
      const input = document.createElement("input");

      if (!this.directory) {
        this.directory = await FileExplorer.createDirectory(this.ctxNode);
      }
      input.type = "file";
      input.multiple = true;
      input.click();
      input.addEventListener(
        "change",
        (event) => {
          // const files = event.target.files;
          const files = input.files;
          let filelist = new Array();
          for (const file of files) {
            filelist.push(file);
          }
          const sizes = filelist.map((el) => el.size);
          const filesSize = sizes.reduce((a, b) => a + b);
          if (filesSize > maxSize) {
            alert(
              this.$t("spinal-twin.ErrorFileTooLarge") +
                maxSize / 1000000 +
                " MB"
            );
            return;
          }

          //   filelist.forEach((f) => {
          //     FileExplorer.addFileUpload(this.directory, f)
          // })

          FileExplorer.addFileUpload(this.directory, input.files);
          // FileExplorer.uploadFiles(this.ctxNode, input.files);
          this.$emit("reload");
          this.update(this.Properties.view.serverId);
        },
        false
      );
    },
    exploreDocument(id) {
      const file = this.docAt(id);
      file._ptr.load((path) => {
        // this.srcP = `/sceen/_?u=${path._server_id}`;
        let srcP = `/sceen/_?u=${path._server_id}`;

        EventBus.$emit("document-viewer-mode", {
          document: srcP,
          type: file.name._data.endsWith(".pdf") ? "pdf" : "other",
        });

        // axios
        //   .get(`/sceen/_?u=${path._server_id}`, { responseEncoding: "utf8" })
        //   .then((data) => {
        //     EventBus.$emit("document-viewer-mode", data.request.responseURL)
      });
    },

    async delDocument(id) {
      if (!this.directory) return;
      for (let i = 0; i < this.directory.length; ++i) {
        if (this.directory[i]._server_id == id) {
          this.directory.splice(i, 1);
          this.documents.splice(i, 1);
        }
      }
    },

    downloadDocument(id) {
      const file = this.docAt(id);
      file._ptr.load((path) => {
        var element = document.createElement("a");
        element.setAttribute("href", "/sceen/_?u=" + path._server_id);
        element.setAttribute("download", file.name);
        element.click();
      });
    },

    async debug(what) {
      console.debug("Debugging", what);
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
.parent-document-divider {
  color: #58727e;
}
.parent-document-divider-text {
  color: #58727e;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200;
}

.actions-documentation{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>

