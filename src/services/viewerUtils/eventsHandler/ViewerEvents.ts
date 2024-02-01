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

import { EventBus } from '../../event';
import { spinalBackEnd } from '../../spinalBackend';
import { viewerUtils } from '../viewerUtils';

EventBus.$on('viewer-zoom', async (root, relation) => {
  await viewerUtils.waitInitialized();
  const items = await spinalBackEnd.spatialBack.getLstByModelAndRelation(
    { server_id: root.serverId },
    relation
  );
  await viewerUtils.fitToView(items);
});

EventBus.$on('viewer-reset-isolate', async () => {
  await viewerUtils.waitInitialized();
  viewerUtils.showAll();
});

EventBus.$on('viewer-isolate', async (items, relation) => {
  await viewerUtils.waitInitialized();
  viewerUtils.showAll();
  let list: {
    selection: number[];
    model: any;
  }[] = [];
  await Promise.all(
    items.map(async (item) => {
      const test = await spinalBackEnd.spatialBack.getLstByModelAndRelation(
        { server_id: item.serverId },
        relation,
        true
      );
      list.push(...test);
    })
  );
  viewerUtils.isolateObjects(list);
});

EventBus.$on('viewer-reset-select', async () => {
  await viewerUtils.waitInitialized();
  viewerUtils.clearSelection();
});

EventBus.$on('viewer-select', async (root, relation) => {
  await viewerUtils.waitInitialized();
  const items = await spinalBackEnd.spatialBack.getLstByModelAndRelation(
    { server_id: root.serverId },
    relation
  );
  viewerUtils.selectObjects(items);
});

EventBus.$on('viewer-reset-color', async () => {
  await viewerUtils.waitInitialized();
  viewerUtils.restoreColorThemingItems();
});

EventBus.$on('viewer-color', async (items, relation) => {
  await viewerUtils.waitInitialized();
  viewerUtils.restoreColorThemingItems();
  items.map(async (item) => {
    const list = await spinalBackEnd.spatialBack.getLstByModelAndRelation(
      { server_id: item.serverId },
      relation,
      true
    );
    for (const { selection, model } of list) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
  });
});
