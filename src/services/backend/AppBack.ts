/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
import { FileSystem } from 'spinal-core-connectorjs_type';
import {
  SpinalContext,
  SpinalGraph,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { AppItem } from './AppItem';
// import { AttributeService } from "spinal-env-viewer-plugin-documentation-service/src/Models/AttributeService"

type mapAppItem = Map<string, AppItem[]>;

export class AppBack {
  initDefer = q.defer();
  contexts: SpinalContext<any>[] = [];
  type: string;
  static instance: AppBack;

  constructor() { }

  static getInstance(): AppBack {
    if (!AppBack.instance) AppBack.instance = new AppBack();
    return AppBack.instance;
  }

  async init(graph: SpinalGraph<any>, type: string) {
    this.contexts = [];
    this.type = type;
    // const children = await graph.getChildren("BIMObjectGroupContext");
    const children = await graph.getChildren();
    for (const context of children) {
      if (context.info.type.get() === type) {
        this.contexts.push(context);
      }
    }
    this.initDefer.resolve(this.contexts);
  }

  async getContexts(type: string): Promise<Map<string, AppItem[]>> {
    const result: Map<string, AppItem[]> = new Map();
    await Promise.all(
      this.contexts.map(async (item) => {
        return this.getItemsInContext(item, item, type, true).then((map) => {
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
    contextServerId: number,
    type: string
  ): Promise<mapAppItem> {
    const node = <SpinalNode<any>>FileSystem._objects[serverId];
    const context = <SpinalContext<any>>FileSystem._objects[contextServerId];
    if (!node || !context) return Promise.resolve(new Map());
    return this.getItemsInContext(node, context, type);
  }

  private getChildrenAndItems(
    n: SpinalNode,
    context: SpinalContext,
    itm: AppItem
  ) {
    // const itm = AppItem.getItemFromMap(allItems, n, type);

    return n.getChildrenInContext(context).then((children) => {
      
      return { children, item: itm };
    });
  }

  private async getItemsInContext(
    node: SpinalNode<any>,
    context: SpinalContext<any>,
    type: string,
    giveSelf = false
  ): Promise<mapAppItem> {
    const seen: Set<SpinalNode<any>> = new Set([node]);
    let promises: Promise<{ children: SpinalNode<any>[]; item: AppItem }>[] =
      [];
    let nextGen: SpinalNode<any>[] = [node];
    let currentGen: SpinalNode<any>[] = [];
    const res: mapAppItem = new Map();
    const allItems: Map<number, AppItem> = new Map();
    const nodeType: string = node.info.type.get();
    if (!res.has(nodeType)) {
      res.set(nodeType, []);
    }
    const arr = res.get(nodeType)!;
    const item = AppItem.getItemFromMap(allItems, node, type);
    // console.warn(item);
    arr.push(item);
    let depth = 0;
    while (nextGen.length) {
      currentGen = nextGen;
      promises = [];
      nextGen = [];
      // depth += 1;
      for (const n of currentGen) {
        // if (depth <= 2 || (n.info.type && n.info.type.get() !== type)) {
        if (depth <= 1 /*|| (n.info.type && n.info.type.get() !== type)*/) {
          promises.push(
            this.getChildrenAndItems(
              n,
              context,
              AppItem.getItemFromMap(allItems, n, type)
            )
          );
        }
      }
      const childrenArrays: { children: SpinalNode<any>[]; item: AppItem }[] =
        await Promise.all(promises);
      for (const children of childrenArrays) {
        for (const child of children.children) {
          children.item.addChildrenInItem(allItems, child, type);
          if (!seen.has(child)) {
            nextGen.push(child);
            seen.add(child);
            // @ts-ignore
            SpinalGraphService._addNode(child);
          }
        }
      }
      depth+=1;
    }
    if (giveSelf) return res;
    if (typeof item.children !== 'undefined') {
      return item.children;
    } else {
      return new Map();
    }
  }
}
