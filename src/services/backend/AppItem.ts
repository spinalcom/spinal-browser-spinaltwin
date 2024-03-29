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

import { SpinalNode } from "spinal-env-viewer-graph-service";
import { FileSystem } from 'spinal-core-connectorjs_type'
import {
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  REFERENCE_RELATION,
  EQUIPMENT_RELATION,

  EQUIPMENT_TYPE
} from "../../constants";

export class AppItem {
  name: string;
  serverId: number;
  type: string;
  children?: Map<string, AppItem[]>;

  constructor(name: string, serverId: number, type: string) {
    this.name = name
    this.serverId = serverId
    this.type = type;
  }

  getType(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.type) return "";
    return node.info.type.get();
  }

  getId(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.id) return "";
    return node.info.id.get();
  }

  getColor(): string {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.color) return undefined;
    return node.info.color.get();
  }

  setColor(color): void {
    const node = FileSystem._objects[this.serverId];
    if (!node) return;
    if (!node.info.color) node.info.add_attr("color", color)
    else node.info.color.set(color);
  }

  async getBimObjectsByType(typeName) {
    const node = <SpinalNode<any>>(FileSystem._objects[this.serverId]);
    const tmp = await node.find([
      SITE_RELATION,
      BUILDING_RELATION,
      FLOOR_RELATION,
      ZONE_RELATION,
      ROOM_RELATION,
      REFERENCE_RELATION,
      EQUIPMENT_RELATION,
      "SpinalSystemServiceTicketHasProcess"
    ], (item) => {
      return (item.info.type && item.info.type.get() === typeName)
    })

    return tmp.reduce((arr, bimObj) => {
      for (const item of arr) {
        if (item._server_id === bimObj._server_id) return arr;
      }
      arr.push({
        _server_id: bimObj._server_id,
        bimFileId: bimObj.info.bimFileId.get(),
        dbid: bimObj.info.dbid.get(),
        externalId: bimObj.info.externalId.get(),
        id: bimObj.info.id.get(),
        name: bimObj.info.name.get(),
        type: bimObj.info.type.get(),
      })
      return arr;
    }, [])
  }

  addChildrenInItem(allItems: Map<number, AppItem>, node: SpinalNode<any>, type): void {
    if (typeof this.children === "undefined") {
      Object.assign(this, { children: new Map() })
    }
    const nodeType = node.info.type.get();
    if (!this.children.has(nodeType)) {
      this.children.set(nodeType, [])
    }
    const arr = this.children.get(nodeType)
    const child = AppItem.getItemFromMap(allItems, node, type);
    arr.push(child);
  }

  static getItemFromMap(allItems: Map<number, AppItem>, node: SpinalNode<any>, type)
    : AppItem {
    const server_id: number = node._server_id
    if (allItems.has(server_id)) {
      return allItems.get(server_id)
    }
    const item: AppItem = new AppItem(node.info.name.get(), server_id, type)
    allItems.set(server_id, item);
    return item
  }

  countItems()
  {
    const node = FileSystem._objects[this.serverId];
    if (node && node.getType().get() === this.type) return 1;
    if (typeof this.children === "undefined") return 0;
    const prom = [];
    for (const [, arrayItem] of this.children) {
      for (const item of arrayItem) {
        prom.push(item.countItems());
      }
    }
    return Promise.all(prom)
      .then((resArr) => resArr.reduce((prev, curr) => prev + curr, 0));
  }
}

