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
  <div class="tab-manager-placement">
    <div class="tab-selector-placement">
      <el-select
        v-model="activetab"
        :label="$t(activeTab)"
        class="tab-selector"
        @change="chooseTab2"
      >
        <!-- @change="handleClick(tab)" -->
        <template v-for="(tab, index) of tabsprop">
          <el-option
            v-if="!tab.ignore"
            :key="index"
            :label="$t(tab.name)"
            :value="tab.name"
          />
        </template>
        <!-- <el-option
          v-for="(tab, index) of tabsprop"
          :key="index"
          :label="$t(tab.name)"
          :value="tab.name"
        /> -->
      </el-select>
    </div>
    <!-- <component
              :is="activetab.content"
              :Properties="activetab.props"
              style="height: calc(100% - 20px)"
            ></component> -->

    <el-tabs
      :value="activetab"
      @tab-click="handleClick"
      class="tab-manager-tabs"
      type="border-card"
    >
      <template v-for="tab in tabsprop">
        <template v-if="!tab.ignore">
          <el-tab-pane
            :key="$t(tab.name)"
            :label="$t(tab.name)"
            :name="tab.name"
            :closable="false"
            style="height: calc(100%); overflow: hidden"
          >
            <keep-alive>
              <component :is="tab.content" :Properties="tab.props"></component>
            </keep-alive>
          </el-tab-pane>
        </template>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import { EventBus } from '../../services/event';
export default {
  name: 'TabManager',
  components: {},
  props: {
    tabsprop: {
      type: Array,
      required: true,
      validator: function (value) {
        if (!value.name instanceof String) {
          console.error('Invalid tab name');
          return false;
        }
        if (!value.content instanceof Vue) {
          console.error('Invalid component for tab content');
          return false;
        }
        return true;
      },
    },
  },

  data() {
    return {
      activetab: this.tabsprop[0].name,
    };
  },

  watch: {
    tabsprop: {
      handler(oldTabs, newTabs) {
        if (
          !newTabs.some((tab) => !tab.ignore && tab.name === this.activetab)
        ) {
          this.activetab = newTabs[0].name;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    this.activetab = this.$t(this.tabsprop[0].name);
  },

  methods: {
    handleClick(tab, event) {
      this.activetab = tab._props.name;
      // let eventName = "click-on-"+tab._props.name;

      EventBus.$emit('click-on_' + tab._props.name);
    },
    chooseTab(tab) {
      this.activetab = tab.name;
      EventBus.$emit('click-on_' + tab.name);
    },
    chooseTab2(tabName) {
      this.activetab = tabName;
      EventBus.$emit('click-on_' + tabName);
    },
  },
};
</script>

<style>
.tab-manager-placement {
  display: flex;
  flex-direction: column;
}
.el-tabs__header {
  display: none;
}

/* .tab-selector{
  background-color: #14202c;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  color: #F9F9F9;
} */
.tab-selector-placement {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.tab-selector > .el-input--suffix > .el-input__inner {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c;
  border: 3px solid #f9f9f9;
  border-radius: 10px;
}
/* .el-scrollbar {
  text-align: left;
  letter-spacing: 0.75px;
  color: #f9f9f9;
  opacity: 1;
  background-color: #14202c !important;
  border-radius: 10px;
} */
.el-select-dropdown__item.hover {
  background-color: #14202c;
  color: #448aff;
}
.el-select-dropdown__item {
  color: #f9f9f9;
}

.el-select-dropdown.el-popper {
  background-color: #14202c;
  border-color: #14202c;
}
.ticket-selected-main-container {
  width: 100%;
}

.el-popper[x-placement^='bottom'] .popper__arrow {
  border-bottom-color: #14202c;
}
.el-popper[x-placement^='bottom'] .popper__arrow:after {
  border-bottom-color: #14202c;
}
.tab-manager-tabs {
  display: flex;
  flex-direction: column;
}

.tab-manager-tabs .el-tabs__content {
  background: #ffffff 0% 0% no-repeat padding-box;
  /* box-shadow: 0px 3px 10px #49545c29; */
  border-radius: 10px;
  opacity: 1;
  backdrop-filter: blur(33px);
  -webkit-backdrop-filter: blur(33px);
}

.el-tabs__item.is-top {
  /* color: #214353 !important;
  background-color: #eaeef0; */
  background: #dcdee6 0% 0% no-repeat padding-box !important;
  border: 1px solid #49545c29 !important;
  border-radius: 10px 10px 0px 0px !important;
  opacity: 1 !important;
  text-align: left;
  /* font: normal normal normal 11px/13px Charlevoix Pro; */
  letter-spacing: 1.1px !important;
  color: #214353 !important;
  opacity: 0.32 !important;
}
.el-tabs__item.is-top.is-active {
  /* color: #214353 !important;
  background-color: #f9f9f9; */
  background: #f9f9f9 0% 0% no-repeat padding-box !important;

  border: 1px solid #f7f7f7 !important;

  border-radius: 10px 10px 0px 0px !important;
  opacity: 1 !important;
  text-align: left !important;
  /* font: normal normal normal 11px/13px Charlevoix Pro !important; */
  letter-spacing: 1.1px !important;
  color: #214353 !important;
  opacity: 1 !important;
}
.tab-manager-pane {
  height: 100%;
}
</style>
