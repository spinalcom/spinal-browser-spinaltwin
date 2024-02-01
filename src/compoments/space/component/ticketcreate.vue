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
        ////////////////////////////////// Tableau Categorie Ticket /////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////-->
      <div class="radio-cas">
        <el-cascader-panel
          v-on:change="cascaderSelection"
          :props="props"
        ></el-cascader-panel>
      </div>
      <br />

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
        ////////////////////////////////// Formulaire tickey /////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-form
        :disabled="isFormDisable"
        ref="form"
        :model="form"
        label-width="120px"
      >
        <el-form-item label="Resources">
          <el-radio-group v-model="form.priority">
            <el-radio label="0">Occasionally</el-radio>
            <el-radio label="1">Normal</el-radio>
            <el-radio label="2">Urgent</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Activity form">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Annuler</el-button>
        <el-button type="primary" @click="confirmTicket">Confirmer</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { serviceTicketPersonalized } from 'spinal-service-ticket';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

export default {
  data() {
    return {
      dialogFormVisible: false,
      isFormDisable: true,
      form: { description: '', priority: 0 },
      props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          if (node.level === 0) {
            const contextList = await serviceTicketPersonalized.getContexts();
            const res = contextList.map((itm) => {
              return { value: itm.id, label: itm.name, leaf: false };
            });
            resolve(res);
          } else if (node.level === 1) {
            const processLst = await serviceTicketPersonalized.getAllProcess(
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
            const CommonIncidentLst =
              await serviceTicketPersonalized.getCommonIncident(
                node.data.value
              );
            const res = CommonIncidentLst.map((itm) => {
              return { value: itm.id, label: itm.name, leaf: true };
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
      this.ticketContextId = value[0];
      this.ticketProcessId = value[1];
      this.ticketCommonId = value[2];
      this.isFormDisable = false;
    },
    confirmTicket() {
      this.dialogFormVisible = false;
      const commonName = SpinalGraphService.getInfo(this.ticketCommonId);
      this.form.name = commonName && commonName.name.get();

      serviceTicketPersonalized
        .addTicket(
          this.form,
          this.ticketProcessId,
          this.ticketContextId,
          this.nodeId
        )
        .then(() => {
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
