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

import Vue from 'vue';
// @ts-ignore
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import ElementUI from 'element-ui';
import VTooltip from 'v-tooltip';
import VueMaterial from 'vue-material';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/vue-material.min.css';
import App from './app.vue';
import { router } from './router/router';
import BackendInitializer from './services/BackendInitializer';
import { i18n } from './services/i18n';
import spinalBackend from './services/spinalBackend';
import Ripple from 'vue-ripple-directive';

import 'element-ui/lib/theme-chalk/index.css';
import './app.css';
import './compoments/sidebar/eventSideBar';
import './services/viewerUtils/viewerEventHandle';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.min.css';

import Vuetify from 'vuetify';
// import { vuetifyInit, vuetify } from './plugins/vuetify';
// import SpinalComponents from 'spinal-components';
// import 'spinal-components/dist/spinal-components.css'

// Vue.use(SpinalComponents, {})

// const vuetify = new Vuetify({
//   theme: {
//     themes: {
//       light: {
//         primary: '#14202c', // #E53935
//         secondary: '#14202c', // #FFCDD2
//         accent: '#14202c', // #3F51B5
//       },
//     },
//   },
// });
// Vue.use(Vuetify);

// vuetifyInit(Vue);

// @ts-ignore
window.Autodesk.Viewing.Private.analytics.optOut();

// eslint-disable-next-line vue/multi-word-component-names
// Vue.component('apexchart', VueApexCharts);

Ripple.zIndex = 99999999;
Vue.directive('ripple', Ripple);

Vue.use(ElementUI);
Vue.use(VTooltip);
Vue.use(BootstrapVue);
Vue.use(VueMaterial);
Vue.use(Vuetify);

spinalBackend.init();
BackendInitializer.getInstance().init();

new Vue({
  i18n,
  // vuetify,
  router,
  render: (h) => h(App),
}).$mount('#app');

Vue.config.devtools = true;
