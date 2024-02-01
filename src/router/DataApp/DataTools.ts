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

import { SpinalNode } from 'spinal-model-graph';
import { FileSystem } from 'spinal-core-connectorjs_type';
import { ROOM_TYPE } from '../../constants';
import type { SpinalAttribute } from 'spinal-models-documentation';
import type { AppItem } from '../../services/backend/AppItem';
import AttributeService from 'spinal-env-viewer-plugin-documentation-service';


async function getSurfaceFromNode(node: AppItem, appName: string): Promise<string> {

  if (appName == "DataApp") {
    let realNode = <SpinalNode<any>>FileSystem._objects[node.serverId];
    if (realNode == undefined) {
      return "N.C";
    }
    else {
      let surface = await AttributeService.findOneAttributeInCategory(realNode, "Spatial", "area");
      if (surface != -1) {
        return parseFloat(surface.value.get().toString()).toFixed(2);
      }
      else return "N.C";
    }
  }
  else {
    const surface = await findSurface(node);
    return surface.toFixed(2);
  }






}

async function findSurface(node: AppItem): Promise<number> {
  let area = 0;
  const info = <SpinalNode<any>>FileSystem._objects[node.serverId];

  if (info === undefined) {
    return 0;
  }
  if (info.getType().get() === ROOM_TYPE) {
    let attr = await getAttrByKey(info, 'area');
    return parseFloat(attr?.value.get() ?? 0);
  }
  if (node.children === undefined) {
    return 0;
  }
  for (let [_, childList] of node.children) {
    for (let child of childList) {
      area += await findSurface(child);
    }
  }
  return area;
}

async function getAttrByKey(
  node: SpinalNode<any>,
  key: string
): Promise<SpinalAttribute | undefined> {
  if (node && node instanceof SpinalNode) {
    const cats = await node.getChildren('hasCategoryAttributes');
    for (const cat of cats) {
      const attrLst: SpinalAttribute = await cat.getElement();
      for (let idx = 0; idx < attrLst.length; idx++) {
        const attr = attrLst[idx];
        if (attr.label.get() === key) {
          return attr;
        }
      }
    }
  }
}

module.exports = {
  getSurfaceFromNode: getSurfaceFromNode,
};
