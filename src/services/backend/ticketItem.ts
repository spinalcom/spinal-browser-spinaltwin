/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
import { SpinalNode } from 'spinal-env-viewer-graph-service';

import {
  TICKET_CONTEXT_TYPE,
  TICKET_OBJECT_TYPE,
  TICKET_PROCESS_TYPE,
  TICKET_RELATION_CONTEXT_PROCESS,
  TICKET_STEP_TYPE,
  TICKET_TICKET_TYPE,
} from '../../constants';

export class TicketItem {
  serverId: number;
  children?: Map<string, TicketItem[]>;
  info?: any;
  name: string;
  constructor(name: string, serverId: number) {
    this.name = name;
    this.info = {
      contextStructure: [],
      allTickets: [],
    };
    this.serverId = serverId;
  }

  getName(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.name) return '';
    return node.info.name.get();
  }

  getType(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.type) return '';
    return node.info.type.get();
  }
  getId(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.id) return '';
    return node.info.id.get();
  }

  getColor(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.color) return '0xF00';
    return node.info.color.get();
  }

  setColor(color): void {
    const node = FileSystem._objects[this.serverId];
    if (!node) return;
    if (!node.info.color) node.info.add_attr('color', color);
    else node.info.color.set(color);
  }

  isLocationType(): boolean {
    const type = this.getType();
    return (
      type === TICKET_CONTEXT_TYPE ||
      type === TICKET_PROCESS_TYPE ||
      type === TICKET_STEP_TYPE ||
      type === TICKET_TICKET_TYPE ||
      type === TICKET_OBJECT_TYPE
    );
  }
  async getProcess() {
    const context = FileSystem._objects[this.serverId];

    const processes = await context.getChildren([
      TICKET_RELATION_CONTEXT_PROCESS,
    ]);
    const prom: Promise<void>[] = [];
    for (const processNode of processes) {
      let exist = this.info.contextStructure.find(
        (e) => e.id === processNode.info.id.get()
      );
      if (exist) {
        exist.name = processNode.info.name.get();
      } else {
        exist = {
          name: processNode.info.name.get(),
          id: processNode.info.id.get(),
          server_id: processNode._server_id,
          nbrTickets: 0,
        };
        this.info.contextStructure.push(exist);
      }
      prom.push(this.getSteps(exist));
    }
    return Promise.all(prom);
  }

  async getSteps(processObj) {
    const processNode = FileSystem._objects[processObj.server_id];
  }

  addChildrenInItem(
    allItems: Map<number, TicketItem>,
    node: SpinalNode<any>
  ): void {
    if (typeof this.children === 'undefined') {
      Object.assign(this, { children: new Map() });
    }
    const nodeType = node.info.type.get();
    if (!this.children?.has(nodeType)) {
      this.children?.set(nodeType, []);
    }
    const arr = this.children?.get(nodeType)!;
    const child = TicketItem.getItemFromMap(allItems, node);
    arr.push(child);
  }

  static getItemFromMap(
    allItems: Map<number, TicketItem>,
    node: SpinalNode<any>
  ): TicketItem {
    const server_id = node._server_id!;
    if (allItems.has(server_id)) {
      return allItems.get(server_id)!;
    }
    const item: TicketItem = new TicketItem(node.info.name.get(), server_id);
    allItems.set(server_id, item);
    return item;
  }
}
