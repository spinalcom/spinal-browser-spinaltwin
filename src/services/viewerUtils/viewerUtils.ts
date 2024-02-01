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
import { EventBus } from "../event";
type RotateToFace =
  | 'top'
  | 'front'
  | 'right'
  | 'left'
  | 'back'
  | 'bottom'
  | 'top,front'
  | 'top right'
  | 'top,left'
  | 'top,back'
  | 'bottom,front'
  | 'bottom,right'
  | 'bottom,left'
  | 'bottom,back'
  | 'left,front'
  | 'front,right'
  | 'right,back'
  | 'back,left'
  | 'front,top,right'
  | 'back,top,right'
  | 'front,top,left'
  | 'back,top,left'
  | 'front,bottom,right'
  | 'back,bottom,right'
  | 'front,bottom,left'
  | 'back,bottom,left';

export class ViewerUtils {
  elementColored: Set<{ model; dbIds: number[] }> = new Set();
  restoreColorMaterialBinded: () => void;
  materials = {};
  // Map<Model, Map<colorString, Set<dbIdString > > >
  modelMap: Map<any, Map<string, Set<number>>> = new Map();
  initialized = q.defer();
  viewer;
  cube;

  constructor() {
    this.restoreColorMaterialBinded = this._restoreColorMaterial.bind(this);
  }
  initViewer(viewer) {
    this.viewer = viewer;

    viewer.loadExtension('Autodesk.ViewCubeUi').then((cube) => {
      this.cube = cube;
      this.initialized.resolve();
    });

    // this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (e)=> {
    //   EventBus.$emit('Autodesk.Viewing.SELECTION_CHANGED_EVENT', e);
    // })
    this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, (e)=> {
      if(e.selections.length !=0){
        EventBus.$emit('Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT', e);
      }
      
    })
    // viewer.toolbar.container.style.display = "none"; // MASQUER DE LA TOOLBAR FORGE

    // for (let key in Autodesk.Viewing) {
    //   if (key.endsWith("_EVENT")) {
    //       (function (eventName) {
    //         viewer.addEventListener(
    //           Autodesk.Viewing[eventName],
    //           function (event) {
    //           }
    //         );
    //       })(key);
    //   }
    // }
  }

  waitLoadModels(viewer): Promise<void> {
    let nbOfModels = Object.keys(
      spinal.SpinalForgeViewer.viewerManager.models
    ).length;
    return new Promise((resolve) => {
      const fn = (e) => {
        nbOfModels -= 1;
        if (nbOfModels <= 1) {
          viewer.removeEventListener(
            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            fn
          );
          resolve();
        }
      };
      viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, fn);
    });
  }

  /**
   * @returns Promise<void>
   * @memberof ViewerUtils
   */
  waitInitialized() {
    return this.initialized.promise;
  }

  /**
   * @param {RotateToFace} face - "top", 'front', "right", "left", "back", 'bottom',
  "top,front", "top right", "top,left", "top,back",
  "bottom,front", "bottom,right", "bottom,left", "bottom,back",
  "left,front", "front,right", "right,back", "back,left",
  "front,top,right", "back,top,right", "front,top,left",
  "back,top,left", "front,bottom,right", "back,bottom,right",
  "front,bottom,left", "back,bottom,left"
   * @returns Promise<void>
   * @memberof ViewerUtils
   */
  async rotateTo(face: RotateToFace) {
    if (!this.viewer) return;
    return this.cube.setViewCube(face);
  }

  setCubeVisible(value: boolean) {
    if (!this.viewer) return;
    return this.cube.setVisible(value);
  }

  /**
   * @param {number[] | { model, selection: number[] }[] } [selections]
   * @memberof ViewerUtils
   * @returns Promise<void>
   */
  async fitToView(selections?: number[] | { model; selection: number[] }[]) {
    if (!this.viewer) return;
    this.viewer.fitToView(selections);
  }
  /**
   * @memberof ViewerUtils
   */
  clearSelection() {
    if (!this.viewer) return;
    this.viewer.clearSelection();
  }
  /**
   * clear then select
   * @param {Object[]} lstByModel
   * @param {*} lstByModel[].model - the 3d model instance.
   * @param {number[]} lstByModel[].selection - array of dbid.
   * @memberof ViewerUtils
   */
  async selectObjects(lstByModel) {
    if (!this.viewer) return;
    this.clearSelection();
    for (const { model, selection } of lstByModel) {
      model.selector.setSelection(selection, model, 'selectOnly');
    }
  }
  /**
   * @param {Object[]} lstByModel
   * @param {*} lstByModel[].model - the 3d model instance.
   * @param {number[]} lstByModel[].selection - array of dbid.
   * @memberof ViewerUtils
   */
  isolateObjects(lstByModel) {
    if (!this.viewer) return;
    // @ts-ignore
    for (const key in spinal.SpinalForgeViewer.viewerManager.models) {
      let found = false;
      for (const { model, selection } of lstByModel) {
        if (model.id == key) {
          found = true;
          if (selection.length > 0) {
            this.viewer.isolate(selection, model);
          } else {
            model.getObjectTree((tree) => {
              let dbidRoot = tree.nodeAccess.dbIdToIndex[model.getRootId()];
              this.viewer.isolate([dbidRoot], model);
            });
          }
          continue;
        }
      }
      if (found === false) {
        // @ts-ignore
        const model = spinal.SpinalForgeViewer.viewerManager.models[key];
        this.viewer.hide([1], model);
      }
    }
  }

  /**
   * @memberof ViewerUtils
   */
  showAll() {
    if (!this.viewer) return;
    this.viewer.showAll();
  }

  convertHewToRGB(hex): { r: number; g: number; b: number } {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  }

  colorThemingItems(model, color: string, dbIds: number[]) {
    this.elementColored.add({ model, dbIds });
    const _color = this.convertHewToRGB(color);
    dbIds.forEach((dbId) => {
      model.setThemingColor(
        dbId,
        new window.THREE.Vector4(
          _color.r / 255,
          _color.g / 255,
          _color.b / 255,
          0.7
        ),
        true
      );
    });
  }
  restoreColorThemingItems() {
    for (const { model, dbIds } of this.elementColored) {
      for (const dbid of dbIds) {
        model.setThemingColor(dbid, new window.THREE.Vector4(0, 0, 0, 0), true);
      }
    }
    this.elementColored.clear();
    this.viewer.impl.invalidate(true, true, true);
  }

  /**
   * color in a overlay then remove automatically color after an user "click"
   * @param {{model, color: string, dbId: number}[]} items
   * @memberof ViewerUtils
   */
  colorItems(items: { model; color: string; dbId: number }[]) {
    if (!this.viewer) return;
    for (const item of items) {
      this._addTobDIdColor(item.model, item.dbId, item.color);
    }
    this._setColorMaterial();
    window.addEventListener('click', this.restoreColorMaterialBinded, true);
  }

  /**
   * @param {string} h string color. e.g "#ff00ff"
   * @returns {string}
   * @memberof ViewerUtils
   */
  _cutHex(h: string) {
    return h.charAt(0) == '#' ? h.substring(1, 7) : h;
  }
  /**
   * @param {string} color
   * @param {string} id
   * @returns
   * @memberof ViewerUtils
   */
  _addMaterial(color: string, id: string): THREE.MeshPhongMaterial {
    this.materials[id] = new window.THREE.MeshPhongMaterial({ color });

    this.viewer.impl.createOverlayScene(
      id,
      this.materials[id],
      this.materials[id]
    );
    return this.materials[id];
  }

  /**
   * @private
   * @memberof ViewerUtils
   */
  _restoreColorMaterial() {
    window.removeEventListener('click', this.restoreColorMaterialBinded, true);
    for (const [model, colorSet] of this.modelMap) {
      for (const [, setDbId] of colorSet) {
        for (const dbId of setDbId) {
          const id = `${model.id}-${dbId}`;
          var it = model.getData().instanceTree;
          if (this.materials[id]) delete this.materials[id];
          it.enumNodeFragments(
            dbId,
            (fragId) => {
              var renderProxy = this.viewer.impl.getRenderProxy(model, fragId);
              if (renderProxy[id]) {
                this.viewer.impl.clearOverlay(id);
                delete renderProxy[id];
                this.viewer.impl.invalidate(true);
              }
            },
            true
          );
        }
      }
    }
    this.modelMap.clear();
  }

  /**
   * @private
   * @memberof ViewerUtils
   */
  _setColorMaterial() {
    for (const [model, colorSet] of this.modelMap) {
      for (const [color, setDbId] of colorSet) {
        for (const dbId of setDbId) {
          const id = `${model.id}-${dbId}`;
          if (this.materials[id]) {
            this.materials[id].color.setHex(parseInt(this._cutHex(color), 16));
            this.viewer.impl.invalidate(false, false, true);
          } else {
            var material = this._addMaterial(color, id);
            let it = model.getData().instanceTree;
            it.enumNodeFragments(
              dbId,
              (fragId) => {
                var renderProxy = this.viewer.impl.getRenderProxy(
                  model,
                  fragId
                );
                renderProxy[id] = new window.THREE.Mesh(
                  renderProxy.geometry,
                  material
                );
                renderProxy[id].matrix.copy(renderProxy.matrixWorld);
                renderProxy[id].matrixWorldNeedsUpdate = true;
                renderProxy[id].matrixAutoUpdate = false;
                renderProxy[id].frustumCulled = false;
                this.viewer.impl.addOverlay(id, renderProxy[id]);
                this.viewer.impl.invalidate(true);
              },
              false
            );
          }
        }
      }
    }
  }

  /**
   * @param {*} model
   * @param {number} dbId
   * @param {string} color
   * @memberof ViewerUtils
   */
  _addTobDIdColor(model, dbId, color) {
    let mapColor, setDbId;
    if (!this.modelMap.has(model)) {
      mapColor = new Map();
      this.modelMap.set(model, mapColor);
    } else {
      mapColor = this.modelMap.get(model);
    }
    if (!mapColor.has(color)) {
      setDbId = new Set();
      mapColor.set(color, setDbId);
    } else {
      setDbId = mapColor.get(color);
    }
    setDbId.add(dbId);
  }
}
export const viewerUtils = new ViewerUtils();
