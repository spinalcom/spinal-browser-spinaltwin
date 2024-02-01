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
  <div class="spacecon">
    <div class="spinal-breadcrumb">
      <el-breadcrumb class="spinal-breadcrumb-item" separator=">">
        <el-breadcrumb-item>
          <a
            @click="ResetBreadCrumb()"
            :style="{
              'letter-spacing': '1.1px',
              'font-size': '15px',
              color: '#f9f9f9',
              padding: '10px',
            }"
            >{{ $t("Routes.InsightCenter") }}</a
          >
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
        >
          <a
            class="el-bradcrumb-item-content"
            @click="breadcrumb.click"
            :style="{
              'letter-spacing': '1.1px',
              'font-size': '15px',
              color: '#f9f9f9',
              padding: '10px',
            }"
            >{{ breadcrumb.name }}</a
          >
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button icon="el-icon-s-grid" circle @click="openDrawer"></el-button>
    </div>


    <spinal-breadcrumb class="breadcrumb-general" :view-key="$t('Routes.InsightCenter')"></spinal-breadcrumb>

    <!-- Si on a pas encore choisi de catégorie -->
    <div v-if="selectCategorie == null" class="root" style="margin-top: 11px">
      <!-- Si on a pas encore choisi de contexte -->
      <tableau-context
        v-if="contextSelected == null"
        v-loading="loading"
        :context-lst="contextLst"
        @select="SelectContext"
      >
      </tableau-context>

      <!-- Si on a choisi un contexte -->
      <tableau-category
        v-else
        :context-selected="contextSelected"
        @seeGroups="SelectCategorie"
        @reset="ResetBreadCrumb"
      >
      </tableau-category>
    </div>

    <!-- Si on a choisi une catégorie  -->
    <groupLstVue
      v-if="
        selectCategorie != null &&
        profilSelected == null &&
        groupSelected == null
      "
      ref="categoryListe"
      :select-categorie="selectCategorie"
      @selectgroup="SelectGroup"
      @goBackCategory="BackToCategory"
      style="margin-top: 11px"
    >
    </groupLstVue>

    <profilLstVue
      v-if="groupSelected != null && profilSelected == null"
      :profils="groupSelected.profils"
      :color="groupSelected.color"
      :filters="filterObjects"
      @selectprofil="SelectProfil"
      @goBackGroup="BackToGroup"
      style="margin-top: 11px"
    >
    </profilLstVue>

    <heatmap-vue
      class="heatmapContainer"
      v-if="profilSelected != null"
      :profil="profilSelected"
      :filter="filterObjects"
      @goBackProfil="BackToProfil"
      style="margin-top: 11px"
    >
    </heatmap-vue>
  </div>
</template>

<script>
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
import { spinalBackEnd } from "../../services/spinalBackend";
import groupLstVue from "./component/groupLstVue";
import profilLstVue from "./component/profilLstVue";
import tableauContext from "./tableaucontext";
import tableauCategory from "./tableaucategory";
import { EventBus } from "../../services/event";
import HeatmapVue from "./component/heatmapVue.vue";
import { viewerUtils } from "../../services/viewerUtils/viewerUtils";

export default {
  components: {
    profilLstVue,
    groupLstVue,
    tableauContext,
    tableauCategory,
    HeatmapVue,
    SpinalBreadcrumb,
  },
  props: [],
  data() {
    return {
      viewKey: "Insights",
      contextLst: [],
      breadcrumbs: [],
      selectCategorie: null,
      contextSelected: null,
      profilSelected: null,
      groupSelected: null,
      loading: true,
      filterObjects: [],
    };
  },
  async mounted() {
    await viewerUtils.waitInitialized();
    this.profilSelected = null;
    this.contextLst = await spinalBackEnd.heatmapBack.getData(); // this is when we get the data of all the contexts and children
    this.loading = false;
    EventBus.$on("sidebar-homeSelect", (item) => {
      spinalBackEnd.heatmapBack
        .getDataFilterItem(item)
        .then((result) => {
          this.filterObjects = result;
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },

  methods: {
    ResetBreadCrumb() {
      this.profilSelected = null;
      this.selectCategorie = null;
      this.contextSelected = null;
      this.groupSelected = null;
      this.breadcrumbs = [];
    },

    addbreadcrumb(resultat) {
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    //choix d'un context (niveau 1)
    SelectContext(context) {
      this.breadcrumbs = [];
      this.selectCategorie = null;
      this.profilSelected = null;
      this.groupSelected = null;
      this.contextSelected = context;

      const obj = {
        name: context.name,
        click: () => {
          this.SelectContext(context);
        },
      };
      this.breadcrumbs = [...this.breadcrumbs, obj];
      this.contextSelected = context;
    },

    //choix d'une catégorie (niveau 2)
    SelectCategorie(categorie) {
      this.groupSelected = null;
      this.profilSelected = null;
      this.selectCategorie = categorie;

      const categorieIndex = 1;
      this.breadcrumbs.splice(categorieIndex);

      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: categorie.name,
          click: () => {
            this.SelectCategorie(categorie);
            //this.$refs.categoryListe.resetRoomSelected();
          },
        },
      ];
    },

    //choix d'une catégorie (niveau 3)
    SelectGroup(group) {
      //on enregistre le groupe choisi
      this.profilSelected = null;
      this.groupSelected = {
        name: group.name,
        profils: group.rooms,
        color: group.color,
        rooms: group.rooms,
      };
      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: group.name,
          click: () => {
            this.profilSelected = null;
            this.groupSelected = null;
            this.breadcrumbs.splice(2);
            this.SelectGroup(group);
          },
        },
      ];
    },

    //choix d'un profil (niveau 4)
    SelectProfil(profil) {
      this.profilSelected = profil;
      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: profil.name,
          click: () => {
            this.profilSelected = null;
            this.breadcrumbs.splice(3);
            this.SelectProfil(profil);
          },
        },
      ];
    },

    BackToCategory() {
      this.SelectContext(this.contextSelected);
    },

    BackToGroup() {
      this.profilSelected = null;
      this.groupSelected = null;
      this.SelectCategorie(this.selectCategorie);
    },

    BackToProfil() {
      this.SelectGroup(this.groupSelected);
      this.breadcrumbs.splice(3);
    },

    addbreadcrumb(resultat) {
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    openDrawer() {
      EventBus.$emit("open-drawer");
    },
  },
  watch: {
    filterObjects(){
      EventBus.$emit('insight-filteredObjects-has-changed');
    }
  }
};
</script>

<style scoped>
.breadcrumb-general{
  display:none
}
.spacecon {
  width: 100%;
  height: 100%;
  /* padding: 0 5px; */
}
/* .breadcrumb-style {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 5px 10px 5px 10px;
  border-radius: 4px;
  align-items: center;
  background-color: white;
}
.spinal-space-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background: white;
  margin: 5px 0;
}
.spinal-space-header-breadcrum-container {
  width: calc(100% - 43px);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  height: 100%;
  display: flex;
} */

.heatmap-vue {
  max-height: 70vh !important;
}
.heatmapContainer {
  width: 100%;
  height: calc(100vh - 160px);
  padding-bottom: 6px;
}
</style>

<style>
.spinal-breadcrumb {
  display: flex;
  max-height: 40px;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 10px;
  margin-left: 10px;
}
.el-breadcrumb.spinal-breadcrumb-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 10px;
}

.el-breadcrumb__inner {
  background-color: #14202c;
  opacity: 1;
  text-align: left;
  padding: 10px;
  border: 1px solid;
  border-radius: 25px;
}

.el-breadcrumb__inner.is-link {
  letter-spacing: 1.1px;
  font-size: 15px;
  color: #f9f9f9;
}
</style>
