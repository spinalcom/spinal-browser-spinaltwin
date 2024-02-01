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
  <el-container v-if="ctxNode">
    <div style="overflow: auto">
      <h4 class="box-node-name">
        {{ ctxNode.info.name.get() + " : " + $t('datas.current-value')}}
      </h4>
      <div class="control-endpoint-grid">
        <insight-control-endpoint-box
          v-for="endpoint of endpoints"
          :key="endpoint.id"
          :name="endpoint.name"
          :endpoint="endpoint"
          :targetName="ctxNode.getName().get()"
        ></insight-control-endpoint-box>
      </div>

      <!-- <h4> Room's equipment </h4>
      <div class="control-endpoint-grid">
        <insight-control-endpoint-box
          v-for="endpoint of childrenEndpoints"
          :key="endpoint.id"
          :name="endpoint.name"
          :endpoint="endpoint"
        ></insight-control-endpoint-box>
      </div> -->
    </div>
  </el-container>
</template>

<script>
// Tools
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import {EventBus} from "../../../../services/event"

// Components
import InsightControlEndpointBox from './InsightControlEndpointBox.vue';

export default {
  name: 'InsightEndpoint',
  components: { InsightControlEndpointBox },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      endpoints: false,
      childrenEndpoints: [],
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp && newProp.view && newProp.view.serverId != 0) {
          // await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    // this.update();
    EventBus.$on("click-on_spinal-twin.Endpoints", async ()=> await this.update());
  },

  methods: {
    async update() {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[this.Properties.view.serverId];
      /*if (this.ctxNode.info.type.get() == 'geographicRoom') {
        let children = await SpinalGraphService.getChildrenInContext(
          this.ctxNode.info.id.get(),
          FileSystem._objects[this.Properties.context].info.id.get()
        );
        for (const child of children) {
          let temp = await this.getNodeEndpointsInfo(
            child.id.get(),
            'hasEndPoint'
          );
          if (typeof temp !== 'undefined') {
            this.childrenEndpoints = this.childrenEndpoints.concat(temp);
          }
        }
      }*/
      this.endpoints = await this.getNodeEndpointsInfo(
        this.ctxNode.info.id.get(),
        ['hasEndPoint', 'hasBmsEndpoint', 'hasBmsDevice']
      );

    },







    // return infos from an endpointNodeId
    async getEndpointInfo(endpointNodeId) {
      let realnode = SpinalGraphService.getRealNode(endpointNodeId);
      let attributesLstModels = await serviceDocumentation.getAllAttributes(
        realnode
      );

      let attributes = attributesLstModels.map((el) => el.get());
      let endpointInfo = {};
      for (let attr of attributes) {
        endpointInfo[attr.label] = attr.value;
      }
      endpointInfo.endpointNodeId = endpointNodeId;
      // const infos = await realnode.element.load();

      // endpointInfo.name = infos.name.get();
      // endpointInfo.id = realnode.info.id.get();
      // endpointInfo.currentValue = infos.currentValue.get();
      // // endpointInfo.saveTimeSeries = infos.saveTimeSeries.get();
      // endpointInfo.unit = infos.unit.get();

      return endpointInfo;
    },

    async getNodeEndpointsInfo(nodeId, endpointRelation) {
      let endpointProfilsModel = await SpinalGraphService.getChildren(
        nodeId,
        endpointRelation
      );
      if (endpointProfilsModel.length == 0) return; // si la node n'a pas d'endpoints on quitte la fonction
      let res = [];
      // premier automate associé ( à changer si besoin )
      /*if (endpointProfilsModel[0].type.get() == 'BmsDevice') {
        const endpointsModels = await SpinalGraphService.getChildren(
          endpointProfilsModel[0].id.get(),
          'hasBmsEndpoint'
        );
        const endpoints = endpointsModels.map((el) => el.get());
        for (const endpoint of endpoints) {
          // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          res.push(info);
        }
      } else {
        for (const endpoint of endpointProfilsModel) {
          // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          res.push(info);
        }
      }*/

      for(let child of endpointProfilsModel){
        let temp = await this.findEndpointInfo(child.id.get(), [], [...endpointRelation, "hasBmsEndpointGroup"]);
        res = res.concat(temp);
        // if(child.type.get() == "BmsDevice"){
        //   let temp = await this.findEndpointInfo(child.id.get(), [], [...endpointRelation, "hasBmsEndpointGroup"]);
        //   res = res.concat(temp);
        // }
        // else if(child.type.get() == "BmsEndpoint"){
        //   let temp = await this.getEndpointInfo(child.id.get());
        //   res.push(temp);
        // }
      }
      return res;
    },

    async findEndpointInfo(nodeId, res, relations){
      let node = SpinalGraphService.getRealNode(nodeId);
      if(node.getType().get() == "BmsEndpoint"){
        let info = await this.getEndpointInfo(nodeId);
        res.push(info);
        return res;
      }
      else{
        let children = await SpinalGraphService.getChildren(nodeId, relations);
        for(let child of children){
          if(child.type.get() == "BmsEndpoint"){
            let info = await this.getEndpointInfo(child.id.get());
            res.push(info);
          }
          else{
            return await this.findEndpointInfo(child.id.get(), res, relations);
          }
        }
        return res;
      }
      
      
    }
  },
};
</script>

<style scoped>
.control-endpoint-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 70vh;
  overflow: auto;
}
.box-node-name{
  text-align: center;
}
</style>
