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

import VueRouter, { RouteConfig } from 'vue-router';
import Vue from 'vue';
import axios from 'axios';
import { USE_REMOTE_CONNECT } from '../constants';

Vue.use(VueRouter);

const AppList = () => import('./AppList/AppList.vue');
const InsightCenter = () => import('./InsightCenter/InsightCenter.vue');
const SpaceCenterGestion = () =>
  import('../compoments/space/component/categoryLstVue.vue');
const EquipmentApp = () => import('./EquipmentApp/TheEquipmentApp.vue');
const DataApp = () => import('./DataApp/TheDataApp.vue');
const TicketApp = () => import('./TicketApp/TheTicketApp.vue');
const AlarmApp = () => import('./AlarmCenter/index.vue');
const SpaceApp = () => import('./SpaceApp/TheSpaceApp.vue');

const ApplistRoute = { path: '/AppList', name: 'AppList', component: AppList };
const routes: RouteConfig[] = [
  { path: '*', redirect: { name: 'AppList' } },
  ApplistRoute,
];
const appRoutes: RouteConfig[] = [
  { path: '/DataApp', name: 'DataApp', component: DataApp },
  { path: '/InsightCenter', name: 'InsightCenter', component: InsightCenter },
  { path: '/EquipmentApp', name: 'EquipmentApp', component: EquipmentApp },
  { path: '/TicketApp', name: 'TicketApp', component: TicketApp },
  { path: '/AlarmApp', name: 'AlarmApp', component: AlarmApp },
  { path: '/SpaceApp', name: 'SpaceApp', component: SpaceApp },
];

const realroutes = [
  ...routes,
  ...appRoutes,
  {
    path: '/Spacecenter/Gestion',
    name: 'gestion',
    component: SpaceCenterGestion,
  },
];

export const routesFromApi = getAuthrizedRoute();

export const router = new VueRouter({
  routes: realroutes,
});

router.beforeResolve(async function (to, from, next) {
  const routes = await routesFromApi;
  if (routes.routesDrawer.find((route) => route.name === to.name)) {
    document.title = `SpinalTwin - ${to.name}`;
    next();
  } else {
    next(ApplistRoute);
  }
});
export interface IProfileData {
  [key: string]: any;
  apps?: IApp[];
  apis?;
  contexts?: { [key: string]: any };
}
export interface IApp {
  name: string;
  icon: string;
  description: string;
  tags: string[];
  categoryName: string;
  groupName: string;
  hasViewer?: boolean;
  documentationLink?: string;
  packageName?: string;
  isExternalApp?: boolean;
  link?: string;
  [key: string]: any;
}
async function getAuthrizedRoute() {
  if (USE_REMOTE_CONNECT === true) {
    const routesAuthorized: RouteConfig[] = [];
    const routesDrawer: RouteConfig[] = [ApplistRoute];
    const token = localStorage.getItem('tokenKey');
    if (!token) return { routesAuthorized, routesDrawer };

    const resp = await axios.get<IProfileData>(
      '/api/v1/user_profile/get_profile',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (resp.data) {
      const profileData = resp.data;
      for (const element of profileData.apps!) {
        realroutes.map((elt: any) => {
          if (element.name === elt.name) {
            routesAuthorized.push(elt);
            routesDrawer.push(elt);
          }
        });
      }
    }

    return { routesAuthorized, routesDrawer };
  } else {
    return {
      routesAuthorized: appRoutes,
      routesDrawer: [ApplistRoute, ...appRoutes],
    };
  }
}
