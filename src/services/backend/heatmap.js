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

import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service';
import { FileSystem } from 'spinal-core-connectorjs_type';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { spinalControlPointService } from 'spinal-env-viewer-plugin-control-endpoint-service';
import { BIM_OBJECT_TYPE } from 'spinal-env-viewer-plugin-forge/dist/Constants';
import tinygradient from 'tinygradient';
import q from 'q';
import {
  EQUIPMENT_RELATION,
  EQUIPMENT_TYPE,
  ROOM_TYPE,
  FLOOR_TYPE,
  ROOM_RELATION,
  FLOOR_RELATION,
  BUILDING_TYPE,
  REFERENCE_RELATION,
} from 'spinal-env-viewer-context-geographic-service/build/constants';

export default class Heatmap {
  constructor() {
    this.allContext;

    this.initDefer = q.defer();
  }

  async init(graph) {
    //"SpinalControlPointGroupContext"
    //ROOM_TYPE
    await SpinalGraphService.waitForInitialization();
    let contextNodes = await graph.getChildren('hasContext');
    const cons = await groupManagerService.getGroupContexts(
      'SpinalControlPointGroupContext'
    );
    const contexts = contextNodes.filter((context) => {
      for (const con of cons) {
        let id = typeof con.id === 'string' ? con.id : con.id.get();
        if (context.info.id.get() === id) return true;
      }
      return false;
    });

    const Icontexts = contexts.map((el) => this.Icontext(el));

    const res = await Promise.all(Icontexts);
    this.initDefer.resolve(res);
  }

  getData() {
    return this.initDefer.promise;
  }

  async getDataFilterItem(item) {
    const res = [];
    const data = await this.initDefer.promise;
    if (!item) {
      return res;
    }

    const itemNode = FileSystem._objects[item.server_id];
    if (itemNode.getType().get() === ROOM_TYPE) {
      res.push(itemNode.info.id.get());
      const childs = await itemNode.getChildren(EQUIPMENT_RELATION);
      for (const child of childs) {
        res.push(child.info.id.get());
      }
      return res;
    }

    if (itemNode.getType().get() === FLOOR_TYPE) {
      res.push(itemNode.info.id.get());
      const rooms = await itemNode.getChildren(ROOM_RELATION);
      for (const room of rooms) {
        res.push(room.info.id.get());
        const equipments = await room.getChildren(EQUIPMENT_RELATION);
        for (const equipment of equipments) {
          // res.push(equipment.info.id.get());
          if(equipment != undefined){
            res.push(equipment.getId().get());
          }
          
        }
      }
      return res;
    }
    return res;
  }

  timeout(ms) {
    //pass a time in milliseconds to this function
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async Icontext(context) {
    let catLst = await groupManagerService.getCategories(context.info.id.get());
    const contextId = context.info.id.get();
    let arr = [];
    for (let cat of catLst) {
      arr.push(this.Icategorie(cat, contextId));
    }

    return {
      name: context.info.name.get(),
      id: context.info.id.get(),
      _server_id: context.info._server_id,
      categories: await Promise.all(arr),
    };
  }

  async Icategorie(categorie, contextId) {
    let grpLst = await groupManagerService.getGroups(categorie.id.get());
    let arr2 = [];
    for (let grp of grpLst) {
      arr2.push(this.Igroup(grp, contextId));
    }
    return {
      name: categorie.name.get(),
      id: categorie.id.get(),
      groups: await Promise.all(arr2),
    };
  }

  async Igroup(group, contextId) {
    let profilLst = await groupManagerService.getElementsLinkedToGroup(
      group.id.get()
    );
    let arr3 = [];
    for (let profil of profilLst) {
      arr3.push(this.Iprofil(profil, contextId));
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

  async Iprofil(profil, contextId) {
    let realnode = SpinalGraphService.getRealNode(profil.id.get());
    let attributesLst = await serviceDocumentation.getAllAttributes(realnode);
    let espace = this.getsurface(attributesLst);
    let endpointsProfils = await this.getEndpointsProfil(contextId, profil);

    return {
      name: profil.name.get(),
      id: profil.id.get(),
      surface: espace,
      endpointsProfils: endpointsProfils,
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
  async getDataFormatedPersonnalized(id, filters) {
    const elementLinked = await spinalControlPointService.getElementLinked(id);
    const rooms = await groupManagerService.getElementsLinkedToGroup(id);

    const promises = elementLinked.map(async element => {
      const el = element.get();
      const contextId = spinalControlPointService.getContextId(el.id);
      const controlPointProfil = await spinalControlPointService.getControlPointProfil(
        contextId,
        el.id
      );
      el['endpointProfils'] = controlPointProfil.endpoints.get();
      el['rooms'] = await this.formatRoomsPersonnalized(el.id, rooms, filters);
      return el;
    })
    return Promise.all(promises);
  }
  formatRoomsPersonnalized(profilId, rooms, filters) {
    if (filters.length == 0) {
      const promises = rooms.map(async (room) => {
        let obj = room.get();
        obj['bimObjects'] = [];
        obj['endpoints'] = await spinalControlPointService.getEndpointsLinked(obj.id, profilId);
        return obj;
      });
      return Promise.all(promises);
    }
    else {
      const promises = rooms.map(async (room) => {
        if(filters.includes(room.id.get())){
          let obj = room.get();
          obj['bimObjects'] = [];
          obj['endpoints'] = await spinalControlPointService.getEndpointsLinked(obj.id, profilId);
          return obj;
        }
        
      });
      return Promise.all(promises);
    }

  }

  getElementLinkedToProfil(profil, filters) {
    const id = profil.id;
    return spinalControlPointService.loadElementLinked(id).then((result) => {
      const promises = [];

      for (let i = 0; i < result.length; i++) {
        SpinalGraphService._addNode(result[i]);
        const groupId = result[i].getId().get();
        // promises.push(spinalControlPointService.getDataFormated(groupId));
        promises.push(this.getDataFormatedPersonnalized(groupId, filters));
      }
      return Promise.all(promises).then((result) => {
        const profilFound = result.flat().filter((el) => el != undefined && el.id === id);
        if (profilFound.length == 0) return [];
        let prom = [];
        let ids = [];
        for (let i = 0; i < profilFound.length; i++) {
          let tmp = profilFound[i].rooms.map(async (room) => {
            if (room != undefined && !ids.includes(room.id)) {
              ids.push(room.id);
              room.references = await this._getRoomReferences(room.id);
              return room;
            } else return undefined;
          });
          prom = prom.concat(tmp);
        }
        return Promise.all(prom).then((references) => {
          return references.flat();
        });
      });
    });
  }

  getEndpointsProfil(contextId, profil) {
    const id = profil.id.get();
    return spinalControlPointService
      .getControlPointProfil(contextId, id)
      .then((result) => {
        const res = [];
        for (let i = 0; i < result.endpoints.length; i++) {
          res.push(result.endpoints[i].get());
        }

        return res;
      });
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

  ///////////////////////////////////////////////////////////////////////////
  ////                      HEATMAP UTILITIES                      ////
  ///////////////////////////////////////////////////////////////////////////

  getGradientColor(min, average, max) {
    let colorLength = average ? 10 : 2;
    let colors = average
      ? [min.color, average.color, max.color]
      : [min.color, max.color];

    let gradient = tinygradient(colors);

    return gradient.rgb(colorLength);
  }

  getColor(value, minValue, maxValue, gradientColor) {
    if (typeof minValue === 'boolean' && typeof maxValue === 'boolean')
      return value ? gradientColor[1].toHex() : gradientColor[0].toHex();

    if (!isNaN(value)) {
      let index = Math.floor(((value - minValue) * 10) / (maxValue - minValue));

      if (index < 0) {
        index = 0;
      } else if (index >= gradientColor.length) {
        index = gradientColor.length - 1;
      }

      return gradientColor[index].toHex();
    }
    return undefined;
  }

  getEnumGradientColor(liste) {
    return liste.map((el) => ({ value: el.name, color: el.color }));
  }

  getEnumColor(value, liste) {
    const found = liste.find((el) => el.name === value);
    if (found) return found.color;
  }

  _convertHexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  convertColorToVector(argColor) {
    let color = '';
    if (argColor) {
      color = argColor[0] === '#' ? argColor : `#${argColor}`;
    }

    if (color.trim().length == 0) return new THREE.Vector4(1, 0, 0, 0);

    const rgbColor = this._convertHexToRGB(color);

    return rgbColor
      ? new THREE.Vector4(
        rgbColor.r / 255,
        rgbColor.g / 255,
        rgbColor.b / 255,
        0.7
      )
      : new THREE.Vector4(1, 0, 0, 0);
  }

  async _getRoomReferences(roomId) {
    const info = SpinalGraphService.getInfo(roomId);
    let references = [];

    if (info && info.type.get() === BIM_OBJECT_TYPE) {
      references = [info];
    } else if (info && info.type.get() === BUILDING_TYPE) {
      const floors = await SpinalGraphService.getChildren(roomId, [
        FLOOR_RELATION,
      ]);
      for (const floor of floors) {
        let refs = await SpinalGraphService.getChildren(floor.id.get(), [
          REFERENCE_RELATION,
        ]);
        for (const ref of refs) {
          references.push(ref);
        }
        const rooms = await SpinalGraphService.getChildren(floor.id.get(), [
          ROOM_RELATION,
        ]);
        for (const room of rooms) {
          let refs = await SpinalGraphService.getChildren(room.id.get(), [
            'hasReferenceObject.ROOM',
          ]);
          for (const ref of refs) {
            references.push(ref);
          }
        }
      }
      let refs = await SpinalGraphService.getChildren(roomId, [
        REFERENCE_RELATION,
      ]);
      for (const ref of refs) {
        references.push(ref);
      }
      //references = await SpinalGraphService.getChildren(roomId,[REFERENCE_RELATION]);
    } else if (info && info.type.get() === FLOOR_TYPE) {
      const tmp = await SpinalGraphService.getChildren(roomId, [ROOM_RELATION]);
      for (const room of tmp) {
        let refs = await SpinalGraphService.getChildren(room.id.get(), [
          'hasReferenceObject.ROOM',
        ]);
        for (const ref of refs) {
          references.push(ref);
        }
      }
      let refs = await SpinalGraphService.getChildren(roomId, [
        REFERENCE_RELATION,
      ]);
      for (const ref of refs) {
        references.push(ref);
      }
      //references = await SpinalGraphService.getChildren(roomId,[REFERENCE_RELATION]);
    } else {
      references = await SpinalGraphService.getChildren(roomId, [
        'hasReferenceObject.ROOM',
      ]);
    }

    const bims = references.map((el) => el.get());
    const bimMap = new Map();

    for (const bimObject of bims) {
      const bimFileId = bimObject.bimFileId;
      const dbid = bimObject.dbid;

      if (typeof bimMap.get(bimFileId) === 'undefined') {
        bimMap.set(bimFileId, new Set());
      }

      bimMap.get(bimFileId).add(dbid);
    }

    const res = [];

    for (const [key, value] of bimMap.entries()) {
      /*while (!window.spinal.BimObjectService.getModelByBimfile(key)){
        await this.timeout(1000);
      }*/
      res.push({
        model: window.spinal.BimObjectService.getModelByBimfile(key),
        ids: Array.from(value),
      });
    }
    return res;
  }
}
