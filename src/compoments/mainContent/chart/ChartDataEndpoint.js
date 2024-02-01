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

import { FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';

import { asyncGenToArray } from './asyncGenToArray/asyncGenToArray';

import BtnMapDate from './BtnMappingDate';
import { spinalServiceTimeseries } from './timeseriesServiceInstance.js';

class ChartDataEndpoint {
  constructor(
    nodeId,
    elemName,
    unit,
    timeIntervalStr = '1h',
    start = null,
    end = null
  ) {
    this.nodeId = nodeId;
    this.currentValue = 0;
    this.name = elemName;
    this.unit = unit;
    this.timeIntervalStr = timeIntervalStr;
    this.x = [];
    this.y = [];
    this.unbind = null;
    this.updateprom = null;
    this.start = new Date(start);
    this.end = new Date(end);
    this.dateAvailable = [];
  }

  async init() {
    const n = await this.getElement();
    this.unbind = n.bind(() => {
      this.update();
    });
    return this.update();
  }
  update() {
    if (this.updateprom !== null) {
      return this.updateprom;
    }
    this.updateprom = this.prom_update().then(() => {
      this.updateprom = null;
    });
    return this.updateprom;
  }

  async prom_update() {
    const element = await this.getElement();
    this.name = element.name.get() + '-' + this.name + ' (' + this.unit + ')';
    this.currentValue = element.currentValue.get();
    if (
      typeof this.currentValue === 'number' ||
      typeof this.currentValue === 'boolean'
    ) {
      const timeseries = await spinalServiceTimeseries.getOrCreateTimeSeries(
        this.nodeId
      );
      if (this.timeIntervalStr === 'CUSTOM') {
        const generator = await timeseries.getFromIntervalTime(
          this.start,
          this.end
        );
        this.handleTimeseries(generator);
      } else {
        const func = BtnMapDate[this.timeIntervalStr];
        if (func && typeof func[0] === 'function') {
          const timeseriesData = await func[0](timeseries, func[1]);
          const generator = await asyncGenToArray(timeseriesData);
          this.handleTimeseries(generator);
        }
      }
      const tsArchive = await timeseries.getArchive();
      this.dateAvailable = tsArchive.getDates().get();
    }
  }

  handleTimeseries(generator) {
    const x = [];
    const y = [];
    for (const element of generator) {
      x.push(element.date);
      y.push(element.value);
    }
    if (y.length !== this.y.length || x[0] !== this.x[0]) {
      this.x = x;
      this.y = y;
    }
  }
  changeInterval(value) {
    this.timeIntervalStr = value;
    return this.update();
  }

  changeCustomInterval(start, end) {
    this.timeIntervalStr = 'CUSTOM';
    this.start = new Date(start);
    this.end = new Date(end);
    return this.update();
  }

  getElement() {
    const node = SpinalGraphService.getRealNode(this.nodeId);
    const ptr = node.element.ptr;
    if (ptr.data.value && ptr.data.value !== 0) {
      if (typeof FileSystem._objects[ptr.data.value] !== 'undefined') {
        return Promise.resolve(FileSystem._objects[ptr.data.value]);
      }
    }
    return node.element.load();
  }

  async uninit() {
    if (this.unbind !== null) {
      const n = await this.getElement();
      n.unbind(this.unbind);
    }
  }
}
export default ChartDataEndpoint;
export { ChartDataEndpoint };
