/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
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

import q from 'q';
import { SpinalGraph } from 'spinal-model-graph';
import BackEndDataRoom from './backend/DataRoom';
import BackEndHeatmap from './backend/heatmap';
import BackEndSpace from './backend/space';
import BackEndSpatial from './backend/spatial';
import BackEndTicket from './backend/ticket';
import BackEndViewer from './backend/viewer';
import { spinalIO } from './spinalIO';

class SpinalBackEnd {
  graph: SpinalGraph<any>;
  spatialBack = new BackEndSpatial();
  viewerBack = new BackEndViewer();
  spaceBack = new BackEndSpace();
  DataRoomBack = new BackEndDataRoom();
  BackEndTicket = new BackEndTicket();
  heatmapBack = new BackEndHeatmap();
  initDefer = q.defer();

  constructor() {}

  async init() {
    try {
      const graph = await this.getGraph();
      await Promise.all([
        this.spatialBack.init(graph),
        this.viewerBack.init(graph),
        this.DataRoomBack.init(graph),
        this.spaceBack.init(graph),
        this.BackEndTicket.init(graph),
        this.heatmapBack.init(graph),
      ]);
      this.initDefer.resolve();
    } catch (error) {
      this.initDefer.reject(error);
    }
  }

  async getGraph() {
    const rootModel = await spinalIO.getModel();
    if (rootModel instanceof SpinalGraph) {
      this.graph = rootModel;
      // handle old Digital Twin
      // @ts-ignore
    } else if (typeof rootModel.graph !== 'undefined') {
      // @ts-ignore
      this.graph = rootModel.graph;
    }
    return this.graph;
  }

  waitInit() {
    return this.initDefer.promise;
  }
}

const spinalBackEnd = new SpinalBackEnd();

export default spinalBackEnd;
export { SpinalBackEnd, spinalBackEnd };
