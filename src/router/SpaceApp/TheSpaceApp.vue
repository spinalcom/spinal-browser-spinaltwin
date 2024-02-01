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
  <div class="space-center">
    <spinal-breadcrumb class="application-breadcrumb" :view-key="viewKey"></spinal-breadcrumb>
    <div class="Back-node-button-bar" v-if="currentView.name != viewKey">
      <el-tooltip :content="$t('spinal-twin.Back')">
        <el-button
          v-show="showBackButton != false"
          @click.stop="popView()"
          class="spl-el-button"
          style="float: left"
          icon="el-icon-arrow-left"
          circle
        >
        </el-button>
      </el-tooltip>
      <div class="selected-node">{{currentView.name}}</div>
      <div class="spl-button-bar">
        <el-tooltip :disabled="!isNode" :content="$t('spinal-twin.Isolate')">
          <button-switch
            @click.native="isolateAll"
            :disabled="!isNode"
            :active="isolated"
            class="spl-el-button"
            icon="el-icon-aim"
          ></button-switch>
        </el-tooltip>
        <el-tooltip :disabled="!isNode" :content="$t('spinal-twin.Select')">
          <el-button
            :disabled="!isNode"
            @click.stop="selectInView()"
            circle
            class="spl-el-button"
            icon="el-icon-location"
          >
          </el-button>
        </el-tooltip>
        <el-tooltip :disabled="!isNode" content="Zoom">
          <el-button
            :disabled="!isNode"
            @click.stop="zoomOn()"
            circle
            class="spl-el-button"
            icon="el-icon-search"
          >
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="Back-node-button-bar-is-not-necessary" v-else>
      <div class="selected-node">{{currentView.name}}</div>
    </div>

    <tab-manager
      :tabsprop="tabs"
      ref="tab-manager"
      class="tab-manager"
    ></tab-manager>
  </div>
</template>

<script>
// Script & tools
import { ViewManager } from '../../services/ViewManager/ViewManager';
import { AppBack } from '../../services/backend/AppBack';
import BackendInitializer from '../../services/BackendInitializer';
import { EventBus } from '../../services/event';
import excelManager from 'spinal-env-viewer-plugin-excel-manager-service';
import fileSaver from 'file-saver';
import { viewerState } from '../../compoments/TabManager/generic/ContextExplorer/viewerState.ts';
import { 
  SPACE_CONTEXT_TYPE,
  SPACE_CATEGORY_TYPE,
  SPACE_GROUP_TYPE,
  GEO_ROOM_TYPE,
  SPACE_RELATION_LIST,
  SPACE_ROOM_RELATION,
} from '../../constants';
import { getSurfaceFromNode } from '../DataApp/DataTools';


// Generic components
import SpinalBreadcrumb from '../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue';
import TabManager from '../../compoments/TabManager/TabManager.vue';
import ButtonSwitch from '../../compoments/ButtonSwitch.vue';
import ContextExplorer from '../../compoments/TabManager/generic/ContextExplorer/ContextExplorer.vue';
import CategoryAttribute from '../../compoments/TabManager/generic/CategoryAttribute.vue';
import NodeDocumentation from '../../compoments/TabManager/generic/NodeDocumentation.vue';
import NodeTickets from '../../compoments/TabManager/generic/NodeTickets/NodeTickets.vue';
import NodeNotes from '../../compoments/TabManager/generic/NodeNotes/NodeNotes.vue';
import NodeCalendar from '../../compoments/TabManager/generic/NodeCalendar/NodeCalendar.vue';
import NodeNotesMessage from '../../compoments/TabManager/generic/NodeNotes/NodeNotesMessage.vue';
import InsightEndpoint from '../../compoments/TabManager/generic/Insight/InsightEndpoint.vue';
import InsightControlEndpoint from '../../compoments/TabManager/generic/Insight/InsightControlEndpoint.vue';
import TabChart from './TabChart.vue';
import Inventory from  "../../compoments/TabManager/generic/Inventory/Inventory.vue"
import SpaceConfiguration from "../../compoments/TabManager/generic/Configuration/SpaceConfiguration.vue"

const VIEW_KEY = 'SpaceApp';

const SPACE_APP_RELATIONS = [
  ...SPACE_RELATION_LIST,
  'hasReferenceObject.ROOM',
  'hasBimObject',
];

// Component exports
export default {
  name: 'TheSpaceApp',
  components: {
    SpinalBreadcrumb,
    TabManager,
    ButtonSwitch,
    NodeNotesMessage,
    NodeTickets,
    NodeCalendar,
  },

  data() {
    return {
      viewKey: VIEW_KEY,
      items: {},
      currentView: false,
      showBackButton: false,
      isNode: false,
      isolated: false,
      tabs: [
        {
          name: 'node-type.context',
          content: ContextExplorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
            relation: SPACE_APP_RELATIONS,
            context: false,
          },
          ignore: false,
          ignoreContext: false,
        },
        {
          name: 'spinal-twin.SpaceConfiguration',
          content: SpaceConfiguration,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
            relation: SPACE_APP_RELATIONS,
            context: false,
          },
          ignore: false,
          ignoreContext: false,
        },
        // {
        //   name: 'spinal-twin.Chart',
        //   content: TabChart,
        //   props: {
        //     viewKey: VIEW_KEY,
        //     view: false,
        //     chart: [],
        //   },
        //   ignore: true,
        //   ignoreContext: true,
        // },

        {
          name: 'spinal-twin.hasCategoryAttributes',
          content: CategoryAttribute,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },

        {
          name: 'spinal-twin.Documentation',
          content: NodeDocumentation,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },

        {
          name: 'spinal-twin.Notes',
          content: NodeNotes,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },

        {
          name: 'spinal-twin.Tickets',
          content: NodeTickets,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },
        {
          name: 'spinal-twin.ControlEndpoints',
          content: InsightControlEndpoint,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },
        {
          name: 'spinal-twin.Endpoints',
          content: InsightEndpoint,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },
        {
          name: "spinal-twin.Inventory",
          content: Inventory,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
          ignoreContext: true,
        },
      ],
    };
  },

  async mounted() {
    const graph = await BackendInitializer.getInstance().getGraph();
    await AppBack.getInstance().init(graph, SPACE_CONTEXT_TYPE);
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    await ViewManager.getInstance(this.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
  },

  methods: {
    async onViewChange(view) {
      // Get items from graph
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await AppBack.getInstance().getContexts(SPACE_ROOM_RELATION);
        this.isNode = false;
      } else {
        this.isNode = true;
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await AppBack.getInstance().getItems(
          view.serverId,
          this.contextServId,
          SPACE_ROOM_RELATION
        );
      }

      // Get children
      for (const [nodeType, items] of mapItems) {
        this.items.nodeType = nodeType;
        this.items.items = items;
      }

      // await Promise.all(
      //   this.items.items.map(async function (item) {
      //     item['TotalEquipments'] = await getEquipmentNumber(item);
      //   })
      // );

      await Promise.all(
        this.items.items.map(async function (item) {
          item['Area'] = await getSurfaceFromNode(item);
        })
      );

      this.currentView = view;
      if(this.currentView.serverId !=0){
        this.showBackButton = true;
      }
      
      this.setColumns(view);

      if (this.isolated == true) {
        viewerState.changeIsolation();
        EventBus.$emit('viewer-reset-isolate');
        this.isolated = false;
      }

      // Update tabs
      this.tabs[0].props.items = this.items;
      this.tabs[0].props.context = this.contextServId;
      this.updateNames();
      for (let tab of this.tabs) {
        tab.props.view = this.currentView;
      }
      if (this.isNode) {
        for (let tab of this.tabs) {
          tab.ignore = false;
        }
      } else {
        for (let i = 2; i < this.tabs.length; ++i) {
          this.tabs[i].ignore = this.tabs[i].ignoreContext;
        }
      }
      // this.updateChart();
    },

    setColumns(view) {
      let node = FileSystem._objects[view.serverId];
      this.items.cols = [];
      if (!node) {
        this.items.cols = ['CategoryCount'];
        return;
      }
      let nodeType = node.info.type.get();
      switch (nodeType) {
        case SPACE_CONTEXT_TYPE:
          this.items.cols = ['GroupCount', 'Area'];
          break;
        case SPACE_CATEGORY_TYPE:
          this.items.cols = ['RoomCount', 'Area'];
          break;
        default:
          this.items.cols = ['Area'];
      }
    },

    // updateChart() {
    //   if (!this.isNode)
    //   {
    //     this.tabs[1].ignore = true;
    //     return;
    //   }
    //   console.debug("Items", this.items);
    //   if (this.items.nodeType == GEO_ROOM_TYPE)
    //   {
    //     this.tabs[1].ignore = true;
    //     return;
    //   }
    //   this.tabs[1].props.chart = [];
    //   for (item of this.items.items)
    //   {
    //     console.debug(item.name, item.serverId);
    //     var node = FileSystem._objects[item.serverId]
    //     this.tabs[1].props.chart.push({
    //       name: node.info.name.get(),
    //       rooms: Array.from(item.children.values())[0],
    //       color: node.info.color.get()
    //     });
    //   }
    // },

    updateNames() {
      this.tabs[0].name = `node-type.${this.items.nodeType}`;
    },

    popView() {
      ViewManager.getInstance(this.viewKey).pop();
    },

    zoomOn() {
      EventBus.$emit('viewer-zoom', this.currentView, SPACE_APP_RELATIONS);
    },

    isolateAll() {
      viewerState.changeIsolation();
      EventBus.$emit('viewer-reset-isolate');
      this.isolated = false;
      if (viewerState.isolated()) {
        this.isolated = true;
        EventBus.$emit(
          'viewer-isolate',
          [this.currentView],
          SPACE_APP_RELATIONS
        );
      }
    },

    selectInView() {
      EventBus.$emit(
        'viewer-select',
        this.currentView,
        SPACE_APP_RELATIONS
      );
    },

    formatData() {
      const res = [];
      for (const item of this.items.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
        };
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
          }
        } else if (FileSystem._objects[item.serverId] !== undefined) {
          let thisnode = FileSystem._objects[item.serverId];
          if (thisnode.children.PtrLst !== undefined) {
            for (const name of thisnode.children.PtrLst._attribute_names) {
              resItem[name] = thisnode.children.PtrLst[name].length;
              resItem.haveChild = true;
            }
          }
        }
        res.push(resItem);
      }
      return res;
    },

    exportToExcel() {
      let headers = [
        {
          key: 'name',
          header: this.$t('name'),
          width: 20,
        },
      ];
      for (const column of this.items.cols) {
        headers.push({
          key: column,
          header: this.$t(column),
          width: 10,
        });
      }
      let excelData = [
        {
          name: 'Tableau',
          author: '',
          data: [
            {
              name: 'Tableau',
              header: headers,
              rows: this.formatData(),
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    },
  },
};
</script>

<style scoped>
.space-center {
  overflow: hidden;
}
.application-breadcrumb{
  display: none;
}
.Back-node-button-bar{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.Back-node-button-bar-is-not-necessary{
  display: flex;
  margin-top: 15px;
  place-content: center;
}
.selected-node{
  font-size: 16px;
  font-weight: 200;
  color: #58727e;
  letter-spacing: 1px;
}

.tab-manager {
  /* margin: 0px 10px 10px 0px; */
  height: calc(100% - 120px);
  border-radius: 5px;
}

.spl-height-control {
  height: 100%;
}

.spl-el-button {
  margin: 0 0 0 10px;
}

.spl-button-bar {
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}
</style>
