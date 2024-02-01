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
import { ROOM_TYPE, SPATIAL_CONTEXT_TYPE } from '../../constants';

import { FileSystem } from 'spinal-core-connectorjs_type';
import {
  SpinalContext,
  SpinalGraph,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';

import { DataRoomItem } from './DataRoomItem';
type mapDataRoomItem = Map<string, DataRoomItem[]>;

export default class BackEndDataRoom {
  initDefer = q.defer();
  contexts: SpinalContext<any>[] = [];

  constructor() {}
  async init(graph: SpinalGraph<any>) {
    const children = await graph.getChildren('hasContext');
    for (const context of children) {
      if (context.info.type.get() === SPATIAL_CONTEXT_TYPE) {
        this.contexts.push(context);
      }
    }
    this.initDefer.resolve(this.contexts);
  }

  async getContexts(): Promise<Map<string, DataRoomItem[]>> {
    const res: Map<string, DataRoomItem[]> = new Map();
    await Promise.all(
      this.contexts.map(async (item) => {
        return this.getItemsInContext(item, item, true).then((map) => {
          for (const [key, value] of map) {
            if (!res.has(key)) res.set(key, []);
            const arr = res.get(key)!;
            arr.push(...value);
          }
        });
      })
    );
    return res;
  }

  getItems(
    serverId: number,
    contextServerId: number
  ): Promise<mapDataRoomItem> {
    const node = <SpinalNode<any>>FileSystem._objects[serverId];
    const context = <SpinalContext<any>>FileSystem._objects[contextServerId];
    if (!node || !context) return Promise.resolve(new Map());
    return this.getItemsInContext(node, context);
  }

  private async getItemsInContext(
    node: SpinalNode<any>,
    context: SpinalContext<any>,
    giveSelf = false
  ): Promise<mapDataRoomItem> {
    const seen: Set<SpinalNode<any>> = new Set([node]);
    let promises: Promise<{
      children: SpinalNode<any>[];
      item: DataRoomItem;
    }>[] = [];
    let nextGen: SpinalNode<any>[] = [node];
    let currentGen: SpinalNode<any>[] = [];
    const res: mapDataRoomItem = new Map();
    const allItems: Map<number, DataRoomItem> = new Map();
    const nodeType: string = node.info.type.get();
    if (!res.has(nodeType)) {
      res.set(nodeType, []);
    }
    const arr = res.get(nodeType)!;
    const item = DataRoomItem.getItemFromMap(allItems, node);
    arr.push(item);
    let depth = 0;
    while (nextGen.length) {
      currentGen = nextGen;
      promises = [];
      nextGen = [];
      depth += 1;
      for (const n of currentGen) {
        if (depth <= 2 || (n.info.type && n.info.type.get() !== ROOM_TYPE)) {
          const item = DataRoomItem.getItemFromMap(allItems, n);
          promises.push(
            n.getChildrenInContext(context).then((children) => {
              return { children, item };
            })
          );
        }
      }
      const childrenArrays: {
        children: SpinalNode<any>[];
        item: DataRoomItem;
      }[] = await Promise.all(promises);
      for (const children of childrenArrays) {
        for (const child of children.children) {
          children.item.addChildrenInItem(allItems, child);
          if (!seen.has(child)) {
            nextGen.push(child);
            seen.add(child);
          }
        }
      }
    }
    if (giveSelf) return res;
    return typeof item.children !== 'undefined' ? item.children : new Map();
  }
}
