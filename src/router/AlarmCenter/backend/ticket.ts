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

import {
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME,
  SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
  PROCESS_HAS_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
  SPINAL_TICKET_SERVICE_TICKET_TYPE
} from "./constants"
import { EQUIPMENT_TYPE } from "../../../constants"
import { spinalIO } from "../../../services/spinalIO"
import q from "q";

import { FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalGraphService, SpinalNode, SpinalContext } from 'spinal-env-viewer-graph-service';
import { TicketItem } from './ticketItem'
const anyWin: any = window;

type mapTicketItem = Map<string, TicketItem[]>


export default class BackEndTicket {
  initDefer = q.defer();
  contexts: SpinalContext<any>[] = []
  static instance: BackEndTicket

  constructor() {
  }

  static getInstance(): BackEndTicket {
    if (!BackEndTicket.instance)
      BackEndTicket.instance = new BackEndTicket
    return BackEndTicket.instance
  }

  async init(graph) {
    // this.ticketContext = await graph.getContext(TICKET_CONTEXT_NAME);
    this.contexts = [];
    const children = await graph.getChildren();
    for (const context of children) {
      if (context.info.type.get() === "SpinalSystemServiceTicket") {
        this.contexts.push(context);
      }
    }
    this.initDefer.resolve(this.contexts);
  }

  async getContexts(): Promise<Map<string, TicketItem[]>> {
    const res: Map<string, TicketItem[]> = new Map()
    await Promise.all(this.contexts.map(async (item) => {
      return this.getItemsInContext(item, item, true).then((map) => {
        for (const [key, value] of map) {
          if (!res.has(key)) res.set(key, []);
          const arr = res.get(key);
          arr.push(...value)
        }
      })
    }))
    return res;
  }

  getItems(serverId: number, contextServerId: number): Promise<mapTicketItem> {
    const node = <SpinalNode<any>>(FileSystem._objects[serverId]);
    const context = <SpinalContext<any>>(FileSystem._objects[contextServerId]);
    if (!node || !context) return Promise.resolve(new Map());
    return this.getItemsInContext(node, context)
  }

  private async getItemsInContext(node: SpinalNode<any>,
    context: SpinalContext<any>, giveSelf = false): Promise<mapTicketItem> {
    const seen: Set<SpinalNode<any>> = new Set([node]);
    let promises: Promise<{ children: SpinalNode<any>[]; item: TicketItem; }>[] = [];
    let nextGen: SpinalNode<any>[] = [node];
    let currentGen: SpinalNode<any>[] = [];
    const res: mapTicketItem = new Map()
    const allItems: Map<number, TicketItem> = new Map();
    const nodeType: string = node.info.type.get();
    if (!res.has(nodeType)) {
      res.set(nodeType, []);
    }
    const arr = res.get(nodeType);
    const item = TicketItem.getItemFromMap(allItems, node);
    arr.push(item)
    let depth = 0;
    while (nextGen.length) {
      currentGen = nextGen;
      promises = [];
      nextGen = [];
      depth += 1;
      for (const n of currentGen) {
        if (depth <= 2 || (n.info.type && n.info.type.get() !== SPINAL_TICKET_SERVICE_TICKET_TYPE)) {
          const item = TicketItem.getItemFromMap(allItems, n);
          promises.push(n.getChildrenInContext(context).then((children) => {
            return { children, item }
          }));
        }
      }
      const childrenArrays: { children: SpinalNode<any>[]; item: TicketItem; }[]
        = await Promise.all(promises);
      for (const children of childrenArrays) {
        for (const child of children.children) {
          children.item.addChildrenInItem(allItems, child)
          if (!seen.has(child)) {
            nextGen.push(child);
            seen.add(child);
          }
        }
      }
    }
    for (const [, arrayTicket] of res) {
      arrayTicket.forEach(item => item.getCountTicket())
    }
    if (giveSelf) return res;
    return typeof item.children !== "undefined" ? item.children : new Map();
  }


  async getLstByModel(item, addRoomRef = false) {
    const node = this.getNodeFromItem(item);
    const relations = [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME,
      SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
      PROCESS_HAS_TICKET_RELATION_NAME,
      SPINAL_TICKET_SERVICE_STEP_RELATION_NAME]
    var listNodeSelected = []
    var _listNodeSelected = []
    if (node) {
      const listNode = await node.find(relations, (n) => {
        return (n.getType().get() === SPINAL_TICKET_SERVICE_TICKET_TYPE);
      });
      for (const ticket of listNode) {
        let _ticket = spinalIO.loadPtr(ticket.info.elementSelected)
        listNodeSelected.push(_ticket)
      }
      var rooms = await Promise.all(listNodeSelected)
      for (const room of rooms) {
        let _room = room.getChildren(["hasReferenceObject.ROOM"])
        _listNodeSelected.push(_room)
      }
      var _rooms = await Promise.all(_listNodeSelected);
      var res = _rooms.reduce((acc, item) => {
        acc.push(...item)
        return acc;
      }, [])

      return this.sortBIMObjectByModel(res);
    }
    else return this.sortBIMObjectByModel([]);
  }
  getNodeFromItem(item) {
    return FileSystem._objects[item.server_id];
  }

  sortBIMObjectByModel(arrayOfBIMObject): { selection: number[], model }[] {
    let arrayModel = [];
    for (const nodeBIMObject of arrayOfBIMObject) {
      const bimFileId = nodeBIMObject.info.bimFileId.get();
      const dbId = nodeBIMObject.info.dbid.get();
      const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
      const obj = this.getOrAddModelIfMissing(arrayModel, model);
      obj.selection.push(dbId);
    }
    return arrayModel;
  }
  getOrAddModelIfMissing(array, model): { selection: number[], model } {
    for (const obj of array) {
      if (obj.model === model) {
        return obj;
      }
    }
    const obj = {
      selection: [],
      model
    };
    array.push(obj);
    return obj;
  }
  async IsEquipement(items) {
    for (const Oitems of items) {
      for (const item of Oitems.items) {
        if (item.type === "SpinalSystemServiceTicketTypeTicket") {
          const TicketRealNode = FileSystem._objects[item.serverId];
          const EquipementRealNode = await spinalIO.loadPtr(
            TicketRealNode.info.elementSelected
          );
          if (EquipementRealNode.getType().get() === "BIMObject") {
            return true;
          }
        }
      }
    }
    return false;
  }
}


