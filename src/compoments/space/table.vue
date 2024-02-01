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
    <div class="spinal-space-header-container">
      <div class="spinal-space-header">
        <div class="spinal-space-header-breadcrum-container spinal-scrollbar">
          <el-breadcrumb class="breadcrumb-style" separator="/">
            <el-breadcrumb-item>
              <a @click="onclick(null)">Space Management</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(breadcrumb, index) in breadcrumbs"
              :key="index"
            >
              <a @click="breadcrumb.click">{{ breadcrumb.name }}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-button icon="el-icon-s-grid" circle @click="openDrawer"></el-button>
      </div>
    </div>
    <div class="spinal-space-spacecon_container-container">
      <div v-if="selectCategorie == null" class="spacecon_container">
        <tableau-context
          v-if="contextSelected === null"
          :context-lst="contextLst"
          @select="SelectContext"
        >
        </tableau-context>

        <tableau-category
          v-else
          :context-selected="contextSelected"
          @seeGroups="onclick"
        ></tableau-category>
      </div>

      <div v-else class="spacecon_container">
        <room-data v-if="roomNodeId" :node-id="roomNodeId"></room-data>

        <categoryLstVue
          v-show="!roomNodeId"
          ref="categoryListe"
          :select-categorie="selectCategorie"
          @addbreadcrumb="addbreadcrumb"
          @updateBreadcrumb="removeAndAddBreadcrumb"
          @resetRoomSelect="roomNodeId = null"
        >
        </categoryLstVue>
      </div>
    </div>
  </div>
</template>

<script>
import { spinalBackEnd } from '../../services/spinalBackend';
import categoryLstVue from './component/categoryLstVue';
import tableauContext from './tableaucontext';
import tableauCategory from './tableaucategory';
// import { roomLstVue } from "../space/component/roomLstVue";
import RoomData from './component/RoomData.vue';

import { EventBus } from '../../services/event';
import './space.css';
export default {
  components: {
    categoryLstVue,
    tableauContext,
    tableauCategory,
    'room-data': RoomData,
  },
  props: [],
  data() {
    return {
      contextLst: [],
      selectCategorie: null,
      roomNodeId: null,
      breadcrumbs: [],
      contextSelected: null,
    };
  },
  async mounted() {
    this.contextLst = await spinalBackEnd.spaceBack.getData();

    EventBus.$on('sidebar-homeSelect', (item) => {
      if (item) {
        spinalBackEnd.spaceBack
          .getDataFilterItem(item)
          .then((result) => {
            this.contextLst = result;

            if (this.contextSelected) {
              for (const context of this.contextLst) {
                if (this.contextSelected.id === context.id) {
                  const selectCategorie = this.selectCategorie;
                  this.SelectContext(context, false);
                  if (selectCategorie) {
                    for (const cat of this.contextSelected.categories) {
                      if (selectCategorie.id === cat.id) {
                        this.onclick(cat, false);
                        // this.selectCategorie = categorie;
                      }
                    }
                  }
                  break;
                }
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  },
  methods: {
    onclick(categorie, changepage = true) {
      this.selectCategorie = categorie;
      // this.breadcrumbs = [];
      if (categorie && changepage) {
        this.removeAndAddBreadcrumb({
          index: 1,
          item: {
            name: categorie.name,
            click: () => {
              const realCategory = this.contextSelected.categories.find(
                (el) => el.id === categorie.id
              );
              this.onclick(realCategory);
              this.roomNodeId = null;
              this.$refs.categoryListe.resetRoomSelected();
            },
          },
        });
      } else if (changepage) {
        this.contextSelected = null;
        this.roomNodeId = null;
        this.breadcrumbs = [];
      }
    },

    addbreadcrumb(resultat) {
      if (typeof resultat.roomNodeId !== 'undefined') {
        this.roomNodeId = resultat.roomNodeId;
      }
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    SelectContext(context, changepage = true) {
      this.contextSelected = context;

      if (changepage) {
        this.selectCategorie = null;
        this.breadcrumbs = [];
        const obj = {
          name: context.name,
          click: () => {
            const another = this.contextLst.find((el) => el.id === context.id);
            this.roomNodeId = null;
            this.SelectContext(another);
          },
        };

        this.breadcrumbs = [...this.breadcrumbs, obj];
      }

      // this.contextSelected = context;
    },

    removeAndAddBreadcrumb(data) {
      this.roomNodeId = null;
      this.breadcrumbs.splice(data.index);

      this.breadcrumbs = [...this.breadcrumbs, data.item];
    },
    openDrawer() {
      EventBus.$emit('open-drawer');
    },
  },
};
</script>

<style scoped>
.spacecon {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spinal-space-header-container {
  background-color: #fdfdfd;
  padding: 5px 20px 5px 20px;
}
.spinal-space-header-breadcrum-container {
  width: calc(100% - 43px);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  height: 100%;
  display: flex;
}
.spacecon .breadcrumb-style {
  /* width: 100%;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0 5px 0 5px; */
  display: flex;
  height: 40px;
  justify-content: space-between;
  flex-wrap: nowrap;
  border-radius: 4px;
  align-items: center;
  background-color: white;
}

.breadcrumb-item {
  font-size: 20px;
  margin: 10px 0 10px 10px;
}

.spacecon .spacecon_container {
  border-radius: 4px;
  height: 100%;
}
.spinal-space-spacecon_container-container {
  width: 100%;
  padding: 5px 10px 10px 5px;
  background-color: #fdfdfd;
  height: calc(100% - 50px);
}

.spinal-space-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background: white;
  padding-right: 5px;
}

/* .boutton-barre {
  padding: 14px !important;
}
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
} */
</style>
