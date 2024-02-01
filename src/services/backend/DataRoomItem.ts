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

import { FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
import {
  BUILDING_RELATION,
  BUILDING_TYPE,
  EQUIPMENT_RELATION,
  EQUIPMENT_TYPE,
  FLOOR_RELATION,
  FLOOR_TYPE,
  REFERENCE_RELATION,
  ROOM_RELATION,
  ROOM_TYPE,
  SITE_RELATION,
  SITE_TYPE,
  SPATIAL_CONTEXT_TYPE,
  ZONE_RELATION,
  ZONE_TYPE,
} from '../../constants';
import { IBimObject } from '../../router/EquipmentApp/backend/IBimObject';
export class DataRoomItem {
  name: string;
  serverId: number;
  nodeId: string;
  children?: Map<string, DataRoomItem[]>;

  constructor(name: string, serverId: number, nodeId: string) {
    this.name = name;
    this.serverId = serverId;
    this.nodeId = nodeId;
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

  getColor(): string | undefined {
    const node = FileSystem._objects[this.serverId];
    if (!node || !node.info.color) return undefined;
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
      type === SPATIAL_CONTEXT_TYPE ||
      type === SITE_TYPE ||
      type === BUILDING_TYPE ||
      type === FLOOR_TYPE ||
      type === ROOM_TYPE ||
      type === ZONE_TYPE
    );
  }

  async getBimObjects(): Promise<IBimObject[]> {
    const node = <SpinalNode<any>>FileSystem._objects[this.serverId];
    const tmp = await node.find(
      [
        SITE_RELATION,
        BUILDING_RELATION,
        FLOOR_RELATION,
        ZONE_RELATION,
        ROOM_RELATION,
        REFERENCE_RELATION,
        EQUIPMENT_RELATION,
        'hasReferenceObject.ROOM',
      ],
      (item: SpinalNode) => {
        return item.info.type && item.info.type.get() === EQUIPMENT_TYPE;
      }
    );

    const res: IBimObject[] = [];
    return tmp.reduce((arr, bimObj) => {
      for (const item of arr) {
        if (item._server_id === bimObj._server_id) return arr;
      }
      arr.push({
        _server_id: bimObj._server_id!,
        bimFileId: bimObj.info.bimFileId.get(),
        dbid: bimObj.info.dbid.get(),
        externalId: bimObj.info.externalId.get(),
        id: bimObj.info.id.get(),
        name: bimObj.info.name.get(),
        type: bimObj.info.type.get(),
      });
      return arr;
    }, res);
  }
  private async getAttrByKey(key) {
    const node = FileSystem._objects[this.serverId];
    if (node && node instanceof SpinalNode) {
      const cats = await node.getChildren('hasCategoryAttributes');
      for (const cat of cats) {
        const attrLst = await cat.getElement();
        for (let idx = 0; idx < attrLst.length; idx++) {
          const attr = attrLst[idx];
          if (attr.label.get() === key) {
            return attr;
          }
        }
      }
    }
  }

  async getArea() {
    const node = FileSystem._objects[this.serverId];
    if (node && node.getType().get() === ROOM_TYPE) {
      const areaAttr = await this.getAttrByKey('area');
      if (!areaAttr) return 0;
      return parseFloat(areaAttr.value.get());
    }
    if (typeof this.children === 'undefined') return 0;
    const prom: Promise<number>[] = [];
    for (const [, arrayItem] of this.children) {
      for (const item of arrayItem) {
        prom.push(item.getArea());
      }
    }
    return Promise.all(prom).then((resArr) =>
      resArr.reduce((prev, curr) => prev + curr, 0)
    );
  }

  addChildrenInItem(
    allItems: Map<number, DataRoomItem>,
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
    const child = DataRoomItem.getItemFromMap(allItems, node);
    arr.push(child);
  }

  static getItemFromMap(
    allItems: Map<number, DataRoomItem>,
    node: SpinalNode<any>
  ): DataRoomItem {
    const server_id: number = node._server_id!;
    if (allItems.has(server_id)) {
      return allItems.get(server_id)!;
    }
    const item: DataRoomItem = new DataRoomItem(
      node.info.name.get(),
      server_id,
      node.info.id.get()
    );
    allItems.set(server_id, item);
    return item;
  }
}
