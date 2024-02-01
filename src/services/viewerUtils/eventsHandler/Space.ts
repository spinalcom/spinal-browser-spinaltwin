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

import { EventBus } from '../../event';
import { viewerUtils } from '../viewerUtils';
import { lastColor } from './lastColor';

EventBus.$on('see', async (data: ColorData) => {
  const item = {
    server_id: data.ids?.[0]?.dbid,
    color: data.color,
  };

  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  if (
    lastColor.inputType === 'see' &&
    lastColor.item?.server_id === data.ids?.[0]?.dbid
  ) {
    lastColor.item = null;
    lastColor.zone = null;
    lastColor.inputType = '';
    viewerUtils.restoreColorThemingItems();
  } else {
    viewerUtils.restoreColorThemingItems();
    lastColor.zone = null;
    lastColor.item = item;
    lastColor.inputType = 'see';
    const lstByModel = sortBIMObjectByModel(data.ids);
    for (const { selection, model } of lstByModel) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
});

EventBus.$on('seeAll', async (datas: ColorData[]) => {
  if (datas.length === 0) return;
  await viewerUtils.waitInitialized();
  const item = {
    server_id: datas[0].id,
    color: datas[0].color,
  };
  viewerUtils.clearSelection();
  if (
    lastColor.inputType === 'seeAll' &&
    lastColor.item &&
    lastColor.item.server_id === datas[0].id
  ) {
    lastColor.inputType = '';
    lastColor.item = null;
    lastColor.zone = null;
    viewerUtils.restoreColorThemingItems();
  } else {
    lastColor.inputType = 'seeAll';
    viewerUtils.restoreColorThemingItems();
    lastColor.zone = null;
    lastColor.item = item;
    const lstByModel = [];
    for (const data of datas) {
      const lstByModelForColor = sortBIMObjectByModel(data.ids);
      for (const { selection, model } of lstByModelForColor) {
        viewerUtils.colorThemingItems(model, data.color, selection);
        for (const dbId of selection) {
          const obj = getOrAddModelIfMissing(lstByModel, model);
          obj.selection.push(dbId);
        }
      }
    }
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
});

type BimObj = {
  bimFileId: string;
  dbid: number;
  externalId: string;
  id: string;
  name: string;
  type: string;
};

type ColorData = {
  id: string;
  color: string;
  ids: BimObj[];
};

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
