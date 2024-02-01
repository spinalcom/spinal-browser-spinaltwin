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
    <table-vue></table-vue>
  </div>
</template>

<script>
import Table from '../../compoments/insight/table.vue';
import { EventBus } from "../../services/event";

export default {
  components: {
    'table-vue': Table,
  },
  data() {
    return {};
  },
  async mounted(){
    // EventBus.$on("Autodesk.Viewing.SELECTION_CHANGED_EVENT", async (res) => {
    //   if(res.dbIdArray[0] != undefined){
    //       let bimObjectNodeModel = await window.spinal.BimObjectService.getBIMObject(res.dbIdArray[0], res.model);
    //       EventBus.$emit("Insight.Autodesk.Viewing.SELECTION_CHANGED_EVENT", bimObjectNodeModel);
    //       // let parents = await SpinalGraphService.getParents(bimObjectNodeModel.id.get(), "hasReferenceObject.ROOM");
    //       // if(parents.length !=0 ){
    //       //   let parentNode = SpinalGraphService.getRealNode(parents[0].id.get());
    //       //   let index = tableComponent.data.findIndex(el => el.serverId == parentNode._server_id);
    //       //   if(index != -1){
    //       //     tableComponent.setCurrentRow(this.data[index]);
    //       //     let rowsElement = tableComponent.$el.getElementsByClassName("context-node-explorer-table-row");
    //       //     rowsElement[index].scrollIntoView({block: "center" });
    //       //   }
    //       // }
    //     }
    //   // EventBus.$emit("Insight.Autodesk.Viewing.SELECTION_CHANGED_EVENT");
    // });
    
  },
  beforeDestroy(){
    // EventBus.$off("Autodesk.Viewing.SELECTION_CHANGED_EVENT");
  }
};
</script>
