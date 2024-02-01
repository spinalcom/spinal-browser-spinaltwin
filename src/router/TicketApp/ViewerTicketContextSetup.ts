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

import {
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { EQUIPMENT_TYPE, FLOOR_TYPE, ROOM_TYPE } from '../../constants';
import { EQUIPMENT_RELATION_LIST, GEO_RELATIONS } from '../../constants';
// import {
//   TICKET_TICKET_TYPE,
//   TICKET_TICKET_RELATION,
//   TICKET_RELATION_LIST,
// } from 'spinal-service-ticket/dist/constants.js';
import {
  SPINAL_TICKET_SERVICE_TICKET_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  SPINAL_TICKET_SERVICE_STEP_TYPE
} from "spinal-service-ticket/dist/Constants.js";

/**
 * Script to setup viewer & ticket interaction
 */

// untyped window to use 'BimObjectService' without error
const anyWin: any = window;

/**
 * Script to setup viewer & ticket interaction
 *
 * @param ticketContext Context Node to run the script on
 */
export async function addObjectToTicket(ticketContext: spinal.Model) {
  const relations = ['SpinalSystemServiceTicketHasTicket'];
  // Get tickets in the graph from the given node and below
  const listTicket: spinal.Model[] = await ticketContext.find(
    relations,
    (n) => {
      if (
        n.getType().get() === SPINAL_TICKET_SERVICE_TICKET_TYPE ||
        n.getType().get() === 'SpinalSystemServiceTicketTypeTicket'
      ) {
        // When a ticket is found, add it to the spinalgraphservice
        // so it can be found later using getRealnode
        // @ts-ignore
        SpinalGraphService._addNode(n);
        return true;
      }
      return false;
    }
  );

  for (const ticket of listTicket) {
    // get the parents of the tickets then find the bimobject connected to the ticket
    const parents = await ticket.getParents(
      'SpinalSystemServiceTicketHasTicket'
    );
    const bimParent = parents.find((p) => {
      return p.getType().get() !== 'SpinalSystemServiceTicketTypeStep';
    });
    if (typeof bimParent === 'undefined') {
      // skip tickets with no connection to non step node
      continue;
    }

    // get all the bimobjects from the tickets' parents
    const objects: spinal.Model[] = await bimParent.find(relations, (n) => {
      if (

        n.getType().get() === EQUIPMENT_TYPE ||
        n.getType().get() === 'BimObject'
      ) {
        // @ts-ignore
        SpinalGraphService._addNode(n);
        return true;
      }
      return false;
    });
    let bimIds: string[] = [];
    for (const object of objects) {
      bimIds.push(object.info.bimFileId.get());
    }

    // add the objects as an attribute of the ticket
    if (bimIds.length > 0) {
      if (typeof ticket.objects !== 'undefined') {
        ticket.mod_attr('objects', bimIds);
      } else {
        ticket.add_attr('objects', bimIds);
      }
    }
  }
}

function getOrAddModelIfMissing(array, model): { selection: number[]; model } {
  for (const obj of array) {
    if (obj.model === model) {
      return obj;
    }
  }
  const obj = {
    selection: [],
    model,
  };
  array.push(obj);
  return obj;
}

/**
 * Function to get selected items by tickets
 *
 * @param node To get the selected items from
 */
export default async function getItemsFromNode(node) {
  let items: { selection: number[]; model: Autodesk.Viewing.Model }[] = [];
  if (node.getType().get() === SPINAL_TICKET_SERVICE_TICKET_TYPE) {
    const itms = await getItemsByTicket(node);
    items = items.concat(itms);
  }
  else if (node.getType().get() === SPINAL_TICKET_SERVICE_STEP_TYPE) {
    let listTicket = await node.getChildren(SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
    // let items: { selection: number[]; model: Autodesk.Viewing.Model }[] = [];
    for (const ticket of listTicket) {
      const itms = await getItemsByTicket(ticket);
      if (itms){
        items = items.concat(itms);
      } 
    }

    
  }
  return turnNodeIntoViewerCompatibleBimObject(items);
  // // get the tickets from the node
  // const listTicket = await node.find(TICKET_RELATION_LIST, (n) => {
  //   if (
  //     n.getType().get() === SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME ||
  //     n.getType().get() === SPINAL_TICKET_SERVICE_TICKET_TYPE ||
  //     n.getType().get() === 'SpinalSystemServiceTicketTypeTicket'
  //   ) {
  //     // When a ticket is found, add it to the spinalgraphservice
  //     // so it can be found later using getRealnode
  //     // @ts-ignore
  //     SpinalGraphService._addNode(n);
  //     return true;
  //   }
  //   return false;
  // });

  // const items: { selection: number[]; model: Autodesk.Viewing.Model }[] = [];
  // for (const ticket of listTicket) {
  //   const itms = await getItemsByTicket(ticket);
  //   if (itms) items.concat(itms);
  // }
  // return items;
}

/**
 * Function to get selected items by tickets
 *
 * @param ticket To get the selected items from
 */
export async function getItemsByTicket(
  ticket
): Promise<
  // { selection: number[]; model: Autodesk.Viewing.Model }[] | undefined
  SpinalNode<any>[] | undefined
> {
  // get the parents of the tickets then find the bimobject connected to the ticket
  const parents = await ticket.getParents(SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);

  // get the spatial parent of the ticket
  let bimParents = parents.filter(
    (p) => p.getType().get() !== 'SpinalSystemServiceTicketTypeStep'
  );
  // tickets has no connection to a non-step node
  // any other should be equipment or space related and have a bimobject
  if (typeof bimParents === 'undefined' || bimParents.length === 0) {
    return undefined;
  }

  // get all the bimobjects from the tickets' spatial parents
  let objects: SpinalNode[] = [];
  for (const parent of bimParents) {
    // let found = await parent.find(
    //   [...EQUIPMENT_RELATION_LIST, ...GEO_RELATIONS],
    //   (n) => {
    //     // @ts-ignore
    //     if (
    //       n.getType().get() === EQUIPMENT_TYPE ||
    //       n.getType().get() === 'BimObject'
    //     ) {
    //       // @ts-ignore
    //       SpinalGraphService._addNode(n);
    //       return true;
    //     }
    //     return false;
    //   }
    // );

    let found2 = await findCustom(parent, [...EQUIPMENT_RELATION_LIST, ...GEO_RELATIONS], EQUIPMENT_TYPE, []);
    objects.push(...found2)
  }
  return objects;

  // turn node of the bim objects into viewer compatible objects
  // const bimObjects: {
  //   selection: number[];
  //   model: Autodesk.Viewing.Model;
  // }[] = [];
  // for (const object of objects) {
  //   const bimFileId = object.info.bimFileId.get();
  //   const dbId: number = object.info.dbid.get();
  //   const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
  //   if (model && bimObjects.some((o) => o.model === model) === false) {
  //     const obj: {
  //       selection: number[];
  //       model: Autodesk.Viewing.Model;
  //     } = {
  //       selection: [],
  //       model,
  //     };
  //     obj.selection.push(dbId);
  //     bimObjects.push(obj);
  //   } else {
  //     let obj = bimObjects.find((o) => o.model === model);
  //     if (obj) {
  //       obj.selection.push(dbId);
  //     }
  //   }
  // }
  // return bimObjects;
}

function turnNodeIntoViewerCompatibleBimObject(objects){
    // turn node of the bim objects into viewer compatible objects
    const bimObjects: {
      selection: number[];
      model: Autodesk.Viewing.Model;
    }[] = [];
    for (const object of objects) {
      const bimFileId = object.info.bimFileId.get();
      const dbId: number = object.info.dbid.get();
      const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
      if (model && bimObjects.some((o) => o.model === model) === false) {
        const obj: {
          selection: number[];
          model: Autodesk.Viewing.Model;
        } = {
          selection: [],
          model,
        };
        obj.selection.push(dbId);
        bimObjects.push(obj);
      } else {
        let obj = bimObjects.find((o) => o.model === model);
        if (obj) {
          obj.selection.push(dbId);
        }
      }
    }
    return bimObjects;


}

export async function findCustom(parentNode, relationList, type, filler) {
  let result = filler;
  if(parentNode != undefined){
    if(parentNode.getType().get() == type){
      result.push(parentNode);
    }
    else{
      let children = await parentNode.getChildren(relationList);
      for (let child of children) {
        if (child.getType().get() == type) result.push(child);
        else {
          result = await findCustom(child, relationList, type, result);
        }
      }
    }
  }
  
  
  return result;
}

