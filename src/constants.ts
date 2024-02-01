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
import { getParameterByName } from './services/utlils/getParameterByName';
export const USE_REMOTE_CONNECT = getParameterByName('path') ? false: true;

// export const DISABLE_VIEWER = true // for dev
export const DISABLE_VIEWER = false;

export {
  CONTEXT_TYPE as SPATIAL_CONTEXT_TYPE,
  SITE_RELATION,
  SITE_TYPE,
  BUILDING_REFERENCE_CONTEXT,
  BUILDING_RELATION,
  BUILDING_TYPE,
  FLOOR_REFERENCE_CONTEXT,
  FLOOR_RELATION,
  FLOOR_TYPE,
  ZONE_RELATION,
  ZONE_TYPE,
  ROOM_RELATION,
  ROOM_TYPE,
  REFERENCE_RELATION,
  EQUIPMENT_RELATION,
  EQUIPMENT_TYPE,
} from 'spinal-env-viewer-context-geographic-service';

import {
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION,
  REFERENCE_RELATION,
  REFERENCE_ROOM_RELATION,
} from 'spinal-env-viewer-context-geographic-service';

export {
  // TICKET_CONTEXT_NAME,
  TICKET_CONTEXT_TYPE,
  PROCESS_RELATION_NAME as TICKET_RELATION_CONTEXT_PROCESS,
  PROCESS_TYPE as TICKET_PROCESS_TYPE,
  STEP_RELATION_NAME as TICKET_RELATION_PROCESS_STEP,
  STEP_TYPE as TICKET_STEP_TYPE,
  TICKET_RELATION_NAME as TICKET_RELATION_STEP_TICKET,
  SPINAL_TICKET_SERVICE_TICKET_TYPE as TICKET_TICKET_TYPE,
  INCIDENT_SECTION_RELATION_NAME as TICKET_RELATION_PROCESS_OBJET,
  INCIDENT_SECTION_TYPE as TICKET_OBJECT_TYPE,
} from 'spinal-service-ticket';

// export {
//   TICKET_CONTEXT_NAME as SERVICE_NAME,
//   TICKET_CONTEXT_TYPE as SERVICE_TYPE,
//   TICKET_RELATION_CONTEXT_PROCESS as SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME,
//   TICKET_PROCESS_TYPE as PROCESS_TYPE,
//   TICKET_RELATION_PROCESS_STEP as SPINAL_TICKET_SERVICE_STEP_RELATION_NAME,
//   TICKET_STEP_TYPE as SPINAL_TICKET_SERVICE_STEP_TYPE,
//   TICKET_RELATION_STEP_TICKET as SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME,
//   TICKET_TICKET_TYPE as SPINAL_TICKET_SERVICE_TICKET_TYPE,
//   TICKET_RELATION_PROCESS_OBJET as SPINAL_TICKET_SERVICE_INCIDENT_SECTION_RELATION_NAME,
//   TICKET_OBJECT_TYPE as SPINAL_TICKET_SERVICE_INCIDENT_SECTION_TYPE
// } from 'spinal-service-ticket/dist/Constants.js';

export const GEO_RELATIONS = [
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION,
  REFERENCE_RELATION,
  REFERENCE_ROOM_RELATION,
  // OLD RELATION NAMES
  'hasBIMObject',
  'hasReference',
  'hasReferenceObject',
];

export const SCENE_RELATION_CONTEXT_TYPE = 'SpinalService';
export const SCENE_RELATION_NAME = 'hasScene';
export const PART_RELATION_NAME = 'hasParts';

export const CATEGORY_RELATION_NAME = 'hasCategory';
export const GROUP_RELATION_NAME = 'hasGroup';

export const GROUP_EQUIPMENT_RELATION_NAME = 'groupHasBIMObject';

// equipment group context
export const EQUIPMENT_RELATION_LIST = [
  CATEGORY_RELATION_NAME,
  GROUP_RELATION_NAME,
  GROUP_EQUIPMENT_RELATION_NAME,
];

export const GEO_ROOM_TYPE = 'geographicRoom';
export const GEO_FLOOR_TYPE = 'geographicFloor';
export const GEO_BUILDING_TYPE = 'geographicBuilding';

export const SPACE_CONTEXT_TYPE = 'geographicRoomGroupContext';
export const SPACE_CATEGORY_TYPE = 'groupingCategory';
export const SPACE_GROUP_TYPE = 'geographicRoomGroup';
export const SPACE_ROOM_RELATION = 'groupHasgeographicRoom';
export const SERVER_HOST = window.location.host;

export const SPACE_RELATION_LIST = [
  CATEGORY_RELATION_NAME,
  GROUP_RELATION_NAME,
  SPACE_ROOM_RELATION,
];

export const TICKET_PRIORITY_LIST = ['Occasionally', 'Normal', 'Urgent'];

