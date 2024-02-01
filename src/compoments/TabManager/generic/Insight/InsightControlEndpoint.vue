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
  <!-- <el-container
    v-if="
      ctxNode &&
      ctxNode.info.type.get() == 'geographicRoom' &&
      typeof endpoints !== 'undefined' &&
      endpoints.length != 0
    "
  > -->
  <el-container v-if="ctxNode">
    <div style="overflow: auto">
      <h4 class="box-node-name">
        {{ ctxNode.info.name.get() + " : " + $t('datas.current-value')}}
      </h4>
      <div>
        <div v-for="eq of endpoints" :key="eq.name">
          <div class="control-endpoint-grid">
            <insight-control-endpoint-box
              v-for="end of eq.info"
              :key="end.name"
              :name="end.name"
              :endpoint="end"
              :targetName="ctxNode.getName().get()"
            ></insight-control-endpoint-box>
          </div>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
// imports
import InsightControlEndpointBox from "./InsightControlEndpointBox.vue";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { EventBus } from "../../../../services/event"

export default {
  name: "InsightControlEndpoint",
  components: { InsightControlEndpointBox },
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

  data() {
    return {
      ctxNode: false,
      endpoints: false,
      controlEndpoints: false,
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          this.ctxNode = FileSystem._objects[newProp.view.serverId]
          // await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    const promise = new Promise((res,rej)=>{
      this.ctxNode=false;
      this.endpoints=false;
      this.controlEndpoints=false;
      res();
    })
    promise.then(async ()=>{
      this.ctxNode = FileSystem._objects[this.Properties.view.serverId]
      EventBus.$on("insight-breadcrumb-click", async serverId => {
      await this.update(serverId);
    });
    EventBus.$on("click-on_spinal-twin.ControlEndpoints", async () => {
      await this.update(this.ctxNode._server_id);
    });
      // await this.update(this.Properties.view.serverId);
    })
    // EventBus.$on("insight-breadcrumb-click", async serverId => {
    //   await this.update(serverId);
    // });
    // EventBus.$on("click-on_spinal-twin.ControlEndpoints", async () => {
    //   await this.update(this.ctxNode._server_id);
    // });
    
  },

  methods: {
    async update(id) {
      // update tab infos from current node
      // this.ctxNode = FileSystem._objects[id];
      this.endpoints = await this.getNodeEndpointsInfo(
        this.ctxNode.info.id.get(),
        "hasControlPoints"
      );


    },

    // return infos from an endpointNodeId
    async getEndpointInfo(endpointNodeId) {
      const realnode = SpinalGraphService.getRealNode(endpointNodeId);
      const attributesLstModels = await serviceDocumentation.getAllAttributes(
        realnode
      );
      const attributes = attributesLstModels.map((el) => el.get());
      const endpointInfo = {};
      for (const attr of attributes) {
        endpointInfo[attr.label] = attr.value;
      }
      endpointInfo.endpointNodeId = endpointNodeId;
      return endpointInfo;
    },

    async getNodeEndpointsInfo(nodeId, endpointRelation) {
      const endpointProfilsModel = await SpinalGraphService.getChildren(
        nodeId,
        endpointRelation
      );
      if (endpointProfilsModel && endpointProfilsModel.length == 0) return; // si la node n'a pas d'endpoints on quitte la fonction
      if (endpointRelation == "hasControlPoints") {
        // on cherche les control endpoints (onglet insight)
        const res = [];
        for (const endpointProfil of endpointProfilsModel) {
          // pour chaque profil de control endpoint
          /** on récupère la data */
          const endpointsModels = await SpinalGraphService.getChildren(
            endpointProfil.id.get(),
            "hasBmsEndpoint"
          );
          const endpoints = endpointsModels.map((el) => el.get());
          const infos = [];

          for (const endpoint of endpoints) {
            // pour chaque control endpoint
            /** on récupère la data */
            const info = await this.getEndpointInfo(endpoint.id);
            info.controlpointNodeId = endpointProfil.id.get();
            infos.push(info);
          }
          res.push({
            name: endpointProfil.name.get(),
            nodeId: endpointProfil.id.get(),
            info: infos,
          });
        }
        return res;
      }
    },
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
