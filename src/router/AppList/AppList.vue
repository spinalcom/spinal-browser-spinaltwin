<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="applist-main-container">
    <div class="app-list-header">
      <!-- Toutes les Applications -->
      .
      <el-button icon="el-icon-s-grid" circle @click="openDrawer"></el-button>
    </div>

    <!-- <img class="image-logo-spinaltwin" :src="logo"/> -->
    <div class="applist-container spinal-scrollbar">
      <router-link
        elevation="10"
        v-for="route in routes"
        :key="route.path"
        v-ripple
        :index="route.name"
        :to="route.path"
        class="router-link-btn"
      >
        <!-- <div
      
        v-for="route in routes"
        :key="route.path"
        v-ripple
        :index="route.name"
        :to="route.path"
        class="router-link-btn"> -->

        <applicationCard :data="applySettings(route.name)"></applicationCard>
        <!-- </div> -->

        <!-- </div> -->
        <!-- <el-card :body-style="{ padding: '0px' }" shadow="always">
          <div class="app-item-text">
            <span>{{ $t('Routes.' + route.name) }}</span>
          </div>
        </el-card> -->
      </router-link>
    </div>
  </div>
</template>

<script>
import { routesFromApi } from '../router';
import { EventBus } from '../../services/event';
import applicationCard from './applicationCard.vue';
import 'material-design-icons-iconfont';
// const logo = require("../../assets/imgs/spinaltwin_logo_RVB.png")

export default {
  name: 'AppList',
  components: {
    applicationCard,
  },
  data() {
    return {
      routes: [],
      // logo: require("../../assets/imgs/spinaltwin_logo_RVB.png"),
      logo: require('../../assets/imgs/spinaltwin_logo_suite.png'),
      DataApp: {
        // icon: require("../../assets/imgs/background/Usine2.jpg"),
        icon: 'mdi-city',
        name: 'Description',
        description: 'Explorer le bâtiment',
        // tags: ["3D"],
        tags: [
          { label: '3D', color: '#6699cc' },
          { label: 'Description', color: '#FFA400' },
        ],
      },
      InsightCenter: {
        // icon: 'show_chart',
        icon: 'mdi-chart-bar',
        name: 'INSIGHTS',
        description: "Visualiser l'activité",
        // tags: ["3D", "Heatmap"],
        tags: [
          { label: '3D', color: '#6699cc' },
          { label: 'Heatmap', color: '#6AA0AD' },
        ],
      },
      EquipmentApp: {
        icon: 'mdi-city',
        name: 'ÉQUIPEMENTS',
        description: 'Inspecter les équipements',
        // tags: ["3D"],
        tags: [{ label: '3D', color: '#6699cc' }],
      },
      TicketApp: {
        icon: 'mdi-wrench',
        name: 'TICKETS',
        description: 'Gérer les tickets',
        // tags: ["3D"],
        tags: [
          { label: '3D', color: '#6699cc' },
          { label: 'Ticket', color: '#6AA0AD' },
        ],
      },
      AlarmApp: {
        icon: 'mdi-alarm-light',
        name: 'ALARMES',
        description: 'Gérer les alarmes',
        // tags: ["3D"],
        tags: [
          { label: '3D', color: '#6699cc' },
          { label: 'Alarmes', color: '#6AA0AD' },
        ],
      },
      SpaceApp: {
        icon: 'mdi-view-dashboard',
        name: 'SPACES',
        description: 'Inspecter les espaces',
        // tags: ["3D"],
        tags: [
          { label: '3D', color: '#6699cc' },
          { label: 'Espaces', color: '#6AA0AD' },
        ],
      },

      // dataroom: {
      //   icon: "mdi-email",
      //   name: "test",
      //   description: "bonjours je suis une dexfirption",
      //   tags: "3D"
      // }
      // test: {
      //   icon: "mdi-email",
      //   name: "test",
      //   description: "bonjours je suis une dexfirption",
      //   tags: "3D"
      // }
    };
  },
  // computed: {
  //   routes() {
  //     return routesAuthorized.filter(
  //       (e) => !e.redirect && this.$route.name !== e.name
  //     );
  //   },
  // },
  async mounted() {
    const { routesAuthorized } = await routesFromApi;
    this.routes = routesAuthorized.filter((e) => !e.redirect);
  },
  methods: {
    menuSelect(index) {
      if (this.$route.name !== index) {
        this.$router.push({
          name: index,
        });
      }
    },
    openDrawer() {
      EventBus.$emit('open-drawer');
    },
    applySettings(name) {
      // this[name].name = name;
      return this[name];
    },
  },
};
</script>

<style scoped>
.applist-main-container {
  background-color: #fdfdfd;
  padding: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: -webkit-center;
}
.applist-main-container > * {
  margin: 5px;
  position: relative;
  background-color: white;
}
.app-list-header {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.router-link-btn {
  text-decoration-color: unset;
  text-decoration-line: unset;
  min-width: 40%;
}

.applist-container {
  max-height: 80vh;
  /* max-height: 60%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around; */
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  position: relative;
}
.applist-container > * {
  width: 40%;
  align-self: center;
  /* flex-grow: 1; */
  cursor: pointer;
}
/* .applist-container.spinal-scroll-bar{
  display: flex;
  flex-direction: column;
  max-height: 60%;
} */
.applist-container > * > * {
  background-color: #dcdfe6;
  height: 100px;
  color: black;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.applist-container > *:hover > * {
  background-color: #6290c8;
}

.app-item-text {
  padding: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 992px) {
  .applist-container > * {
    width: 47%;
  }
}
@media screen and (max-width: 567px) {
  .applist-container > * {
    width: 100%;
  }
}
.app-item-image-container {
  height: 20vmin;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.app-item-image {
  align-self: center;
  width: 100%;
  height: 20vmin;
  background-color: #3646b1;
  background-image: radial-gradient(circle at bottom, #3646b1, #1d3461);
}
.image-logo-spinaltwin {
  max-height: 30vh;
}
</style>
