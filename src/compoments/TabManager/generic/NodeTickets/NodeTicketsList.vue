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
  <div style="height: 100%">
    <!-- <el-table
      v-if="tickets"
      :data="tickets"
      :header-cell-style="{ 'background-color': '#f0f2f5' }"
      border
      height="100%"
    > -->
    <el-table
      v-if="tickets"
      :data="tickets"
      :header-cell-style="{
        'background-color': '#ffffff',
        'text-align': 'left',
        'letter-spacing': '1px',
        'color': '#214353',
        'opacity': '1',
        'height': 'fit-content',
      }"
      :row-style="{
        'background': '#ffffff 0% 0% no-repeat padding-box',
        'border': '1px solid #F8F8F8',
        'border-radius': '5px',
        'opacity': '1',
        'text-align': 'left',
        'letter-spacing': '0.9px',
        'color': '#214353',
        'opacity': '1',
      }"
      border
      max-height="70vh"
    >
      <el-table-column label="Ticket">
        <div slot-scope="scope">
          {{ scope.row.name }}
        </div>
      </el-table-column>
      <el-table-column :label="$t('spinal-twin.Step')">
        <div slot-scope="scope">
          {{ scope.row.step }}
        </div>
      </el-table-column>
      <el-table-column label="Creation">
        <div slot-scope="scope">
          {{ scope.row.creation }}
        </div>
      </el-table-column>
      <el-table-column label="Actions" fixed="right" width="80">
        <div slot-scope="scope">
          <el-tooltip :content="$t('spinal-twin.TicketInspect')">
            <el-button
              @click="select(scope.row)"
              icon="el-icon-search"
              circle
            ></el-button>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // name: 'NodeTicketsList.vue',
  name: 'NodeTicketsList',
  props: {
    tickets: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    select(ticket) {
      this.$emit('select', ticket);
    },
  },
};
</script>
