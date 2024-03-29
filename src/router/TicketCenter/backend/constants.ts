/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

import { SPINAL_RELATION_PTR_LST_TYPE } from 'spinal-env-viewer-graph-service';

export const SERVICE_NAME: string = 'Ticket Service';
export const SERVICE_TYPE: string = 'SpinalSystemServiceTicket';

/////////////////////////////////////////
/////////////// TICKET ///////////////////
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_TICKET_SECTION: string = 'SpinalSystemServiceHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME: string = 'SpinalSystemServiceTicketHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_NAME: string = 'Tickets';
export const SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME: string = 'SpinalSystemServiceHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasTicket';
export const SPINAL_TICKET_SERVICE_TICKET_TYPE: string = 'SpinalSystemServiceTicketTypeTicket';

/////////////////////////////////////////
/////////////// PROCESS /////////////////
export const SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive_Archive_Process';
export const SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME: string = 'SpinalSystemServiceTicketHasProcess';
export const SPINAL_TICKET_SERVICE_PROCESS_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasProcess';
export const PROCESS_TYPE: string = 'SpinalServiceTicketProcess';
export const SPINAL_TICKET_SERVICE_PROCESS_TYPE: string = 'SpinalSystemServiceTicketTypeProcess';
export const PROCESS_HAS_TICKET_RELATION_NAME: string = 'SpinalSystemService_ProcessHasTicket';
export const PROCESS_HAS_TICKET_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;

//////////////////////////////////////
/////////////// STEP /////////////////
export const SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_STEP_TYPE: string = 'SpinalSystemServiceTicketTypeStep';
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_RELATION_NAME: string = 'SpinalSystemServiceArchiveHasStep';
export const SPINAL_TICKET_SERVICE_STEP_ARCHIVE_NAME: string = 'Spinal_Service_Ticket_Archive_Archive_Step';
export const SPINAL_TICKET_SERVICE_STEP_RELATION_NAME: string = 'SpinalSystemServiceTicketHasStep';



export const ARCHIVED_STEP = {
  name: "Archived",
  order: -1,
  color: "#FF0000"
}

/////////////////////////////////////////
/////////////// CATEGORY ////////////////
export const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_TYPE: string = SPINAL_RELATION_PTR_LST_TYPE;
export const SPINAL_TICKET_SERVICE_INCIDENT_SUB_SECTION_RELATION_NAME: string = 'Spinal_Service_Ticket_Process_has_sub_category';
export const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE: string = 'DEFAULT_INCIDENT_TYPE';
export const SPINAL_TICKET_SERVICE_INCIDENT_RELATION_NAME: string = 'Spinal_Service_Ticket_Process_has_category';
export const SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME: string = 'Spinal_Service_Ticket_Process_has_categories_section';
export const SPINAL_TICKET_SERVICE_INCIDENT_TYPE: string = 'INCIDENT_TYPE';
export const DEFAULT_INCIDENTS_NAME: string = 'Incidents commun';
