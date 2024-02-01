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
    <el-main>
      <el-collapse v-for="category in Categories" :key="category.nameCat">
        <el-collapse-item :name="category.name">
          <template slot="title">
            {{ category.name }}
          </template>
          <el-table :data="category.attributes">
            <el-table-column label="Name" prop="label"> </el-table-column>
            <el-table-column label="Value" prop="value"> </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { FileSystem } from 'spinal-core-connectorjs_type';

export default {
  name: 'Explorer',
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function (value) {
        if (value.viewKey == '') {
          return 'danger';
        }
        return 'success';
      },
    },
  },
  data() {
    return {
      ctxNode: false,
      Categories: [],
    };
  },
  created: function () {
    if (this.Properties.view.serverId != 0) {
      this.ctxNode = FileSystem._objects[this.Properties.view.serverId];
      serviceDocumentation.getCategory(this.ctxNode).then((Categories) => {
        this.Categories = [];
        for (const category of Categories) {
          serviceDocumentation
            .getAttributesByCategory(this.ctxNode, category.nameCat)
            .then((attributes) => {
              let attrs = [];
              for (const attribute of attributes) {
                attrs.push({
                  label: attribute.label._data,
                  value: attribute.value._data,
                });
              }
              let cat = {
                name: category.nameCat,
                attributes: attrs,
              };
              this.Categories.push(cat);
            });
        }
      });
    }
  },
  methods: {
    exportToExcel() {
      this.$refs['Explorer-table'].exportToExcel();
    },
    async getAttributes(category) {
      let result = await serviceDocumentation.getAttributesByCategory(
        this.ctxNode,
        category.nameCat
      );
      return result;
    },
    async addAttribute(category) {
      await serviceDocumentation.addAttributeByCategoryName(
        this.ctxNode,
        category.nameCat,
        'newAttribute',
        'newValue',
        '',
        ''
      );
    },
  },
};
</script>
