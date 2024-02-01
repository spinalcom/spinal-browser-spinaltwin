/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');

import Vue from 'vue';
import aVueCompoment from './endpointChartViewerPanel.vue';
const {
  spinalContextMenuService,
  SpinalContextApp,
} = require('spinal-env-viewer-context-menu-service');

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
const extentionCreated = SpinalForgeExtention.createExtention({
  name: 'endpoint_chart_viewer',
  vueMountComponent: Vue.extend(aVueCompoment),
  panel: {
    title: 'Endpoint Chart viewer',
    classname: 'spinal-env-plugin-viewer-endpoint_chart_viewer',
    closeBehaviour: 'delete',
  },
  style: {
    height: '80vh',
    left: '405px',
    width: '631px',
  },
  onLoad: function () {},
  onUnLoad: function () {},
});

SpinalForgeExtention.registerExtention(
  'endpoint_chart_viewer',
  extentionCreated
);

class EndpointChartViewerBtn extends SpinalContextApp {
  constructor() {
    super(
      'Endpoint chart viewer',
      'open a panel with to show the value of the Endpoint',
      {
        icon: 'show_chart',
        icon_type: 'in',
        backgroundColor: '#000000',
        fontColor: '#FFFFFF',
      }
    );
  }

  isShown(option) {
    if (
      option &&
      option.selectedNode &&
      option.selectedNode.type &&
      option.selectedNode.type.get() === 'BmsEndpoint'
    ) {
      const relNames = SpinalGraphService.getRelationNames(
        option.selectedNode.id.get()
      );
      for (let id = 0; id < relNames.length; id++) {
        const element = relNames[id];
        if (element === 'hasTimeSeries') {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel('endpoint_chart_viewer', option);
  }
}

spinalContextMenuService.registerApp(
  'GraphManagerSideBar',
  new EndpointChartViewerBtn(),
  [15]
);
