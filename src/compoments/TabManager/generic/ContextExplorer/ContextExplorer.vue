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
    <div class="spl-button-bar">
      <el-tooltip :content="$t('spinal-twin.ColorSwitch')">
        <button-switch
          :active="colored"
          @click.native="Color"
          class="spl-el-button"
          icon="el-icon-picture-outline-round"
        ></button-switch>
      </el-tooltip>
      <el-tooltip :content="$t('spinal-twin.DownloadList')">
        <el-button
          @click.stop="exportToExcel()"
          class="spl-el-button"
          icon="el-icon-download"
          circle
        ></el-button>
      </el-tooltip>
    </div>

    <div v-if="Properties.items !== false" style="height: calc(100% - 52px)">
      <context-explorer-node-table
        :ref="'Explorer-table'"
        :view-key="Properties.viewKey"
        :items="itemsComputed"
        :columns="cols"
        :relation="Properties.relation"
        :depth="Properties.depth"
        :context="Properties.context"
        @select="Select"
        @isolate="Isolate"
      >
      </context-explorer-node-table>
    </div>
  </div>
</template>

<script>
// Tools
import { EventBus } from '../../../../services/event';
import { viewerState } from './viewerState';

// Components
import ButtonSwitch from '../../../../compoments/ButtonSwitch';
import ContextExplorerNodeTable from '../ContextExplorer/ContextExplorerNodeTable.vue';

export default {
  name: 'ContextExplorer',
  components: {
    ContextExplorerNodeTable,
    ButtonSwitch,
  },
  props: {
    Properties: {
      type: Object,
      required: true,
      validator: function (value) {
        if (!value.viewKey instanceof String) {
          return false;
        }
        return true;
      },
    },
  },

  data() {
    return {
      items: false,
      colored: viewerState.colored(),
    };
  },

  computed: {
    itemsComputed() {
      if (
        this.Properties &&
        this.Properties.items &&
        this.Properties.items.items
      ){
        return this.Properties.items.items;
      }
        
      return [];
    },
    cols() {
      if (
        this.Properties &&
        this.Properties.items &&
        this.Properties.items.cols
      ){
        return this.Properties.items.cols;
      }
      return [];
    },
  },
  methods: {
    Color() {
      viewerState.changeColoration();
      EventBus.$emit('viewer-reset-color');
      this.$refs['Explorer-table'].isColored = false;
      if (viewerState.colored()) {
        this.$refs['Explorer-table'].Color();
      }
      this.colored = viewerState.colored();
    },

    Select(item) {
      EventBus.$emit('viewer-select', item, this.Properties.relation);
    },

    Isolate(item) {
      viewerState.changeIsolation();
      EventBus.$emit('viewer-reset-isolate');
      if (viewerState.isolated()) this.$refs['Explorer-table'].Isolate();
    },

    exportToExcel() {
      this.$refs['Explorer-table'].exportToExcel();
    },

    async debug(what) {
      console.debug('Debugging', what);
    },
  },
};
</script>

<style scoped>
.spl-el-button {
  margin: 0 0 0 10px;
}

.button-switch{
  border: 1px solid #dcdfe6;
}

.spl-button-bar {
  overflow: hidden;
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}

.spinal-height-control {
  height: auto;
  /* overflow:scroll; */
}

.primary {
  background: 'blue';
  color: blue;
}
</style>

<style>
.el-button--primary:focus, .el-button--primary:hover {
    color: #409eff;
    background-color: #ecf5ff;
    border-color: #c6e2ff;
}
.el-button--primary{
    color: #409eff;
    background-color: #ecf5ff;
    border-color: #409eff;
}

</style>
