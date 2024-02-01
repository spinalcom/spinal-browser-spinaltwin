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
  <div>
    <div ref="charts"> </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          values: [],
          labels: [],
          marker: {
            colors: [],
          },
          textinfo: 'value',
          type: 'pie',
        },
      ],
    };
  },
  components: {},
  props: ['entreprise'],
  methods: {
    updateEntreprise() {
      this.data[0].values = [];
      this.data[0].labels = [];
      this.data[0].marker.colors = [];
      for (let i = 0; i < this.entreprise.length; i++) {
        const oneEntreprise = this.entreprise[i];
        this.data[0].labels.push(oneEntreprise.name);
        this.data[0].values.push(oneEntreprise.surface);
        this.data[0].marker.colors.push(oneEntreprise.color);
      }
      Plotly.redraw(this.$refs.charts, this.data);
    },
  },
  mounted() {
    Plotly.newPlot(this.$refs.charts, this.data);
    this.updateEntreprise();
  },
  watch: {
    entreprise: function () {
      this.updateEntreprise();
    },
  },
  beforeDestroy() {},
};
</script>
