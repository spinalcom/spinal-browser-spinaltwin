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

import { EventBus } from '../../services/event';
import { viewerUtils } from '../../services/viewerUtils/viewerUtils';
import { spinalBackEnd } from '../../services/spinalBackend';
var debounce = require('lodash.debounce');

const sidebarMouseoverItemDebounce = debounce(sidebarMouseoverItem, 400);
const sidebarSelectedItemDebounce = debounce(sidebarSelectedItem, 400);
const sidebarHomeSelectDebounce = debounce(sidebarHomeSelect, 500);

EventBus.$on('sidebar-selected-item', async (item) => {
  await viewerUtils.waitInitialized();
  // return sidebarSelectedItemDebounce(item);
  return sidebarSelectedItem(item);
});
EventBus.$on('sidebar-mouseover-item', async (item) => {
  await viewerUtils.waitInitialized();
  return sidebarMouseoverItemDebounce(item);
});
EventBus.$on('sidebar-mouseover-item-without-debounce', async (item) => {
  await viewerUtils.waitInitialized();
  return sidebarMouseoverItem(item);
});

EventBus.$on('sidebar-homeSelect', async (item) => {
  await viewerUtils.waitInitialized();
  return sidebarHomeSelectDebounce(item);
});

async function sidebarHomeSelect(item) {
  viewerUtils.clearSelection();
  // const face = 'top,front';
  const face = 'top';

  if (!item) {
    // const face = 'front,top,right';
    viewerUtils.showAll();
    viewerUtils.rotateTo(face);
    // await viewerUtils.rotateTo(face);
    // await viewerUtils.fitToView();

    // viewerUtils.fitToView().then(()=> {
    //   setTimeout(()=> {
    //     viewerUtils.rotateTo(face);
    //     viewerUtils.clearSelection();
    //   }, 100);
    // });
  } else {
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    viewerUtils.isolateObjects(lstByModel);
    viewerUtils.rotateTo(face);
    // await viewerUtils.rotateTo(face);
    // await viewerUtils.rotateTo('front,top,right');
    // await viewerUtils.fitToView(lstByModel);

    // viewerUtils.fitToView(lstByModel).then(()=> {
    //   setTimeout(()=> {
    //     viewerUtils.rotateTo(face);
    //     viewerUtils.clearSelection();
    //   }, 100);
    // });
  }
  viewerUtils.clearSelection();
}

async function sidebarMouseoverItem(item) {
  if (item) {
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    // viewerUtils.selectObjects(lstByModel);
  }
}
async function sidebarSelectedItem(item) {
  if (item) {
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
}
