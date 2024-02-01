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

import q from 'q';
import {
  SCENE_RELATION_CONTEXT_TYPE,
  SCENE_RELATION_NAME,
} from '../../constants';
export default class BackEndViewer {
  initDefer = q.defer();
  context;

  constructor() {}
  async getContext(graph) {
    const children = await graph.getChildren();
    for (const context of children) {
      if (context.info.type.get() === SCENE_RELATION_CONTEXT_TYPE) {
        return (this.context = context);
      }
    }
  }
  async init(graph) {
    await this.getContext(graph);
    const scenes = this.context.getChildren(SCENE_RELATION_NAME);
    this.initDefer.resolve(scenes);
  }
  async getScenes() {
    const scenes = await this.initDefer.promise;
    return scenes;
  }
  // getParts(sceneModel) {
  //   return sceneModel.getChildren([PART_RELATION_NAME]);
  // }
  // getSVF(element, nodeId, name) {
  //   return element.load()
  //     .then(elem => {
  //       return spinalIO.loadPtr(elem.currentVersion);
  //     })
  //     .then(elem => {
  //       if (elem.hasOwnProperty('items')) {
  //         for (let i = 0; i < elem.items.length; i++) {
  //           if (elem.items[i].path.get().indexOf('svf') !== -1) {
  //             return {
  //               version: elem.versionId,
  //               path: elem.items[i].path.get(),
  //               id: nodeId,
  //               name,
  //               thumbnail: elem.items[i].thumbnail ? elem.items[i].thumbnail.get() : elem.items[i].path.get() + '.png'
  //             };
  //           }
  //         }
  //       }
  //       return undefined;
  //     }
  //     );
  // }

  // loadBimFile(viewerManager, bimfIle, scene, options = []) {
  //   return new Promise(resolve => {
  //     this.getSVF(bimfIle.element, bimfIle.info.id, bimfIle.info.name)
  //       .then((svfVersionFile) => {
  //         let option;
  //         for (let i = 0; i < options.length; i++) {
  //           if (options[i].urn.get().includes(svfVersionFile.path) !== -1) {
  //             option = options[i].get();
  //             break;
  //           }
  //         }
  //         if (typeof option === "undefined") { option = {}; }
  //         else if (option.hasOwnProperty('dbIds') && option.dbIds.length > 0) { option = { ids: option.dbIds }; }
  //         const path = window.location.origin + svfVersionFile.path;
  //         if (option.hasOwnProperty('loadOption') && option.loadOption.hasOwnProperty('globalOffset')) {
  //           option['globalOffset'] = option.loadOption.globalOffset;
  //         }
  //         viewerManager.loadModel(path, option)
  //           .then(model => {
  //             // this.bimObjectService
  //             //   .addModel(bimfIle.id, model, svfVersionFile.version, scene, bimfIle.name);
  //             resolve({ bimFileId: bimfIle.id, model });
  //           });
  //       });
  //   });
  // }

  // async loadScene(sceneModel, viewerManager) {
  //   const option = typeof sceneModel.info.options !== "undefined" ? sceneModel.info.options : [];
  //   const parts = await this.getParts(sceneModel);
  //   const prom = parts.map((part) => {
  //     return this.loadBimFile(viewerManager, part, sceneModel, option);
  //   });
  //   return Promise.all(prom);
  // }
}
