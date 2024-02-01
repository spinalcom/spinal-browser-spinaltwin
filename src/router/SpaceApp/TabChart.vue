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

<!--
  This component takes an object as a property of the following form :
  {
    [
      name: string,
      rooms: [],
      color: color,
    ]
  }
-->

<template>
  <el-container>
    <el-header> Room chart </el-header>
    <el-main>
      <div ref="charts"></div>
    </el-main>
  </el-container>
</template>

<script>
import {EventBus} from "../../services/event"
export default {
  name: 'TabChart',
  components: {},
  // props: ['entreprise'],
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        await this.updateChart();
      },
      deep: true,
    },
  },

  data() {
    return {
      data: [
        {
          x: [],
          y: [],
          marker: {
            color: [],
          },
          type: 'bar',
          text: [],
          textposition: 'auto',
        },
      ],
    };
  },


  async mounted() {
    Plotly.newPlot(this.$refs.charts, this.data);
    this.updateChart();
    EventBus.$on("click-on_spinal-twin.Chart", () => {
      Plotly.newPlot(this.$refs.charts, this.data);
      this.updateChart();
    });

  },

  methods: {
    updateChart() {
      this.data[0].x = [];
      this.data[0].y = [];
      this.data[0].text = [];

      this.data[0].marker.color = [];
      console.debug("Chart properties :", this.Properties)
      for (let i = 0; i < this.Properties.chart.length; i++) {
        const bar = this.Properties.chart[i];
        this.data[0].x.push(bar.name);
        this.data[0].y.push(bar.rooms.length);
        // this.data[0].text.push(bar.rooms.length.toString());
        this.data[0].marker.color.push(bar.color);
      }
      Plotly.redraw(this.$refs.charts, this.data);
    },
  },
};
</script>
