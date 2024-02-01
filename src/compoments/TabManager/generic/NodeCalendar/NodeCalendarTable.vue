<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <el-container>
    <vueCal
      class="calendar_container vuecal--full-height-delete"
      :time="true"
      :dblclick-to-navigate="true"
      :on-event-click="focus"
      events-count-on-year-view
      events-on-month-view="short"
      default-view="month"
      active-view="month"
      :editable-events="{
        title: false,
        drag: false,
        resize: false,
        delete: false,
        create: false,
      }"
      :events="events"
    ></vueCal>
  </el-container>
</template>
<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  name: 'NodeCalendarTable',
  components: { VueCal },
  props: {
    events: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  async mounted() {},
  methods: {
    focus(event, e) {
      this.$emit('select', event);
      e.stopPropagation();
    },
  },
};
</script>
