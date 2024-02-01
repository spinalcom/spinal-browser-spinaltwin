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

import { EventBus } from '../../event';
import { spinalBackEnd } from '../../spinalBackend';
import { viewerUtils } from '../viewerUtils';
import {
  SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
  // SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME
} from "spinal-service-ticket" 
import { EQUIPMENT_RELATION_LIST, GEO_RELATIONS } from '../../../constants';

EventBus.$on('ticket-viewer-zoom', async (items) => {
  await viewerUtils.waitInitialized();
  viewerUtils.fitToView(items);
});

EventBus.$on('ticket-viewer-isolate', async (items) => {
  await viewerUtils.waitInitialized();
  viewerUtils.isolateObjects(items);
});

EventBus.$on('ticket-viewer-select', async (items) => {
  await viewerUtils.waitInitialized();
  viewerUtils.selectObjects(items);
});

EventBus.$on('ticket-viewer-reset-color', async () => {
  await viewerUtils.waitInitialized();
  viewerUtils.restoreColorThemingItems();
});

EventBus.$on('ticket-viewer-color', async (items, relation) => {
  
  await viewerUtils.waitInitialized();
  viewerUtils.restoreColorThemingItems();


  for(let item of items){

    let ticket = FileSystem._objects[item.serverId];
    const bimParent = await ticket.find(SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, (p) => {
      return p.getType().get() !== 'SpinalSystemServiceTicketTypeStep';
    });
    const bimParents = await ticket.getParents(SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
    if(bimParents.length != 0){
      for(let bimParent of bimParents){
        if(bimParent.getType().get() != 'SpinalSystemServiceTicketTypeStep'){



          const list2 = await spinalBackEnd.spatialBack.getLstByModelAndRelation(
            // { server_id: item.serverId },
            { server_id: bimParent._server_id },
            [...EQUIPMENT_RELATION_LIST, ...GEO_RELATIONS],
            true
          );

          for (const { selection, model } of list2) {
            viewerUtils.colorThemingItems(model, item.color, selection);
          }
        }

      }
    }
    
  }
      
  
  
  
});
