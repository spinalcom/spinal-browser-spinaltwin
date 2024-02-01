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
  <div class="side-bar-compomenet-container">
    <div class="side-bar-header-container">
      <el-button
        v-ripple
        :disabled="!canGoBack"
        v-if="canGoBack"
        class="button-icon-go-back"
        icon="el-icon-arrow-left"
        circle
        @click="$emit('goBack')"
      >
      </el-button>
      <div class="button-icon-building-focus-container">
        <el-button
          v-ripple
          class="button-icon-building-focus"
          type="info"
          size="small"
          @click="$emit('homeSelect')"
        >
          {{ title }}
        </el-button>
      </div>
    </div>
    <div class="spinal-side-bar-menu spinal-scrollbar">
      <transition-group
        name="staggered-fade"
        tag="el-menu"
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
        text-color="#fff"
      >
        <div
          v-ripple
          v-for="item in items"
          :key="item.id"
          @mouseover="mouseover(item)"
          @mouseleave="mouseleave(item)"
        >
          <el-menu-item :index="item.name" @click="$emit('selected', item)">
            <span>{{ item.name }}</span>
          </el-menu-item>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate';
import debounce from 'lodash.debounce';

export default {
  name: 'sidebarMenu',
  props: ['title', 'items', 'canGoBack'],
  data() {
    return {};
  },
  mounted() {
    this.mouseoverEvent = debounce((item) => {
      this.$emit('onMouseOver', item);
    }, 500);
  },
  methods: {
    mouseover(item) {
      this.mouseoverEvent(item);
    },
    mouseleave(item) {
      this.mouseoverEvent.cancel();
    },
    beforeEnter: function (el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150;
      setTimeout(function () {
        Velocity(el, { opacity: 1, height: '56px' }, { complete: done });
      }, delay);
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150;
      setTimeout(function () {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    },
  },
};
</script>

<style scoped>
.side-bar-compomenet-container {
  height: calc(100% - 62px);
}
.side-bar-header-container {
  display: flex;
  align-self: auto;
  height: 56px;
  /* line-height: 56px; */
  background-color: #1d3461;
  background-image: radial-gradient(circle at bottom, #3646b1, #1d3461);
  /* color: white; */
  justify-content: center;
}
.side-bar-header-container,
.side-bar-header-container * {
  transition: all 1s;
}
.spinal-side-bar-menu {
  height: calc(100% - 106px);
  border-right: none !important;
  overflow: auto;
}

.side-bar-header-container .button-icon-building-focus {
  background: white;
  color: #1d4b5e;
  padding: 5px !important;
  align-self: center;
  display: flex;
  margin: 0 4px;
  max-width: calc(100% - 8px);
  width: 100%;
  height: 33px;
  border-radius: 13px;
}
.button-icon-go-back {
  flex-grow: 0.001;
  background: white;
  color: #1d4b5e;
  align-self: center;
  display: flex;
  padding: 7px !important;
}
.button-icon-building-focus-container {
  flex-grow: 1;
  display: flex;
  max-width: calc(100% - 37px);
}
</style>

<style>
.side-bar-header-container .button-icon-building-focus span {
  align-self: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  flex-grow: 1;
}
.side-bar-header-container .button-icon-building-focus i {
  align-self: center;
  font-size: 20px;
}
.spinal-side-bar-menu > .el-menu {
  background-color: transparent;
  border-right: none;
}
.spinal-side-bar-menu > .el-menu .el-menu-item {
  color: whitesmoke;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spinal-side-bar-menu > .el-menu .el-menu-item > span {
  pointer-events: none;
}

.spinal-side-bar-menu > .el-menu .el-menu-item.is-active {
  color: #409eff;
}

/* .spinal-side-bar-menu .el-menu-item:hover {
  background-color: #606266 !important;
} */
.spinal-side-bar-menu li.el-menu-item:focus {
  outline: none;
  background-color: transparent;
}
</style>
