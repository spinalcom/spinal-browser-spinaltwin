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

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  EQUIPMENT_TYPE,
  EQUIPMENT_RELATION_LIST,
  GEO_RELATIONS,
} from '../../constants';
import {
  TICKET_STEP_TYPE,
  TICKET_TICKET_TYPE,
  TICKET_TICKET_RELATION,
  TICKET_RELATION_LIST,
} from 'spinal-service-ticket/dist/Constants.js';

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
  console.debug("root :", ticketContext);
  const relations = [..."SpinalSystemServiceTicketHasTicket"];
  // Get tickets in the graph from the given node and below
  const listTicket: spinal.Model[] = await ticketContext.find(relations, (n) => {
    if (
      n.getType().get() === TICKET_TICKET_TYPE
      || n.getType().get() === "SpinalSystemServiceTicketTypeTicket"
    ) {
      // When a ticket is found, add it to the spinalgraphservice
      // so it can be found later using getRealnode
      SpinalGraphService._addNode(n);
      return true;
    }
    return false
  });

  for (const ticket of listTicket) {
    // get the parents of the tickets then find the bimobject connected to the ticket
    const parents = await ticket.getParents("SpinalSystemServiceTicketHasTicket");
    const bimParent = parents.find(p => {
      return p.getType().get() !== "SpinalSystemServiceTicketTypeStep"
    });
    console.debug("bim parent :", bimParent)
    if (typeof bimParent === "undefined") {
      // skip tickets with no connection to non step node
      continue;
    }

    // get all the bimobjects from the tickets' parents
    const objects: spinal.Model[] = await bimParent.find(relations, (n) => {
      if (
        n.getType().get() === EQUIPMENT_TYPE
        || n.getType().get() === "BimObject"
      ) {
        SpinalGraphService._addNode(n);
        return true;
      }
      return false
    });
    let bimIds = []
    for (const object of objects) {
      bimIds.push(object.info.bimFileId.get());
    }


    //   // turn node of the bim objects into viewer compatible objects
    //   const bimObjects = []
    //   for (const object of objects) {
    //     const bimFileId = object.info.bimFileId.get();
    //     const dbId = object.info.dbid.get();
    //     const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
    //     if (model) {
    //       const obj = getOrAddModelIfMissing(bimObjects, model);
    //       obj.selection.push(dbId);
    //     }
    //   }

    // add the objects as an attribute of the ticket
    console.debug("before :", ticket)
    if (bimIds.length > 0) {
      if (typeof ticket.objects !== "undefined") {
        console.debug("mod :", ticket.objects, bimIds)
        ticket.mod_attr("objects", bimIds)
      }
      else {
        console.debug("add :", bimIds)
        ticket.add_attr("objects", bimIds);
      }
      console.debug("after :", ticket)
    }
  }
  console.debug("ticket list :", listTicket);
}

function getOrAddModelIfMissing(array, model): { selection: number[], model } {
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
  console.debug("model added", array)
  return obj;
}

/**
 * Function to get selected items by tickets
 *
 * @param node To get the selected items from
 */
export default async function getItemsFromNode(node) {
  let items = [];
  if (node.getType().get() === TICKET_TICKET_TYPE) {
    items = await getItemsByTicket(node);
    return items;
  }

  // get the tickets from the node
  const listTicket = await node.find(TICKET_RELATION_LIST, (n) => {
    if (n.getType().get() === TICKET_TICKET_RELATION
      || n.getType().get() === TICKET_TICKET_TYPE
      || n.getType().get() === "SpinalSystemServiceTicketTypeTicket") {
      // When a ticket is found, add it to the spinalgraphservice
      // so it can be found later using getRealnode
      SpinalGraphService._addNode(n);
      return true;
    }
    return false
  });

  for (const ticket of listTicket) {
    items = items.concat(await getItemsByTicket(ticket));
  }
  return items;
}

/**
 * Function to get selected items by tickets
 *
 * @param ticket To get the selected items from
 */
export async function getItemsByTicket(ticket) {
  // get the parents of the tickets then find the bimobject connected to the ticket
  const parents = await ticket.getParents(TICKET_TICKET_RELATION);

  // get the spatial parent of the ticket
  let bimParents = parents.filter(p => p.getType().get() !== "SpinalSystemServiceTicketTypeStep");
  // tickets has no connection to a non-step node
  // any other should be equipment or space related and have a bimobject
  if (typeof bimParents === "undefined" || bimParents.length === 0) {
    return undefined;
  }

  // get all the bimobjects from the tickets' spatial parents
  let objects = []
  for (const parent of bimParents) {
    let found = await parent.find([...EQUIPMENT_RELATION_LIST, ...GEO_RELATIONS], n => {
      if (
        n.getType().get() === EQUIPMENT_TYPE
        || n.getType().get() === "BimObject"
      ) {
        SpinalGraphService._addNode(n);
        return true;
      }
      return false
    });
    objects = objects.concat(found);
  }

  // turn node of the bim objects into viewer compatible objects
  const bimObjects = []
  for (const object of objects) {
    const bimFileId = object.info.bimFileId.get();
    const dbId = object.info.dbid.get();
    const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
    if (model && bimObjects.some(o => o.model === model) === false) {
      const obj = {
        selection: [],
        model
      };
      obj.selection.push(dbId);
      bimObjects.push(obj);
    }
    else {
      let obj = bimObjects.find(o => o.model === model);
      if (obj) {
        obj.selection.push(dbId);
      }
    }
  }

  return bimObjects;
}