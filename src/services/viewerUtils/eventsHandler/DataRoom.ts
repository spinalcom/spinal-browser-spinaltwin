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
import { spinalBackEnd } from '../../spinalBackend';
import { viewerUtils } from '../viewerUtils';
import { lastColor } from './lastColor';

EventBus.$on('data-room-color-item', async (item) => {
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  if (
    lastColor.item ||
    (lastColor.zone && lastColor.zone.server_id === item.server_id)
  ) {
    lastColor.item = null;
    lastColor.zone = null;
    viewerUtils.restoreColorThemingItems();
  } else {
    viewerUtils.restoreColorThemingItems();
    lastColor.zone = null;
    lastColor.item = item;
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    for (const { selection, model } of lstByModel) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
});

EventBus.$on('data-room-select-item', async (item) => {
  await viewerUtils.waitInitialized();
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
  viewerUtils.selectObjects(lstByModel);
});

EventBus.$on('data-room-color-all', async (items, zone) => {
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
  if (
    lastColor.item ||
    (lastColor.zone && lastColor.zone.server_id === zone.server_id)
  ) {
    lastColor.item = null;
    lastColor.zone = null;
    viewerUtils.restoreColorThemingItems();
  } else {
    viewerUtils.restoreColorThemingItems();
    lastColor.zone = zone;
    lastColor.item = null;
    for (const item of items) {
      const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(
        item,
        true
      );
      for (const { selection, model } of lstByModel) {
        viewerUtils.colorThemingItems(model, item.color, selection);
      }
    }
    const zoneLstByModel = await spinalBackEnd.spatialBack.getLstByModel(zone);
    viewerUtils.isolateObjects(zoneLstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(zoneLstByModel);
  }
});
