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

import { spinalIO } from './spinalIO';
import { SpinalGraph } from 'spinal-model-graph';
import q from "q";


export default class BackendInitializer {
  static instance: BackendInitializer
  graph: SpinalGraph<any> = null;
  initDefer = q.defer();

  constructor() {
  }
  static getInstance(): BackendInitializer {
    if (!BackendInitializer.instance)
      BackendInitializer.instance = new BackendInitializer
    return BackendInitializer.instance
  }

  async init() {
    try {
      this.graph = await this.getGraph();
      this.initDefer.resolve();
    } catch (error) {
      this.initDefer.reject(error);
    }
  }
  async initback(appBack) {
    await this.initDefer.promise
    await Promise.all([
      appBack.init(this.graph),
    ]);
  }
  async getGraph() {
    const rootModel = await spinalIO.getModel();
    if (rootModel instanceof SpinalGraph) { this.graph = rootModel; }
    else if (typeof rootModel.graph !== 'undefined') { this.graph = rootModel.graph; }
    return this.graph;
  }
  waitInit() {
    return this.initDefer.promise;
  }
}
