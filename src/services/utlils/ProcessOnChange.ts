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
import { Model, Process } from 'spinal-core-connectorjs_type';
const throttle = require('lodash.throttle');
const debounce = require('lodash.debounce');

/**
 *
 * @property {number} process_id
 * @property {Function} fctOnChange
 * @property {Model[]} _models
 * @export
 * @class ProcessOnChange
 * @extends {Process}
 */
export default class ProcessOnChange extends Process {
  _models: spinal.Model[];
  fctOnChange: () => void;
  /**
   *Creates an instance of ProcessOnChange.
   * @param {fctOnChange} fctOnChange
   * @param {({
   *     type: 'debounce' | 'throttle',
   *     timeout: number,
   *     opt?: Object;
   *   })} [option]
   * @memberof ProcessOnChange
   */
  constructor(fctOnChange, option) {
    super(new Model(), false);
    this._models = [];
    if (typeof option !== 'undefined') {
      if (option.type === 'debounce') {
        this.fctOnChange = debounce(fctOnChange, option.timeout, option.opt);
      } else if (option.type === 'throttle') {
        this.fctOnChange = throttle(fctOnChange, option.timeout, option.opt);
      } else {
        this.fctOnChange = fctOnChange;
      }
    } else {
      this.fctOnChange = fctOnChange;
    }
  }

  /**
   * @param {spinal.Model} model
   * @param {boolean} [onChangeConstruction=true]
   * @returns {void}
   * @memberof ProcessOnChange
   */
  add(model, onChangeConstruction) {
    for (const itrnModel of this._models) {
      if (itrnModel === model) return;
    }
    this._models.push(model);
    model.bind(this, onChangeConstruction);
  }

  /**
   * @param {spinal.Model} model
   * @returns {boolean}
   * @memberof ProcessOnChange
   */
  remove(model) {
    for (let idx = 0; idx < this._models.length; idx++) {
      const element = this._models[idx];
      if (model === element) {
        const i = element._processes.indexOf(this);
        if (i >= 0) {
          element._processes.splice(i, 1);
        }
        this._models.splice(idx, 1);
        return true;
      }
    }
    return false;
  }
  empty() {
    for (let idx = 0; idx < this._models.length; idx++) {
      const m = this._models[idx];
      const i = m._processes.indexOf(this);
      if (i >= 0) {
        m._processes.splice(i, 1);
      }
    }
    this._models = [];
  }

  onchange() {
    if (this.fctOnChange) {
      return this.fctOnChange();
    }
  }
}
