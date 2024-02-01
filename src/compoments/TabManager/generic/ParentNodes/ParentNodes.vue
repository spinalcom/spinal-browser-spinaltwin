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
    <div style="height: inherit">
      <el-table
        :data="parents"
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
        <el-table-column label="Name">
          <div slot-scope="scope">
            {{ scope.row.getName().get() }}
          </div>
        </el-table-column>
        <el-table-column label="Type">
          <div slot-scope="scope">
            {{ scope.row.getType().get() }}
          </div>
        </el-table-column>
        <el-table-column label="Actions" width="120">
          <!-- <div slot-scope="scope">
            <el-tooltip :content="$t('spinal-twin.explore-document')">
              <el-button
                @click.native="exploreDocument(scope.row._server_id)"
                icon="el-icon-search"
                circle
              ></el-button>
            </el-tooltip>
          </div> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// imports
import { SpinalGraphService, SpinalContext } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
// import * as inventoryUtils from "../../../../services/utlils/inventory";
import { EventBus } from "../../../../services/event";

export default {
  name: "ParentNodes",
  props: {
    Properties: {
      type: Object,
      required: true,
      default: undefined,
      validator: function (value) {
        if (!value.viewKey instanceof String) {
          return false;
        }
        return true;
      },
    },
  },
  components: {},

  data() {
    return {
      ctxNode: false,
      context: false,
      spaceInventoryLoader: false,
      parents: []
    };
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
    const promise = new Promise((res, rej) => {
      this.ctxNode = false;
      res();
    });
    // promise.then(async () => {
    //   await this.update(this.Properties.view.serverId);
    // });
    EventBus.$on("click-on_spinal-twin.ParentNodes", async () => {
      // await this.update(this.ctxNode._server_id);
      await this.update(this.Properties.view.serverId);
    });
  },

  methods: {
    async update(id) {
      this.ctxNode = FileSystem._objects[id];
      this.parents = await FileSystem._objects[id].getParents();
      this.parents = this.parents.filter(el => {
        return !(el instanceof SpinalContext);
      })
    }
  },
};
</script>

<style scoped>
.inventory-tab-buttons {
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
}
</style>
