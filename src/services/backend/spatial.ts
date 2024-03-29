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
  SPATIAL_CONTEXT_TYPE,
  // BUILDING_REFERENCE_CONTEXT,
  // FLOOR_REFERENCE_CONTEXT,
  SITE_RELATION,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,

  BUILDING_TYPE,
  FLOOR_TYPE,
  ROOM_TYPE,
  EQUIPMENT_TYPE,
  GEO_RELATIONS,
  EQUIPMENT_RELATION,
  TICKET_TICKET_TYPE,
} from '../../constants';
import { EventBus } from '../event';
import { FileSystem } from 'spinal-core-connectorjs_type';
import ProcessOnChange from '../utlils/ProcessOnChange';
import throttle from 'lodash.throttle';
import { SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import obj from 'spinal-model-bmsnetwork/dist/SpinalBms';
const anyWin: any = window;
type nodeRef = {
  name: string,
  id: string,
  server_id: number
}
type roomObject = {
  items: Set<nodeRef>;
  process: ProcessOnChange;
}


export default class BackEndSpatial {
  buildingNode: SpinalNode<any>;
  handleFloorsBinded: () => void;
  floorsProcess: ProcessOnChange;
  roomsProcess: Map<string, roomObject>
  floorSelected: nodeRef
  floors: nodeRef[];
  building: nodeRef
  handleFloorProm: Promise<void> = null;

  constructor() {
    this.buildingNode = null;
    this.handleFloorsBinded = this.handleFloors.bind(this);
    this.floorsProcess = new ProcessOnChange(this.handleFloorsBinded, { type: 'throttle', timeout: 2000 });
    this.roomsProcess = new Map();
    this.floorSelected = null;
    this.floors = [];
  }


  async getContextSpatial(graph) {
    const children = await graph.getChildren();
    for (const context of children) {
      if (context.info.type.get() === SPATIAL_CONTEXT_TYPE) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        return context;
      }
    }
  }

  async getBuilding(contextgeo) {
    const buildings = await contextgeo.find([SITE_RELATION, BUILDING_RELATION],
      (obj) => {
        return obj.info.type.get() === BUILDING_TYPE;
      });
    return buildings[0];
  }

  async getFloors(buildingNode) {
    const floors = await buildingNode.find([ZONE_RELATION, FLOOR_RELATION],
      (obj) => {
        this.floorsProcess.add(obj, false);
        return obj.info.type.get() === FLOOR_TYPE;
      });
    return floors;
  }


  async init(graph) {
    const contextgeo = await this.getContextSpatial(graph);
    this.buildingNode = await this.getBuilding(contextgeo);
    this.building = this.getBuildingJSON(this.buildingNode);
    this.floorsProcess.add(this.buildingNode, true);
    EventBus.$on("get-side-bar-floors-data", () => {
      if (this.floors.length === 0) this.floorsProcess.fctOnChange();
      else EventBus.$emit("side-bar-change", this.floors, this.building);
    });
    EventBus.$on("get-side-bar-rooms-data", (floorSelected) => {
      this.floorSelected = floorSelected;
      this.getRoomProcess(FileSystem._objects[floorSelected.server_id]).process.fctOnChange();
    });
  }

  getBuildingJSON(buildingNode) {
    return {
      name: buildingNode.info.name.get(),
      id: buildingNode.info.id.get(),
      server_id: buildingNode._server_id
    };
  }

  async handleFloors() {
    if (this.handleFloorProm) {
      return this.handleFloorProm
    }
    this.handleFloorProm = this._handleFloors();
    return this.handleFloorProm;
  }

  private async _handleFloors() {
    const floors = await this.getFloors(this.buildingNode);
    const res = [];
    const updatefloor = throttle((floor, building) => {
      EventBus.$emit("side-bar-change", floor, building);
    }, 1000);
    const roomsProm: Promise<Set<nodeRef>>[] = [];
    for (const floor of floors) {
      // @ts-ignore
      SpinalGraphService._addNode(floor);
      this.floorsProcess.add(floor, false);
      roomsProm.push(this.handleFloorRooms(floor));
      res.push({
        name: floor.info.name.get(),
        id: floor.info.id.get(),
        server_id: floor._server_id,
        children: []
      });
      updatefloor(res, this.building);
    }

    const floorsChildren = await Promise.all(roomsProm);
    for (let idx = 0; idx < floorsChildren.length; idx++) {
      const floorsChild = floorsChildren[idx];
      const floor = res[idx];
      for (const child of floorsChild) {
        floor.children.push(child)
      }
    }
    this.floors = res;
    updatefloor(res, this.building);
  }



  async handleFloorRooms(floorModel) {
    let roomsProcess = this.getRoomProcess(floorModel);
    const roomsModels = await floorModel.find([ZONE_RELATION, ROOM_RELATION],
      (obj) => obj.info.type.get() === ROOM_TYPE);

    roomsProcess.process.add(floorModel, false);
    for (const room of roomsModels) {
      // @ts-ignore
      SpinalGraphService._addNode(room);
      roomsProcess.process.add(room, false);
      this.existInSet(roomsProcess.items, 'id', {
        name: room.info.name.get(),
        id: room.info.id.get(),
        server_id: room._server_id
      });
    }
    EventBus.$emit("side-bar-room-change", roomsProcess.items, floorModel.info.id.get());
    return roomsProcess.items;
  }
  existInSet<T>(setObj: Set<T>, key, objToAdd: T): T {
    for (const obj of setObj) {
      if (obj[key] === objToAdd[key]) {
        for (const key1 in objToAdd) {
          if (objToAdd.hasOwnProperty(key1)) {
            obj[key1] = objToAdd[key1];
          }
        }
        return obj;
      }
    }
    setObj.add(objToAdd);
    return objToAdd;
  }

  getRoomProcess(floorModel) {
    const floorId = floorModel.info.id.get();
    if (this.roomsProcess.has(floorId)) {
      return this.roomsProcess.get(floorId);
    } else {
      const item: roomObject = {
        items: new Set(),
        process: new ProcessOnChange(() => {
          return this.handleFloorRooms(floorModel);
        }, { type: 'throttle', timeout: 1000 })
      };
      this.roomsProcess.set(floorId, item);
      return item;
    }
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getLstByModel(item, addRoomRef = false) {
    const node = getNodeFromItem(item);
    const relations = [...GEO_RELATIONS, "hasReferenceObject.ROOM"]
    const listNode = await node.find(relations, (n) => {
      return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
    });
    return sortBIMObjectByModel(listNode);
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getLstByModelEquipment(item, addRoomRef = false) {
    const node = getNodeFromItem(item);
    const relations = [...EQUIPMENT_RELATION]
    const listNode = await node.find(relations, (n) => {
      return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
    });
    return sortBIMObjectByModel(listNode);
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getLstByModelAndRelation(item, relation, addRoomRef = false) {
    const node = getNodeFromItem(item);
    const relations = [...relation]
    const listNode = await node.find(relations, (n) => {
      return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
    });
    return sortBIMObjectByModel(listNode);
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getObjectsByTicketGroup(ticketGroup, addRoomRef = false) {
    let node = getNodeFromItem(ticketGroup);
    const relations = [..."SpinalSystemServiceTicketHasTicket"]
    const listTicket = await node.find(relations, (n) => {
      return (
        n.getType().get() === TICKET_TICKET_TYPE
        || n.getType().get() === "SpinalSystemServiceTicketTypeTicket"
      );
    });
    let objects = [];
    for (const ticket of listTicket) {
      console.debug("ticket:", ticket.objects)
      let test = Object.keys(ticket.objects).map(function(key) {
        if (parseInt(key) || parseInt(key) === 0) {
          console.debug(ticket.objects[key])
          return ticket.objects[key]
        }
      })
      console.debug("test :", test.filter(e => { return typeof e !== "undefined" }))
      objects = objects.concat(test.filter(e => { return typeof e !== "undefined" }));
    }
    console.debug("objects: ", objects)
    return sortBIMObjectByModel(objects);
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getObjectsByTicketGroup_Legacy(ticketGroup, addRoomRef = false) {
    let node = getNodeFromItem(ticketGroup);
  console.debug("root :", node)
  const relations = [..."SpinalSystemServiceTicketHasTicket"]
    const listTicket = await node.find(relations, (n) => {
      return (
        n.getType().get() === TICKET_TICKET_TYPE
        || n.getType().get() === "SpinalSystemServiceTicketTypeTicket"
      );
    });

    let listNode = [];
    for (const ticket of listTicket) {
      const parents = await ticket.getParents("SpinalSystemServiceTicketHasTicket")
      for (const parent of parents) {
        if (parent.getType().get() != "SpinalSystemServiceTicketTypeStep")
          node = parent;
      }
      const objects = await node.find(relations, (n) => {
        return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
      });
      listNode = listNode.concat(objects)
    }
    return sortBIMObjectByModel(listNode);
  }

  async addObjectToTicket(ticketGroup) {
    let node = getNodeFromItem(ticketGroup);
    console.debug("root :", node)
    const relations = [..."SpinalSystemServiceTicketHasTicket"]
    const listTicket : spinal.Model[] = await node.find(relations, (n) => {
      return (
        n.getType().get() === TICKET_TICKET_TYPE
        || n.getType().get() === "SpinalSystemServiceTicketTypeTicket"
      );
    });

    let listNode = [];
    for (const ticket of listTicket) {
      const parents = await ticket.getParents("SpinalSystemServiceTicketHasTicket")
      for (const parent of parents) {
        if (parent.getType().get() != "SpinalSystemServiceTicketTypeStep")
          node = parent;
      }
      const objects = {
        BIMObjects: [],
        BIMIds: [],
        nameAttr: ["objects"],
      };
      objects.BIMObjects = await node.find(relations, (n) => {
        return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
      });
      for (const obj of objects.BIMObjects) {
        objects.BIMIds.push(obj.info.bimFileId.get())
      }
      ticket.add_attr({objects: objects.BIMIds})
    }
    console.debug(listTicket)
    return sortBIMObjectByModel(listNode);
  }
}

/**
 * @param { {server_id: number} } item
 * @returns
 */
function getNodeFromItem(item) {
  return FileSystem._objects[item.server_id];
}

function sortBIMObjectByModel(arrayOfBIMObject): { selection: number[], model }[] {
  let arrayModel = [];
  for (const nodeBIMObject of arrayOfBIMObject) {
    const bimFileId = nodeBIMObject.info.bimFileId.get();
    const dbId = nodeBIMObject.info.dbid.get();
    const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
    if (model) {
      const obj = getOrAddModelIfMissing(arrayModel, model);
      obj.selection.push(dbId);
    }
  }
  return arrayModel;
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
  return obj;
}
