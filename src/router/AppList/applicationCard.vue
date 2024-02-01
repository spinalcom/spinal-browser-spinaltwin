<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <v-card elevation="5" class="appCardContainer" @click="goToApplication">
    <div class="content">
      <div class="left">
        <v-card class="iconDiv">
          <!-- <v-icon color="#000000">{{ data.icon }}</v-icon> -->

          <!-- <v-btn color="#00FF00" outlined>coucou</v-btn> -->
          <!-- <md-icon color="#000000">{{ data.icon }}</md-icon> -->
          <!-- <md-icon>mdi-plus</md-icon> -->
          <!-- <v-icon color="00ff00">""</v-icon> -->
          <!-- <i :class="'v-icon btnIcon mdi '+data.icon"></i> -->
          <i :class="'v-icon btnIcon mdi ' + data.icon"></i>
          <!-- <v-icon color="#000000">add</v-icon> -->
        </v-card>
      </div>

      <div class="right">
        <div class="name" :title="data.name">
          {{ data.name }}
        </div>

        <div class="description" :title="data.description">
          {{ data.description }}
        </div>

        <div class="tags" :title="getTagsTitle">
          <!-- <v-chip
            class="chip"
            label
            color="#6699cc"
            v-for="(tag, index) in data.tags"
            :key="index"
            small
          > -->
          <v-chip
            class="chip"
            label
            :color="tag.color"
            v-for="(tag, index) in data.tags"
            :key="index"
            small
          >
            <i
              :class="'v-icon btnIcon mdi mdi-circle small '"
              color="#ffffff"
            ></i>
            <!-- <v-icon left color="#ffffff"> mdi-circle-small </v-icon> -->
            <!-- {{ tag.label.toUpperCase() }} -->
            {{ tag.label }}
          </v-chip>
        </div>

        <div class="actions">
          <div>
            <!-- <v-btn
              class="favorisBtn"
              title="add to favorite"
              outlined
              small
              color="#bdbdbd"
              @click.stop="addAppToFavoris"
            >
              <v-icon>mdi-cards-diamond</v-icon>
            </v-btn> -->
            <!-- <md-icon>arrow_forward</md-icon> -->

            <!-- <i :class="'v-icon btnIcon mdi mdi-arrow-right-thick '"></i> -->
            <i :class="'v-icon btnIcon mdi mdi-arrow-right-thick '"></i>

            <!-- <v-btn icon @click.stop="show = !show">
              <v-icon
                >{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </v-btn> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going to
          do his laundry? I've got to find a way to escape.
        </v-card-text>
      </div>
    </v-expand-transition> -->
  </v-card>
</template>

<script>
import 'material-design-icons-iconfont';
import { VIcon } from 'vuetify';
// import "../../../node_modules/material-design-icons-iconfont"

export default {
  name: 'applicationCard',
  components: {
    'v-icon': VIcon,
  },
  props: {
    data: {},
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    goToApplication() {
      // this.$emit("goToApp", this.data);
    },

    exploreApp() {
      // this.$emit("exploreApp", this.data);
    },
    addAppToFavoris() {
      // this.$emit("addAppToFavoris", this.data);
    },
  },
  computed: {
    getTagsTitle() {
      return this.data.tags.join(', ');
    },
  },
};
</script>

<style lang="scss">
.appCardContainer {
  // box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
  box-shadow: 0px 1px 14px 0px rgb(0 0 0 / 12%),
    0px 1px 14px 0px rgb(0 0 0 / 12%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
  width: 100%;
  min-height: 113px;
  background: #ffffff;
  margin: 10px 0;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  .content {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
      width: 40px;
      background: #f7f8f8;
      display: flex;
      justify-content: center;
      .iconDiv {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        /* background: #ffffff; */
        padding: 5px;
        margin-top: 5px;
      }
    }

    .right {
      width: calc(100% - 40px);
      height: 100%;
      padding: 5px;
      .name,
      .description,
      .tags {
        text-align: left;

        .actions {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          /* margin-bottom: 5px; */
        }
      }
      .name {
        height: 30px;
        font-size: 0.9em;
        color: #000000;
        text-transform: uppercase;
        font-weight: 900;
        display: flex;
        align-items: center;
      }

      .description {
        height: 20px;
        font-size: 0.7em;
        display: flex;
        align-items: center;
      }

      .tags {
        height: 25px;
        .chip {
          height: 16px;
          color: #ffffff;
          font-size: 0.7em;
          margin-right: 4px;
          border-radius: 10px;
          .v-chip__content {
            margin: 5px;
          }
          i {
            min-width: none !important;
            width: 5px;
            position: absolute;
            left: 0px;
          }
        }
      }

      .actions {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .favorisBtn {
          min-width: unset !important;
          width: 25px;
          height: 25px !important;
          border-radius: 5px;

          i {
            font-size: 10px;
          }
        }
      }
    }
  }
}

.appCardContainer:hover {
  cursor: pointer;
}
</style>
