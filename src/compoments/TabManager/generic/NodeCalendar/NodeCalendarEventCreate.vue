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
      <h2>
        {{ $t('spinal-twin.EventAdd') }}
      </h2>
    </el-header>

    <el-main>
      <el-cascader-panel
        v-on:change="cascaderSelection"
        :props="props"
        style="margin: 25px"
      ></el-cascader-panel>
      <el-form
        :disabled="isFormDisable"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item :label="$t('spinal-twin.Name')">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item :label="$t('spinal-twin.StartDate')">
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

        <el-form-item :label="$t('spinal-twin.EndDate')">
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
      </el-form>
    </el-main>

    <el-footer>
      <el-button @click="cancel">
        {{ $t('Cancel') }}
      </el-button>
      <el-button type="primary" @click="confirmDate">
        {{ $t('Confirm') }}
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { SpinalEventService } from 'spinal-env-viewer-task-service';
import { FileSystem } from 'spinal-core-connectorjs_type';

export default {
  name: 'NodeCalendarEventCreate',
  components: {},
  props: {
    nodeId: {
      type: Number,
      required: true,
    },
  },
  async mounted() {},
  watch: {},

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      dialogFormVisible: false,
      isFormDisable: true,
      form: {
        name: '',
        value1: '',
        value2: '',
      },
      EventInterface: {
        contextId: '',
        groupId: '',
        categoryId: '',
        nodeId: FileSystem._objects[this.nodeId].getId().get(),
        startDate: '',
        endDate: '',
        name: '',
      },
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          if (node.level === 0) {
            const contextList = await SpinalEventService.getEventContexts();
            const res = contextList.map((itm) => {
              return {
                value: itm.id.get(),
                label: itm.name.get(),
                leaf: false,
              };
            });
            resolve(res);
          } else if (node.level === 1) {
            const processLst = await SpinalEventService.getEventsCategories(
              node.data.value
            );
            const res = processLst.map((itm) => {
              return {
                value: itm.id.get(),
                label: itm.name.get(),
                leaf: false,
              };
            });
            resolve(res);
          } else {
            const CommonIncidentLst = await SpinalEventService.getEventsGroups(
              node.data.value
            );
            const res = CommonIncidentLst.map((itm) => {
              return { value: itm.id.get(), label: itm.name.get(), leaf: true };
            });
            resolve(res);
          }
        },
      },
    };
  },
  methods: {
    cascaderSelection(value) {
      this.EventInterface.contextId = value[0];
      this.EventInterface.categoryId = value[1];
      this.EventInterface.groupId = value[2];
      this.isFormDisable = false;
    },

    confirmDate() {
      this.dialogFormVisible = false;
      this.EventInterface.startDate = new Date(this.form.value1).getTime();
      this.EventInterface.endDate = new Date(this.form.value2).getTime();
      this.EventInterface.name = this.form.name;
      SpinalEventService.createEvent(
        this.EventInterface.contextId,
        this.EventInterface.groupId,
        this.nodeInfo.selectedNode.getId().get(),
        this.EventInterface,
        {}
      ).then((result) => {
        this.$emit('reload');
      });
    },

    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>
