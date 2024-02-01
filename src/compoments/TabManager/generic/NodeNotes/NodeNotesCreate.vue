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
    <el-container style="overflow: hidden">
      <el-dropdown class="spl-input-button">
        <el-button type="primary">
          Options
          <i class="el-icon-arrow-up el-icon--right"/>
        </el-button>
        <el-dropdown-menu
          slot="dropdown"
          style="overflow: hidden"
        >
          <el-tooltip
            :content="$t('spinal-twin.NotesAddPosition')"
            placement="right"
          >
            <el-dropdown-item
              v-on:click.native="addPostion()"
              icon="el-icon-position"
            ></el-dropdown-item>
          </el-tooltip>
          <el-tooltip
            :content="$t('spinal-twin.NotesAddScreenshot')"
            placement="right"
          >
            <el-dropdown-item
              v-on:click.native="addScreenshot()"
              icon="el-icon-camera"
            ></el-dropdown-item>
          </el-tooltip>
          <el-tooltip
            :content="$t('spinal-twin.NotesAddFile')"
            placement="right"
          >
            <el-dropdown-item
              v-on:click.native="addFile()"
              icon="el-icon-paperclip"
            ></el-dropdown-item>
          </el-tooltip>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input
        v-model="new_note"
        v-on:keydown.enter.native="enterHandler"
        type="textarea"
        resize="none"
      ></el-input>
      <el-tooltip :content="$t('spinal-twin.NoteSend')">
        <el-button
          v-on:click.native="sendNote()"
          class="spl-input-button"
          icon="el-icon-s-promotion"
          type="primary"
        >
          {{ $t('spinal-twin.NoteSend') }}
        </el-button>
      </el-tooltip>
    </el-container>
    <el-card
      v-if="attachment"
      style="margin: 20px; position: relative; width: 90%"
    >
      {{ attachment.file.name }}
      <el-tooltip :content="$t('spinal-twin.NotesDeleteAttachment')">
        <el-button
          v-on:click.native="delAttachment()"
          class="spl-input-button"
          icon="el-icon-circle-close"
          type="danger"
          circle
          size="small"
          style="position: absolute; top: 15px; right: 0"
        >
        </el-button>
      </el-tooltip>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import { FileSystem } from 'spinal-core-connectorjs_type'
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";

export default {
  name: "NodeNotesCreate",
  props: {
    node: {
      required: true,
      type: Object,
    },
  },

  computed:
  {
    user()
    {
      return {
        username: "admin",
        userId: FileSystem._user_id
      };
    }
  },

  data() {
    return {
      new_note: "",
      attachment: undefined,
    };
  },

  methods: {
    enterHandler: function (e)
    {
      if (e.ctrlKey) this.sendNote();
    },

    async $_sendnote(text, type, file = undefined, state = undefined, contextID = undefined, groupID = undefined)
    {
      if(file != undefined){
        return await serviceDocumentation.twinAddNote(
          this.node,
          this.user,
          text,
          type,
          file,
          state,
          contextID,
          groupID
        );
      }
      else{
        return await serviceDocumentation.twinAddNote(
          this.node,
          this.user,
          text,
          type,
          [undefined],
          state,
          contextID,
          groupID
        );
      }
      
    },

    async sendNote()
    {
      let pack = {
        type: "text",
        file: undefined,
        view: undefined,
      }
      if (this.attachment)
      {
        if (this.new_note.trim() === "")
        {
          this.new_note = this.attachment.file.name;
        }
        pack.type = this.attachment.type;
        pack.file = this.attachment.file;
        pack.view = this.attachment.view;
      }
      await this.$_sendnote(this.new_note, pack.type, pack.file, pack.view)
      this.$emit("send-note", this.new_note, pack);
      this.new_note = "";
      this.attachment = undefined;
    },

    delAttachment()
    {
      this.attachment = undefined;
    },

    getScreenShotFile(isViewPoint = false) {
      return new Promise(async (resolve) => {
        window.spinal.SpinalForgeViewer.viewerManager.viewer.getScreenShot(
          0, 0,
          async (url) => {
            let blob = await fetch(url).then((r) => r.blob());
            let fileName = (isViewPoint ? "viewPoint" : "screenshot")
              + ` of ${this.node.getName().get()} from `
              + `${moment().format("L")}.png`;
            blob.lastModifiedDate = new Date();
            blob.name = fileName;
            resolve(blob);
          }
        );
      });
    },

    async getViewPoint() {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      const viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
      const filter = {
        guid: true,
        seedURN: true,
        overrides: true,
        objectSet: false,
        viewport: true,
        renderOptions: true,
      };
      const file = await this.getScreenShotFile(true);
      let state = {
        viewState: undefined,
        objectState: undefined
      };
      const viewerState = viewer.getState(filter);
      const objectState = {
        isolated: viewer
          .getAggregateIsolation()
          .map((el) => ({ modelId: el.model.id, ids: el.ids })),
        selected: viewer
          .getAggregateSelection()
          .map((el) => ({ modelId: el.model.id, selection: el.selection })),
      };
      state.viewState = JSON.stringify(viewerState, getCircularReplacer());
      state.objectState = JSON.stringify(objectState, getCircularReplacer());
      return {file, state};
    },

    async addPostion()
    {
      const viewPoint = await this.getViewPoint();
      this.attachment = {
        type: "view",
        file: viewPoint.file,
        view: viewPoint.state
      };
    },

    async addScreenshot()
    {
      const file = await this.getScreenShotFile();
      this.attachment = {
        type: "img",
        file: file,
        view: undefined
      };
    },

    addFile()
    {
      const maxSize = 25000000;
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = false;
      input.click();
      input.addEventListener(
        "change",
        (event) => {
          const files = event.target.files;
          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }
          const sizes = filelist.map((el) => el.size);
          const filesSize = sizes.reduce((a, b) => a + b);
          if (filesSize > maxSize) {
            alert(
              $t('spinal-twin.ErrorFileTooLarge') + "25 MB"
            );
            return;
          }
          this.attachment = {
            type: "img",
            file: filelist[0],
            view: undefined
          };
        },
        false
      );
    },
  },
}
</script>

<style scoped>

.spl-input-button
{
  height: min-content;
  margin: auto 10px auto 10px;
  width: min-content;
}
</style>