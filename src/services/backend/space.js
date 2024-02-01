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

// import { groupService } from "spinal-env-viewer-room-manager/services/service.js";

import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service';

import { FileSystem } from 'spinal-core-connectorjs_type';
import { ROOM_TYPE } from 'spinal-env-viewer-context-geographic-service/build/constants';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';

import q from 'q';

export default class Space {
  constructor() {
    this.allContext;

    this.initDefer = q.defer();
  }

  async init(graph) {
    //"SpinalControlPointGroupContext"
    //ROOM_TYPE
    await SpinalGraphService.waitForInitialization();
    let contextNodes = await graph.getChildren('hasContext');
    const cons = await groupManagerService.getGroupContexts(ROOM_TYPE);
    const contexts = contextNodes.filter((context) => {
      for (const con of cons) {
        let id = typeof con.id === 'string' ? con.id : con.id.get();
        if (context.info.id.get() === id) return true;
      }
      return false;
      // return context.info.type.get() === groupService.constants.ROOMS_GROUP_CONTEXT;
    });
    const Icontexts = contexts.map((el) => this.Icontext(el));
    const res = await Promise.all(Icontexts);
    this.initDefer.resolve(res);
  }

  getData() {
    return this.initDefer.promise;
  }

  async getDataFilterItem(item) {
    const data = await this.initDefer.promise;
    if (!item) return data;
    const itemNode = FileSystem._objects[item.server_id];
    if (itemNode.getType().get() !== 'geographicFloor') {
      return data;
    }

    const idsAGarder = item.children.map((obj) => obj.id);
    const tmp = [];
    for (const d of data) {
      const cats = [];
      for (const cat of d.categories) {
        const groups = [];
        for (const grp of cat.groups) {
          const rooms = [];
          for (const r of grp.rooms) {
            if (idsAGarder.includes(r.id)) rooms.push(r);
          }
          groups.push({
            rooms,
            id: grp.id,
            name: grp.name,
            color: grp.color,
          });
        }
        cats.push({
          groups,
          id: cat.id,
          name: cat.name,
        });
      }
      tmp.push({
        categories: cats,
        id: d.id,
        name: d.name,
      });
    }

    return tmp;
  }

  async Icontext(context) {
    let catLst = await groupManagerService.getCategories(context.info.id.get());
    let arr = [];
    for (let cat of catLst) {
      arr.push(this.Icategorie(cat));
    }

    return {
      name: context.info.name.get(),
      id: context.info.id.get(),
      categories: await Promise.all(arr),
    };
  }

  async Icategorie(categorie) {
    let grpLst = await groupManagerService.getGroups(categorie.id.get());
    let arr2 = [];
    for (let grp of grpLst) {
      arr2.push(this.Igroup(grp));
    }
    return {
      name: categorie.name.get(),
      id: categorie.id.get(),
      groups: await Promise.all(arr2),
    };
  }

  async Igroup(group) {
    let roomLst = await groupManagerService.getElementsLinkedToGroup(
      group.id.get()
    );
    let arr3 = [];
    for (let room of roomLst) {
      arr3.push(this.Iroom(room));
    }

    if (typeof group.color === 'undefined') {
      const color = this.getRandomColor();
      group.add_attr('color', color);
    }

    return {
      name: group.name.get(),
      id: group.id.get(),
      color: group.color.get(),
      rooms: await Promise.all(arr3),
    };
  }

  getsurface(arr) {
    for (let attribute of arr) {
      if (
        attribute.label.get() === 'surface' ||
        attribute.label.get() === 'area'
      ) {
        return parseFloat(attribute.value.get());
      }
    }
    return 0;
  }

  async Iroom(room) {
    let realnode = SpinalGraphService.getRealNode(room.id.get());
    let attributesLst = await serviceDocumentation.getAllAttributes(realnode);
    let espace = this.getsurface(attributesLst);
    return {
      name: room.name.get(),
      id: room.id.get(),
      surface: espace,
    };
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ///////////////////////////////////////////////////////////
  //                surface  utilities                     //
  ///////////////////////////////////////////////////////////

  getContextSurface(contextObject) {
    let surface = 0;
    for (const category of contextObject.categories) {
      surface += this.getCategoriesSurface(category);
    }

    return surface;
  }

  getCategoriesSurface(categoryObject) {
    let surface = 0;

    for (const group of categoryObject.groups) {
      surface += this.getGroupSurface(group);
    }

    return surface;
  }

  getGroupSurface(groupObject) {
    let surface = 0;
    for (const room of groupObject.rooms) {
      surface += this.getRoomSurface(room);
    }
    return surface;
  }

  getRoomSurface(roomObject) {
    return roomObject.surface ? roomObject.surface : 0;
  }

  ///////////////////////////////////////////////////////////
  //                Rooms Count  utilities                 //
  ///////////////////////////////////////////////////////////

  getContextRoomCount(contextObject) {
    let roomCount = 0;
    for (const category of contextObject.categories) {
      roomCount += this.getCategoriesRoomCount(category);
    }

    return roomCount;
  }

  getCategoriesRoomCount(categoryObject) {
    let roomCount = 0;

    for (const group of categoryObject.groups) {
      roomCount += this.getGroupRoomCount(group);
    }

    return roomCount;
  }

  getGroupRoomCount(groupObject) {
    return groupObject.rooms.length;
  }
}
