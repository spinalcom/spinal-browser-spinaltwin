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

import axios from 'axios';
import { decriAes, decriB64 } from './utlils/crypt';
let $ = require('jquery');
import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import {
  ICreateSessionResponse,
  File,
  FileSystem,
  spinalCore,
} from 'spinal-core-connectorjs';
import { getParameterByName } from './utlils/getParameterByName';
import { USE_REMOTE_CONNECT } from '../constants';

class SpinalIO {
  loadPromise: Map<string, Promise<spinal.Model>>;
  loadedPtr: Map<number, Promise<spinal.Model>>;
  connectPromise: Promise<void>;
  user: { username: string; password: string };
  conn: FileSystem;
  session: ICreateSessionResponse;
  serverHost = window.location.origin;

  constructor() {
    this.loadPromise = new Map();
    this.loadedPtr = new Map();
  }
  decriJson(encryptedHex) {
    try {
      const k = [
        10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110, 1,
      ];
      const str = decriAes(k, encryptedHex);
      return JSON.parse(str);
    } catch (e) {
      const str = decriB64(encryptedHex);
      try {
        return JSON.parse(str);
      } catch (e) {
        return '';
      }
    }
  }
  getauth() {
    if (this.user != null) return this.user;
    const encryptedHex = window.localStorage.getItem('spinalhome_cfg');
    this.user = this.decriJson(encryptedHex);
    return this.user;
  }
  private async _connect_remote_connect() {
    await this.documentReady();
    const token = localStorage.getItem('tokenKey')!;
    this.session = await spinalCore.createSession(this.serverHost, `Bearer ${token}`);
    this.conn = spinalCore.connectWithSessionId(
      this.serverHost,
      this.session.sessionNumber,
      token
    );
  }
  private async _connect() {
    await this.documentReady();
    const user = this.getauth();
    if (this.user.username) {
      const response = await axios.get(`${this.serverHost}/get_user_id`, {
        params: {
          u: user.username,
          p: user.password,
        },
      });
      let id = parseInt(response.data);
      if (id > 0) {
        const host = this.serverHost.replace(/https?:\/\//, '');
        this.conn = spinalCore.connect(
          `http://${id}:${user.password}@${host}/`
        );
        return;
      }
    }
    throw new Error('Authentication Connection Error');
  }
  private documentReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      $(document).ready(() => {
        resolve();
      });
    });
  }

  connect() {
    if (this.connectPromise != null) {
      return this.connectPromise;
    }
    FileSystem.CONNECTOR_TYPE = 'Browser';
    if (USE_REMOTE_CONNECT === true) {
      this.connectPromise = this._connect_remote_connect();
    } else {
      this.connectPromise = this._connect();
    }
    return this.connectPromise;
  }
  getModelPath(): string {
    const cryptedPath = getParameterByName('path');
    if (!cryptedPath) throw new Error('No "path" attribute found in the url');
    const k = [10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110, 1];
    try {
      const decripted = decriAes(k, cryptedPath);
      if (decripted[0] !== '/') throw 'not a path';
      return decripted;
    } catch (e) {
      const decripted = decriB64(cryptedPath);
      return decripted;
    }
  }

  async getModel(): Promise<SpinalGraph> {
    if (USE_REMOTE_CONNECT === true) {
      const m = await (<Promise<SpinalGraph>>this.loadRemote());
      await SpinalGraphService.setGraph(m);
      return m;
    } else {
      try {
        const path = this.getModelPath();
        const m = await (<Promise<SpinalGraph>>this.load(path));
        await SpinalGraphService.setGraph(m);
        return m;
      } catch (e) {
        const m = await (<Promise<SpinalGraph>>(
          this.load('/__users__/admin/Digital twin')
        ));
        await SpinalGraphService.setGraph(m);
        return m;
      }
    }
  }
  private async loadRemote(): Promise<SpinalGraph> {
    await this.connect();
    const server_id = this.session.graphServerId;
    const m = <Promise<SpinalGraph>>this.loadedPtr.get(server_id);
    if (m) {
      return m;
    }
    const graph = <Promise<SpinalGraph>>this.conn.load_ptr(server_id);
    this.loadedPtr.set(server_id, graph);
    return graph;
  }

  async load(path: string): Promise<spinal.Model> {
    await this.connect();
    const p = this.loadPromise.get(path);
    if (p) {
      return p;
    }

    const prom: Promise<spinal.Model> = new Promise((resolve, reject) => {
      try {
        spinalCore.load(
          this.conn,
          path,
          (model) => {
            resolve(model);
          },
          () => {
            reject(new Error(`Load Error path: '${path}'`));
          }
        );
      } catch (e) {
        reject(e);
      }
    });
    this.loadPromise.set(path, prom);
    return prom;
  }

  async loadPtr(ptr: spinal.Ptr<any> | spinal.Pbr<any>): Promise<spinal.Model> {
    if (ptr instanceof File) return this.loadPtr(ptr._ptr);
    await this.connect();
    const server_id: number = ptr.data.value;
    const m = this.loadedPtr.get(server_id);
    if (m) {
      return m;
    }
    const prom: Promise<spinal.Model> = new Promise((resolve, reject) => {
      try {
        this.conn.load_ptr(server_id, (model) => {
          if (!model)
            reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
          else resolve(model);
        });
      } catch (e) {
        reject(e);
      }
    });
    this.loadedPtr.set(server_id, prom);
    return prom;
  }

  waitNodeReady(node: any): Promise<void> {
    return new Promise((resolve) => {
      const aibe = setInterval(() => {
        if (typeof FileSystem._objects[node._server_id] !== 'undefined') {
          clearInterval(aibe);
          return resolve();
        }
      }, 500);
    });
  }
}
export const spinalIO = new SpinalIO();
var anyWin: any = window;
if (!anyWin.spinal) {
  anyWin.spinal = {};
}
if (!anyWin.spinal.spinalSystem) {
  anyWin.spinal.spinalSystem = spinalIO;
}
