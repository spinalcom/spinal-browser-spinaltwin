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
  <div class="hide-overflow">
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
        <el-tooltip :disabled="!isSelectable" :content="$t('spinal-twin.Isolate')">
          <button-switch
            @click.native="isolateAll"
            :disabled="!isSelectable"
            :active="isolated"
            class="spl-el-button"
            icon="el-icon-aim"
          ></button-switch>
        </el-tooltip>
        <el-tooltip :disabled="!isSelectable" :content="$t('spinal-twin.Select')">
          <el-button
            :disabled="!isSelectable"
            @click.stop="selectInView()"
            circle
            class="spl-el-button"
            icon="el-icon-location"
          >
          </el-button>
        </el-tooltip>
        <el-tooltip :disabled="!isSelectable" content="Zoom">
          <el-button
            :disabled="!isSelectable"
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
import './TicketTools';
import { getTicketNumber } from './TicketTools';
import getItemsFromNode from './ViewerTicketContextSetup';
import {
  SERVICE_TYPE,
  PROCESS_TYPE,
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
} from 'spinal-service-ticket';

// Generic components
import SpinalBreadcrumb from '../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue';
import TabManager from '../../compoments/TabManager/TabManager.vue';
// Specific components
import ContextExplorer from '../../compoments/TabManager/generic/ContextExplorer/ContextExplorer.vue';
import CategoryAttribute from '../../compoments/TabManager/generic/CategoryAttribute.vue';
import NodeDocumentation from '../../compoments/TabManager/generic/NodeDocumentation.vue';
import NodeTickets from '../../compoments/TabManager/generic/NodeTickets/NodeTickets.vue';
import NodeNotes from '../../compoments/TabManager/generic/NodeNotes/NodeNotes.vue';
import NodeCalendar from '../../compoments/TabManager/generic/NodeCalendar/NodeCalendar.vue';
import NodeNotesMessage from '../../compoments/TabManager/generic/NodeNotes/NodeNotesMessage.vue';
import NodeTicketSelected from '../../compoments/TabManager/generic/NodeTickets/NodeTicketsSelected.vue';

export const TICKET_APP_RELATIONS = [
  SERVICE_TYPE,
  PROCESS_TYPE,
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
];
const VIEW_KEY = 'AlarmApp';

const AppBackInstance = AppBack.getInstance();

// Component exports
export default {
  name: 'AlarmComponent',
  components: {
    SpinalBreadcrumb,
    TabManager,
    NodeNotesMessage,
    NodeTickets,
    NodeCalendar,
    NodeTicketSelected,
  },

  data() {
    return {
      viewKey: VIEW_KEY,
      items: {},
      nodeItems: [],
      currentView: false,
      isNode: false,
      isSelectable: false,
      tabs: [
        {
          name: 'node-type.context',
          content: ContextExplorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
            relation: TICKET_APP_RELATIONS,
            context: false,
            hasEvent: true,
          },
          ignore: false,
        },

        {
          name: 'spinal-twin.hasCategoryAttributes',
          content: CategoryAttribute,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: 'spinal-twin.Documentation',
          content: NodeDocumentation,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: 'spinal-twin.Notes',
          content: NodeNotes,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        // {
        //   name: "spinal-twin.Calendar",
        //   content: NodeCalendar,
        //   props: {
        //     viewKey: VIEW_KEY,
        //     view: false,
        //   },
        //   ignore: true,
        // },
      ],
    };
  },

  async mounted() {
    const graph = await BackendInitializer.getInstance().getGraph();
    await AppBackInstance.init(graph, SERVICE_TYPE);
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    await ViewManager.getInstance(this.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
    EventBus.$on('app-viewer-color', async (items, relation) => {
      // let list = items.map(item => {
      //   return { server_id: item.serverId, color: item.getColor() };
      // });
      let list = await getItemsFromNode(
        FileSystem._objects[this.currentView.serverId]
      );
      console.debug('Ticket tools event; items :', list);
      console.debug(' relation :', relation);
      EventBus.$emit('ticket-viewer-color', list, relation);
    });
  },

  methods: {
    getAlarmOnly(liste) {
      return liste.filter((appItem) => {
        const node = FileSystem._objects[appItem.serverId];
        return node.info.subType && node.info.subType.get() === 'Alarm';
      });
    },
    async onViewChange(view) {
      this.nodeItems = [];
      // Get items from graph
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        const copy_mapItems = await AppBackInstance.getContexts(SERVICE_TYPE);

        const value = copy_mapItems.get(SERVICE_TYPE) || [];

        mapItems = new Map([[SERVICE_TYPE, this.getAlarmOnly(value)]]);
        this.isNode = false;
        this.isSelectable = false;
      } else {
        this.isNode = true;
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await AppBackInstance.getItems(
          view.serverId,
          this.contextServId,
          SERVICE_TYPE
        );
      }

      if (
        FileSystem._objects[view.serverId] &&
        (FileSystem._objects[view.serverId].info.type.get() ===
          SPINAL_TICKET_SERVICE_STEP_TYPE ||
          FileSystem._objects[view.serverId].info.type.get() ===
            SPINAL_TICKET_SERVICE_TICKET_TYPE)
      ) {
        this.isSelectable = true;
      } else {
        this.isSelectable = false;
      }

      // Get children
      for (const [nodeType, items] of mapItems) {
        this.items.nodeType = `${nodeType}.Alarm`;
        this.items.items = items;
      }

      // Get children
      // for (const [nodeType, items] of mapItems) {
      //   const cols = new Set();
      //   for (const item of items) {
      //     if (item.children) {
      //       for (const [childTypes] of item.children) {
      //         cols.add(childTypes);
      //       }
      //     }
      //   }
      //   this.items = { nodeType, items, cols: Array.from(cols) };
      // }
      this.currentView = view;

      await Promise.all(
        this.items.items.map(async function (item) {
          item['TotalAlarms'] = await getTicketNumber(item);
        })
      );

      this.setColumns(view);

      // Update tabs
      this.tabs[0].props.items = this.items;
      this.updateNames();
      this.tabs[0].props.context = this.contextServId;
      if (mapItems.size > 0) {
        this.tabs[0].content = ContextExplorer;
      } else {
        // let ticket = await SpinalGraphService.findNode(this.currentView.serverId);
        let nodeticket = FileSystem._objects[this.currentView.serverId];
        // let ticket = await getTicketDescription(nodeticket.info);
        // console.debug(JSON.stringify(ticket._ticket))
        // let testComponent = Vue.extend(NodeTicketsSelected)
        // this.tabs[0].content = new testComponent({
        //   propsData: {
        //     selected: ticket,
        //     stepping: true,
        //   },
        // });
        // this.tabs[0].content.$mount()
        this.tabs[0].props.stepping = true;
        this.tabs[0].props.selected = nodeticket.info.id.get();
        console.debug('tab :', this.tabs[0].props.selected);
        this.tabs[0].content = NodeTicketSelected;
        // Vue.component(
        //   "NodeTicketSelected",
        //   require("../../compoments/TabManager/generic/NodeTickets/NodeTicketsSelected.vue").default
        // );
      }
      for (let tab of this.tabs) {
        tab.props.view = this.currentView;
      }
      if (this.isNode) {
        for (let tab of this.tabs) {
          tab.ignore = false;
        }
      } else {
        for (let i = 1; i < this.tabs.length; ++i) {
          this.tabs[i].ignore = true;
        }
      }
    },

    setColumns(view) {
      let node = FileSystem._objects[view.serverId];
      this.items.cols = [];
      if (!node) {
        this.items.cols = ['AlarmProcessCount', 'TotalAlarms'];
        return;
      }
      let nodeType = node.info.type.get();
      console.debug('nodeType :', nodeType, TICKET_APP_RELATIONS);
      switch (nodeType) {
        case SERVICE_TYPE:
          this.items.cols = ['StepCount', 'TotalAlarms'];
          break;
        case PROCESS_TYPE:
          this.items.cols = ['AlarmCount'];
          break;
        // case SPINAL_TICKET_SERVICE_STEP_TYPE:
        //   this.items.cols = [ "TicketCount" ];
        //   break;
        default:
          this.items.cols = [];
      }
      console.debug('cols :', this.items.cols);
    },

    updateNames() {
      this.tabs[0].name = `node-type.${this.items.nodeType}`;
    },

    popView() {
      ViewManager.getInstance(this.viewKey).pop();
    },

    async zoomOn() {
      if (this.nodeItems.length === 0) {
        this.nodeItems = await getItemsFromNode(
          FileSystem._objects[this.currentView.serverId]
        );
      }
      EventBus.$emit('ticket-viewer-zoom', this.nodeItems);
    },

    async isolateAll() {
      if (this.nodeItems.length === 0) {
        this.nodeItems = await getItemsFromNode(
          FileSystem._objects[this.currentView.serverId]
        );
      }
      EventBus.$emit('ticket-viewer-isolate', this.nodeItems);
    },

    async selectInView() {
      if (this.nodeItems.length === 0) {
        this.nodeItems = await getItemsFromNode(
          FileSystem._objects[this.currentView.serverId]
        );
      }
      EventBus.$emit('ticket-viewer-select', this.nodeItems);
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

    Color() {
      let items = this.items.items.map((item) => {
        return { server_id: item.serverId, color: item.getColor() };
      });
      EventBus.$emit('ticket-viewer-color', items, {
        server_id: this.currentView.serverId,
      });
    },

    ShowAll() {
      EventBus.$emit('test-show-all');
    },
  },
};
</script>

<style scoped>
.hide-overflow {
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

.spl-el-button {
  margin: 0 0 0 10px;
}

.spl-button-bar {
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}
</style>
