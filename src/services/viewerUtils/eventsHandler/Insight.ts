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

import { EventBus } from '../../event';
import { viewerUtils } from '../viewerUtils';

type BimObj = {
  bimFileId: string;
  dbid: number;
  externalId: string;
  id: string;
  name: string;
  type: string;
};

function getOrAddModelIfMissing(array, model): { selection: number[]; model } {
  for (const obj of array) {
    if (obj.model === model) {
      return obj;
    }
  }
  const obj = {
    selection: [],
    model,
  };
  array.push(obj);
  return obj;
}

function sortBIMObjectByModel(
  bimObj: BimObj[]
): { selection: number[]; model }[] {
  const anyWin: any = window;
  let arrayModel = [];

  for (const nodeBIMObject of bimObj) {
    const bimFileId = nodeBIMObject.bimFileId;
    const dbId = nodeBIMObject.dbid;
    const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
    const obj = getOrAddModelIfMissing(arrayModel, model);
    obj.selection.push(dbId);
  }
  return arrayModel;
}

EventBus.$on('insight-isolate', async (data) => {
  /*const item = {
      server_id: data.ids?.[0]?.dbid,
    }*/
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  const lstByModel = sortBIMObjectByModel(data.ids);
  viewerUtils.isolateObjects(lstByModel);
});

EventBus.$on('insight-select', async (data) => {
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  const lstByModel = sortBIMObjectByModel(data.ids);
  viewerUtils.selectObjects(lstByModel);
});

EventBus.$on('insight-focus', async (data) => {
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  const lstByModel = sortBIMObjectByModel(data.ids);
  await viewerUtils.rotateTo('top');
  viewerUtils.fitToView(lstByModel);
});

EventBus.$on('insight-clear-select', async (data) => {
  viewerUtils.clearSelection();
});
