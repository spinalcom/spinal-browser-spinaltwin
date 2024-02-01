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
import { EQUIPMENT_TYPE } from '../../../constants';

import { EquipmentItem } from './EquipmentItem';
import {
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { FileSystem } from 'spinal-core-connectorjs_type';

type mapEquipmentItem = Map<string, EquipmentItem[]>;

export class EquipmentBack {
  initDefer = q.defer();
  contexts: SpinalContext<any>[] = [];
  static instance: EquipmentBack;

  constructor() {}

  static getInstance(): EquipmentBack {
    if (!EquipmentBack.instance) EquipmentBack.instance = new EquipmentBack();
    return EquipmentBack.instance;
  }

  async init(graph: SpinalGraph<any>) {
    this.contexts = [];
    // const children = await graph.getChildren("BIMObjectGroupContext");
    const children = await graph.getChildren();
    for (const context of children) {
      if (context.info.type.get() === 'BIMObjectGroupContext') {
        this.contexts.push(context);
      }
    }
    this.initDefer.resolve(this.contexts);
  }

  async getContexts(): Promise<Map<string, EquipmentItem[]>> {
    const result: Map<string, EquipmentItem[]> = new Map();

    await Promise.all(
      this.contexts.map(async (item) => {
        return this.getItemsInContext(item, item, true).then((map) => {
          for (const [key, value] of map) {
            if (!result.has(key)) result.set(key, []);
            const arr = result.get(key)!;
            arr.push(...value);
          }
        });
      })
    );
    return result;
  }

  getItems(
    serverId: number,
    contextServerId: number
  ): Promise<mapEquipmentItem> {
    const node = <SpinalNode<any>>FileSystem._objects[serverId];
    const context = <SpinalContext<any>>FileSystem._objects[contextServerId];
    if (!node || !context) return Promise.resolve(new Map());
    return this.getItemsInContext(node, context);
  }

  private async getItemsInContext(
    node: SpinalNode<any>,
    context: SpinalContext<any>,
    giveSelf = false
  ): Promise<mapEquipmentItem> {
    const seen: Set<SpinalNode<any>> = new Set([node]);
    let promises: Promise<{
      children: SpinalNode<any>[];
      item: EquipmentItem;
    }>[] = [];
    let nextGen: SpinalNode<any>[] = [node];
    let currentGen: SpinalNode<any>[] = [];
    const res: mapEquipmentItem = new Map();
    const allItems: Map<number, EquipmentItem> = new Map();
    const nodeType: string = node.info.type.get();
    if (!res.has(nodeType)) {
      res.set(nodeType, []);
    }
    const arr = res.get(nodeType)!;
    const item = EquipmentItem.getItemFromMap(allItems, node);
    arr.push(item);
    let depth = 0;
    while (nextGen.length) {
      currentGen = nextGen;
      promises = [];
      nextGen = [];
      depth += 1;
      for (const n of currentGen) {
        if (
          depth <= 2 ||
          (n.info.type && n.info.type.get() !== EQUIPMENT_TYPE)
        ) {
          const item = EquipmentItem.getItemFromMap(allItems, n);
          promises.push(
            n.getChildrenInContext(context).then((children) => {
              return { children, item };
            })
          );
        }
      }
      const childrenArrays: {
        children: SpinalNode<any>[];
        item: EquipmentItem;
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
    if (typeof item.children !== 'undefined') {
      return item.children;
    } else {
      return new Map();
    }
  }
}
