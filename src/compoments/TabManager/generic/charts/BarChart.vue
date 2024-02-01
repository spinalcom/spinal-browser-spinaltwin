<!--
Copyright 2023 SpinalCom - www.spinalcom.com

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
    <Bar
        :chart-data="barChartData"
        :chart-id="'1'"
        :chart-options="barChartOptions"
        class="bar-height white"
    />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import { Legend, BarElement, LinearScale, CategoryScale, Tooltip, LogarithmicScale, Chart as ChartJS } from "chart.js";
ChartJS.register(Legend, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip)

export default {
  name: "BarChart",

  props: {
    labels: {
      type: Array,
      required: true
    },

    datasets: {
      type: Array,
      required: true
    },

    scaleType: {
      type: String,
      default: 'linear'
    }
  },

  components: {
    Bar
  },

  computed: {
    barChartData() {
      return {
        labels: this.labels,
        datasets: this.datasets
      }
    },

    barChartOptions() {
      return  {
        indexAxis: 'y',
        maintainAspectRatio: false,
        responsive: true,
        borderRadius: 8,
        barThickness: 20,
        borderWidth: 2,
        borderColor: '#fff',
        // scales: {
        //   y: {
        //     type: this.scaleType
        //   }
        // },
        plugins: {
          legend: {
            align: "center",
            labels: {
              boxWidth: 10,
              boxHeight: 20,
            },
            font: {
              family: "'Roboto', 'Helvetica', 'Arial', sans-serif",
              size: 14
            }
          },
        },
      }
    }
  },
}
</script>

<style scoped>
/* .bar-card {
  background-color: #f9f9f9;
}

.card-title {
  height: 20%;
}

.bar-height {
  height: 80%;
} */
</style>