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
  <el-container>
    <el-header>
      <h3>
        {{ CurrentObject }}
      </h3>
    </el-header>
    <el-main>
      <div ref="charts"></div>
    </el-main>
  </el-container>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { BackEndTicket } from "../backend/ticket";
import "../backend/EventHandler";

export default {
  name: "Visualizer",
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function(value) {
        if (value.viewKey == "") {
          return "danger";
        }
        return "success";
      },
    },
  },
  data() {
    return {
      CurrentObject: "",
      data: [
        {
          values: [],
          labels: [],
          marker: {
            colors: [],
          },
          textinfo: "value",
          type: "pie",
        },
      ],
    };
  },
  async mounted() {
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    // ViewManager.getInstance(this.Properties.viewKey).viewSubscribe(
    //   this.onViewChange.bind(this),
    //   0
    // );
    Plotly.newPlot(this.$refs.charts, this.data);
  },
  methods: {
    async onViewChange(view) {
      console.debug(view);
      this.CurrentObject = view.name;

      // Plotly.redraw(this.$refs.charts, this.data);
    },
    changeView(item) {
      ViewManager.getInstance(this.Properties.viewKey).push(
        item.name,
        item.serverId
      );
    },
    async debug() {
      console.debug("");
    },
  },
};
</script>
