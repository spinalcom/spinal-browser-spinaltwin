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
    <el-button
      icon="el-icon-circle-plus-outline"
      plain
      type="primary"
      circle
      @click="dialogFormVisible = !dialogFormVisible"
    >
    </el-button>

    <div
      class="div-dialog spinal-scrollbar"
      title="Adresse d'expédition"
      v-if="dialogFormVisible"
    >
      <!-- ///////////////////////////////////////////////////////////////////////////////////-
        ////////////////////////////////// Tableau Categorie calendrier /////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////-->
      <div class="radio-cas">
        <el-cascader-panel
          v-on:change="cascaderSelection"
          :props="props"
        ></el-cascader-panel>
      </div>
      <br />

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
        ////////////////////////////////// Formulaire calendrier /////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-form
        :disabled="isFormDisable"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Start date">
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

        <el-form-item label="End date">
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Annuler</el-button>
        <el-button type="primary" @click="confirmDate">Confirmer</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { SpinalEventService } from 'spinal-env-viewer-task-service';
import { FileSystem } from 'spinal-core-connectorjs_type';

export default {
  name: 'CreateEvent',

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
          // const { level } = node;
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 }).map(item => ({
          //     value: ++id,
          //     label: `Option - ${id}`,
          //     leaf: level >= 2
          //   }));
          //   // Appelez le callback `resolve` pour renvoyer les données des noeuds enfants et indiquer que le chargement est terminé.
          //   resolve(nodes);
          // }, 1000);
        },
      },
    };
  },
  components: {},
  props: ['nodeId'],
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
  },
  async mounted() {},
  watch: {},
  beforeDestroy() {},
};
</script>

<style scoped>
.div-dialog {
  position: absolute;
  background: white;
  border: 2px gray solid;
  overflow: auto;
  z-index: 3;
  width: 100%;
  height: calc(100% - 50px);
  border-radius: 4px;
  top: 49px;
  padding: 5px;
}
.radio-cas {
  overflow-x: auto;
  padding: 5px;
}

el-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
