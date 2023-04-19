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

import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

const AppList = () => import('./AppList/AppList.vue');
// const TicketCenter = () => import('./TicketCenter/TicketCenter.vue');
const InsightCenter = () => import('./InsightCenter/InsightCenter.vue');
const SpaceCenter = () => import('./Space Center/spacecenter.vue');
const SpaceCenterGestion = () =>
  import('../compoments/space/component/categoryLstVue.vue');
// const DataRoom = () => import("./DataRoom/DataRoom.vue")
const EquipmentApp = () => import('./EquipmentApp/TheEquipmentApp.vue');
const DataApp = () => import('./DataApp/TheDataApp.vue');
const TicketApp = () => import('./TicketApp/TheTicketApp.vue');
const AlarmApp = () => import('./AlarmCenter/index.vue');
const SpaceApp = () => import('./SpaceApp/TheSpaceApp.vue');


export const routes = [
  { path: '*', redirect: { name: 'AppList' } },
  { path: '/AppList', name: 'AppList', component: AppList },
  // { path: '/DataRoom', name: 'Data Room', component: DataRoom },
  // { path: '/TicketCenter', name: 'TicketCenter', component: TicketCenter },
  { path: '/DataApp', name: 'DataApp', component: DataApp },
  { path: '/InsightCenter', name: 'InsightCenter', component: InsightCenter },
  // { path: '/Spacecenter', name: 'SpaceCenter', component: SpaceCenter },
  { path: '/EquipmentApp', name: 'EquipmentApp', component: EquipmentApp },
  { path: '/TicketApp', name: 'TicketApp', component: TicketApp },
  { path: '/AlarmApp', name: 'AlarmApp', component: AlarmApp },
  { path: '/SpaceApp', name: 'SpaceApp', component: SpaceApp },

];


// export const routes = [
//   { path: '*', redirect: { name: 'ApplicationList' } },
//   { path: '/AppList', name: 'ApplicationList', component: AppList },
//   // { path: '/DataRoom', name: 'Data Room', component: DataRoom },
//   // { path: '/TicketCenter', name: 'TicketCenter', component: TicketCenter },
//   { path: '/DataRoom', name: 'Data room', component: DataApp },
//   { path: '/InsightCenter', name: 'Insights', component: InsightCenter },
//   // { path: '/Spacecenter', name: 'SpaceCenter', component: SpaceCenter },
//   { path: '/Equipments', name: 'Equipments', component: EquipmentApp },
//   { path: '/Tickets', name: 'Tickets', component: TicketApp },
//   { path: '/Alarms', name: 'Alarms', component: AlarmApp },
//   { path: '/Spaces', name: 'Spaces', component: SpaceApp },

// ];
const realroutes = [
  ...routes,
  {
    path: '/Spacecenter/Gestion',
    name: 'gestion',
    component: SpaceCenterGestion,
  },
];
export const router = new VueRouter({
  routes: realroutes,
});

router.beforeResolve(function (to, from, next) {
  console.log(router);
  console.log(document)
  document.title = `SpinalTwin - ${to.name}`;
  next();
});
