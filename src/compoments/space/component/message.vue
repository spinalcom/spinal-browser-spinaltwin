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
  <li class="clearfix" v-if="type === MESSAGE_TYPES.file">
    <div class="message-data align-right">
      <span class="message-data-time">{{ date }}</span> &nbsp; &nbsp;
      <span class="message-data-name">{{ username }}</span>
    </div>
    <div
      class="message messageIcon other-message float-right"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="texte">
        <i class="el-icon-document">description</i>
        {{ message }}
      </div>

      <actions-btn
        class="message_actions"
        :hover="hover"
        @download="download"
        @restoreState="restoreState"
        :viewPoint="viewPoint"
      ></actions-btn>

      <!-- <div class="message_actions"
           v-if="hover">
        <md-button class="md-dense md-primary"
                   @click="download">
          <md-icon>get_app</md-icon>
          Download
        </md-button>
      </div> -->
    </div>
  </li>

  <li
    class="clearfix"
    v-else-if="type === MESSAGE_TYPES.image"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="message-data align-right">
      <span class="message-data-time">{{ date }}</span> &nbsp; &nbsp;
      <span class="message-data-name">{{ username }}</span>
    </div>
    <div
      class="message other-message float-right"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="images">
        <div class="img_texte">{{ message }}</div>
        <div class="image">
          <img :src="`/sceen/_?u=${image}`" alt="image" />
        </div>
      </div>

      <actions-btn
        class="message_actions"
        :hover="hover"
        @download="download"
        @restoreState="restoreState"
        :viewPoint="viewPoint"
      ></actions-btn>
    </div>
  </li>

  <li class="clearfix" v-else>
    <div class="message-data align-right">
      <span class="message-data-time">{{ date }}</span> &nbsp; &nbsp;
      <span class="message-data-name">{{ username }}</span>
    </div>
    <div class="message other-message float-right">
      <div class="texte">
        {{ message }}
      </div>
    </div>
  </li>
</template>

<script>
import { MESSAGE_TYPES } from 'spinal-models-documentation';
import actionBtnVue from './actionsBtn.vue';

export default {
  name: 'message',
  props: {
    date: {},
    username: {},
    message: {},
    type: {},
    file: {},
    viewPoint: {},
  },
  components: {
    'actions-btn': actionBtnVue,
  },
  data() {
    this.MESSAGE_TYPES = MESSAGE_TYPES;
    return {
      hover: false,
      image: undefined,
      info: undefined,
    };
  },
  mounted() {
    setTimeout(() => {
      this.chargeImg();
    }, 500);
  },
  methods: {
    chargeImg() {
      if (this.file) {
        this.file.load((f) => {
          this.info = f;
          f._ptr.load((path) => {
            this.image = path._server_id;
          });
        });
      }
    },

    download() {
      var element = document.createElement('a');
      element.setAttribute('href', '/sceen/_?u=' + this.image);
      element.setAttribute('download', this.info.name.get());
      element.click();
    },

    restoreState() {
      const viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;

      if (Object.keys(this.viewPoint).length === 0) return;

      const viewStateString = this.viewPoint.viewState.get();
      const objectStateString = this.viewPoint.objectState.get();

      const viewState = JSON.parse(viewStateString);
      const objectState = JSON.parse(objectStateString);

      viewer.restoreState(viewState);

      this.selection(viewer, objectState.selected);
      this.isolate(viewer, objectState.isolated);
    },

    isolate(viewer, items) {
      const bimObjectService = window.spinal.BimObjectService;
      items.map((el) => {
        const bimFileId =
          bimObjectService.mappingModelIdBimFileId[el.modelId].bimFileId;
        const model = spinal.BimObjectService.getModelByBimfile(bimFileId);

        viewer.impl.visibilityManager.isolate(el.ids, model);
      });
    },

    selection(viewer, items) {
      const bimObjectService = window.spinal.BimObjectService;
      items.map((el) => {
        const bimFileId =
          bimObjectService.mappingModelIdBimFileId[el.modelId].bimFileId;
        const model = spinal.BimObjectService.getModelByBimfile(bimFileId);

        model.selector.setSelection(el.selection, model, 'selectOnly');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$green: #86bb71;
$blue: #ffffff;
$orange: #e38968;
$gray: #92959e;
$black: #000000;

li.clearfix {
  padding-bottom: 20px;
  list-style: none;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.message-data {
  margin-bottom: 15px;
}

.message-data-time {
  color: lighten($gray, 8%);
  padding-left: 6px;
}

.message-data-name {
  color: $blue;
  text-transform: capitalize;
}

.message_actions {
  width: 100%;
  height: 40px;
  display: flex;
  border-radius: 7px 7px 0 0;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 0px;
  padding: 10px;
  background-color: #424242;
}

.message {
  color: #000000;
  padding: 10px 10px 5px 10px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  margin-bottom: 40px;
  width: 100%;
  position: relative;
  min-height: 30px;

  &:after {
    bottom: 100%;
    left: 7%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-bottom-color: $green;
    border-width: 10px;
    margin-left: -10px;
  }
}

.message:hover {
  cursor: pointer;
}

.my-message {
  background: $green;
}

.other-message {
  background: $blue;

  &:after {
    border-bottom-color: $blue;
    left: 93%;
  }
}

.me {
  margin-right: 3px;
  font-size: 10px;
  color: $blue;
}

.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: ' ';
  clear: both;
  height: 0;
}
</style>

<style lang="scss">
$black: #000000;

// li.clearfix .description.md-icon.md-theme-default.md-icon-font {
//   color: $black !important;
// }
</style>
