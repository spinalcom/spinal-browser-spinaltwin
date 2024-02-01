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

import 'spinal-core-connectorjs_type';
import {
  SpinalContext,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { spinalServiceTicket } from 'spinal-service-ticket';
import { TicketInterface } from 'spinal-models-ticket';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import {
  GEO_RELATIONS,
  GEO_BUILDING_TYPE,
  GEO_FLOOR_TYPE,
  GEO_ROOM_TYPE,
  EQUIPMENT_TYPE,
} from '../../../../constants';
import {
  SPINAL_TICKET_SERVICE_STEP_TYPE,
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  STEP_RELATION_NAME
} from 'spinal-service-ticket/dist/Constants';

const GEO_TYPES = [GEO_FLOOR_TYPE, GEO_ROOM_TYPE, EQUIPMENT_TYPE];

class TargetDescription {
  name: string;
  type: string;
  nodeId:string;
  ispath: boolean;
  path: string;
  parent:Object;
  isGeographic:boolean;

  constructor(node: SpinalNode) {
    this.name = node.name.get();
    this.type = node.type.get();
    this.nodeId = node.id.get();
    this.ispath = false; // ??????????????????????????????
    this.path = ''; // ????????????????????? inutile
    this.parent= new Object();
    this.isGeographic = false;
  }

  async pathPrepare(node: SpinalNode): Promise<void> {
    let parent = await SpinalGraphService.getParents(
      node.id.get(),
      GEO_RELATIONS
    );
    if (parent.some((p) => p.type.get() === GEO_BUILDING_TYPE)) {
      parent = parent?.filter((p) => p.type.get() === GEO_BUILDING_TYPE);
      this.path = parent[0].name.get() + '/';
      return;
    }
    parent = parent?.filter((p) => GEO_TYPES.includes(p.type.get()));
    await this.pathPrepare(parent[0]);
    this.path += parent[0].name.get() + '/';
  }

  async setPath(node: SpinalNode): Promise<void> {
    let real_node = SpinalGraphService.getRealNode(node.id.get());
    let context_id = node.contextIds._attribute_names[0];
    let context = await SpinalGraphService.getRealNode(context_id);

    if (GEO_TYPES.includes(node.type.get())) {
      this.ispath = true;
      await this.pathPrepare(node);
    } else if (!(real_node instanceof SpinalContext)) {
      let parent = await SpinalGraphService.getParents(node.id.get(), []);
      parent = parent?.filter(
        async (p) =>
          (await SpinalGraphService.getRealNode(p.id.get())) instanceof
            SpinalContext || p.contextIds._attribute_names.includes(context_id)
      );
      this.path = parent[0].name.get();
    } else {
      console.log('Empty path : node is a context.');
    }
  }
}

class TicketDescription {
  ticket: Object;
  name: string;
  creationDate: Date;
  step: string;
  events: Array<Object>;
  comments: Array<Object>;
  priority: string;
  target: TargetDescription;

  constructor(ticket, name, creationDate) {
    this.ticket = ticket;
    this.name = name;
    this.creationDate = creationDate;
  }
}

export async function getTicketDescription(
  ticket: TicketInterface
): Promise<TicketDescription> {
  let ticketDesc = new TicketDescription(
    ticket,
    ticket.name,
    ticket.creationDate
  );
  

  let ticketNode = SpinalGraphService.getRealNode(ticket.id!);
  ticketDesc.comments = await serviceDocumentation.getNotes(ticketNode);

  let stepinfo = await SpinalGraphService.getParents(
    ticket.id!,
    SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME
  );
  stepinfo = stepinfo.filter(
    (step) => step.type.get() === SPINAL_TICKET_SERVICE_STEP_TYPE
  );
  ticketDesc.step = stepinfo[0].name.get();
  let process = await SpinalGraphService.getParents(stepinfo[0].id.get(), STEP_RELATION_NAME);
  if(process.length !=0){
    ticketDesc.steps = await spinalServiceTicket.getStepsFromProcess(process[0].id.get(), ticket.contextId);
  }

  ticketDesc.events = await spinalServiceTicket.getLogs(ticket.id!);

  let priority = ticket.priority;
  switch (priority) {
    case 0:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Occasion';
      break;
    case 1:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Normal';
      break;
    case 2:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Urgent';
      break;
  }

  let targetinfo = await SpinalGraphService.getParents(
    ticket.id!,
    [SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, "hasAlarm"]
  );
  // targetinfo = ticket.getParentsInContext()
  targetinfo = targetinfo.filter(
    (step) => step.type.get() !== SPINAL_TICKET_SERVICE_STEP_TYPE
  );
  ticketDesc.target = new TargetDescription(targetinfo[0]);
  if(targetinfo[0].type.get() == GEO_ROOM_TYPE){
    let targetParentNode = await SpinalGraphService.getParents(targetinfo[0].id.get(), GEO_RELATIONS);
    if(targetParentNode.length !=0){
      let n = targetParentNode.filter(
        (p) => p.type.get() === GEO_FLOOR_TYPE
      );
      // let res = {
      //   name: n[0].name.get(),
      //   type: n[0].type.get(),
      //   nodeId: n[0].id.get()
      // }
      // ticketDesc.target.parent = res;
      ticketDesc.target.parent = n[0];
      ticketDesc.target.isGeographic = true;
    }
    
  }
  ticketDesc.target.setPath(targetinfo[0]);

  return ticketDesc;
}
