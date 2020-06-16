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
import Vue from "vue";

Vue.use(VueRouter);

const AppList = () => import('./AppList/AppList.vue');
const OperationCenter = () => import('./OperationCenter/OperationCenter.vue');
const MaintenanceBookTicket = () => import('./MaintenanceBookTicket/MaintenanceBookTicket.vue');
const MaintenanceBookTicketConsult = () => import('./MaintenanceBookTicket/MaintenanceBookTicketConsult.vue');

export const routes = [
  { path: '*', redirect: { name: 'App List' } },
  { path: '/AppList', name: 'App List', component: AppList },
  { path: '/OperationCenter', name: 'Operation Center', component: OperationCenter },
  { path: '/MaintenanceBook/ticket', name: 'Maintenance Book Ticket', component: MaintenanceBookTicket },
];

const realRoute = [
  { path: '/MaintenanceBook/ticket/consult', name: 'Maintenance Book Ticket consult', component: MaintenanceBookTicketConsult },
  ...routes,

]

export const router = new VueRouter({
  routes: realRoute
});

router.beforeResolve(function (to, from, next) {
  document.title = `Spinal Twin - ${to.name}`
  next()
})
