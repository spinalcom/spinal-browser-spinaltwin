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
  <div v-if="Properties.items !== false">
    <el-container>
      <el-header>
        {{ $t(`node-type.${Properties.items.nodeType}`) }}
        <div  style="float: right">
          <el-button
            icon="el-icon-download"
            circle
            @click.stop="exportToExcel()">
          </el-button>
          <el-button
            icon="el-icon-picture-outline-round"
            circle
            @click.stop="SeeAll()">
          </el-button>
          <el-button
            icon="el-icon-aim"
            circle
            @click.stop="isolateAll()">
          </el-button>
          <el-button
            icon="el-icon-view"
            circle
            @click.stop="ShowAll()">
          </el-button>
        </div>
      </el-header>
      <el-main>
        <node-table :ref="'Explorer-table'"
                    :view-key="Properties.viewKey"
                    :items="Properties.items.items"
                    :columns="Properties.items.cols">
        </node-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
// import { spinalBackEnd } from "../../../services/spinalBackend";
import { EquipmentBack } from '../backend/EquipmentBack'
import BackendInitializer from '../../../services/BackendInitializer'
import { EventBus } from "../../../services/event";
import '../../../services/EventHandler';

import NodeTable from './NodeTable.vue'

export default {
  name: "Explorer",
  components: { NodeTable },
  props : {
    Properties:
    {
      required: true,
      type: Object,
      validator: function (value)
      {
        if (value.viewKey == "")
        {
          return('danger')
        }
        return('success')
      }
    }
  },
  data() {
    return {
      items: false,
      contextServId: 0,
      currentView: null,
    };
  },
  methods: {
    changeView(item) {
      ViewManager.getInstance(this.Properties.viewKey).push(item.name, item.serverId);
    },
    SeeAll() {
      this.$refs["Explorer-table"].SeeAll(this.Properties.view.serverId);
    },
    isolateAll()
    {
      this.$refs["Explorer-table"].isolateAll(this.Properties.view.serverId);
    },
    exportToExcel() {
      this.$refs["Explorer-table"].exportToExcel();
    },
    ShowAll()
    {
      this.$refs["Explorer-table"].ShowAll();
    },
    async debug(what)
    {
      console.debug("Debugging", what);
    },
  },
};
</script>