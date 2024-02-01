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
    <div class="spl-button-bar" :style="{'max-height':'60vh'}">
      <el-tooltip :content="$t('spinal-twin.CategoryAdd')" style="float: right">
        <!-- <el-button
          @click.native="addCategory()"
          :disabled="ctxNode == false || isEditing"
          icon="el-icon-plus"
          type="primary"
          circle
        ></el-button> -->
        <el-button
          @click.native="addCategory()"
          :disabled="ctxNode == false || isEditing"
          icon="el-icon-plus"
          circle
          class="el-button-add"
        ></el-button>
      </el-tooltip>
    </div>

    <div style="overflow: auto; height: inherit">
      <!-- <el-table
        v-if="Categories"
        :data="Categories"
        :header-cell-style="{ 'background-color': '#f0f2f5' }"
        border
        style="overflow: auto; height: inherit"
      > -->
      <el-table
        v-if="Categories"
        :data="Categories"
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
        style="overflow: auto; height: inherit"
      >
        <el-table-column type="expand">
          <div slot-scope="cat">
            <!-- <el-table
              :data="cat.row.attributes"
              :header-cell-style="{ 'background-color': '#f0f2f5' }"
              border
            > -->
            <el-table
              :data="cat.row.attributes"
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
            >
              <el-table-column :label="$t('node-type.Attribute')">
                <editable-text
                  :content.sync="scope.row.label"
                  :isEditing="scope.row.isEditing"
                  slot-scope="scope"
                >
                  <a
                    v-if="scope.row.type == 'url'"
                    :href="httpify(scope.row.value)"
                  >
                    {{ scope.row.label }}
                  </a>
                  <div v-else>
                    {{ scope.row.label }}
                  </div>
                </editable-text>
              </el-table-column>

              <el-table-column label="Value">
                <editable-text
                  :content.sync="scope.row.value"
                  :isEditing="scope.row.isEditing"
                  slot-scope="scope"
                >
                  {{ scope.row.value }}
                </editable-text>
              </el-table-column>

              <el-table-column label="Type">
                <editable-text
                  :content.sync="scope.row.type"
                  :isEditing="scope.row.isEditing"
                  slot-scope="scope"
                >
                  {{ scope.row.type }}
                </editable-text>
              </el-table-column>

              <el-table-column label="Unit">
                <editable-text
                  :content.sync="scope.row.unit"
                  :isEditing="scope.row.isEditing"
                  slot-scope="scope"
                >
                  {{ scope.row.unit }}
                </editable-text>
              </el-table-column>

              <el-table-column fixed="right" label="Options" width="120">
                <div slot-scope="scope">
                  <el-tooltip
                    :content="$t('spinal-twin.AttributeEdit') + scope.row.label"
                  >
                    <el-button
                      @click.native="editAttribute(scope.row, cat.row)"
                      :icon="
                        scope.row.isEditing ? 'el-icon-success' : 'el-icon-edit'
                      "
                      :disabled="!scope.row.isEditing && isEditing"
                      circle
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    :content="$t('Remove attribute ') + scope.row.label"
                  >
                    <el-popconfirm
                      @confirm="delAttribute(cat.row, scope.row)"
                      :title="$t('spinal-twin.DeleteConfirm')"
                    >
                      <!-- <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        slot="reference"
                      ></el-button> -->
                      <el-button
                        icon="el-icon-delete"
                        circle
                        slot="reference"
                        class="el-button-delete"
                      ></el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </div>
              </el-table-column>
            </el-table>
            <el-tooltip
              :content="$t('spinal-twin.CategoryAddAttribute') + cat.row.name"
            >
              <el-button
                @click.native="addAttribute(cat.row)"
                :disabled="isEditing"
                icon="el-icon-plus"
                circle
                class="el-button-add"
              ></el-button>
            </el-tooltip>
          </div>
        </el-table-column>

        <el-table-column :label="$t('node-type.Category')">
          <editable-text
            :content.sync="cat.row.name"
            :isEditing="cat.row.isEditing"
            slot-scope="cat"
          >
            {{ cat.row.name }}
          </editable-text>
        </el-table-column>

        <el-table-column label="Actions" width="120">
          <div slot-scope="cat">
            <el-tooltip
              :content="$t('spinal-twin.CategoryEdit') + cat.row.name"
            >
              <el-button
                @click.native="editCategory(cat.row)"
                :disabled="!cat.row.isEditing && isEditing"
                :icon="cat.row.isEditing ? 'el-icon-success' : 'el-icon-edit'"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :content="$t('spinal-twin.CategoryRemove') + cat.row.name"
            >
              <el-popconfirm
                @confirm="delCategory(cat.row)"
                :title="$t('spinal-twin.DeleteConfirm')"
              >
                <!-- <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button> -->
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  class="el-button-delete"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { FileSystem } from 'spinal-core-connectorjs_type';

import EditableText from '../../../compoments/EditableText.vue';
import { spinalIO } from '../../../services/spinalIO';

import { EventBus } from "../../../services/event"

export default {
  name: 'Attributes',
  components: { EditableText },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      Categories: [],
      isEditing: false,
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          // this.update(newProp.view.serverId);
        } else {
          this.Categories = [];
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  mounted() {
    // this.update(this.Properties.view.serverId);
    EventBus.$on("click-on_spinal-twin.hasCategoryAttributes", () => this.update(this.Properties.view.serverId))
  },

  methods: {
    async update(id) {
      this.ctxNode = FileSystem._objects[id];
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
                  type: attribute.type._data,
                  unit: attribute.unit._data,
                  isEditing: false,
                  serverId: attribute._server_id,
                });
              }
              let cat = {
                cat: category,
                name: category.nameCat,
                attributes: attrs,
                isEditing: false,
              };
              this.Categories.push(cat);
            });
        }
      });
    },

    async addAttribute(category) {
      const node = await serviceDocumentation.addAttributeByCategory(
        this.ctxNode,
        category.cat,
        'newAttribute',
        'newValue',
        'newType',
        'newUnit'
      );
      await spinalIO.waitNodeReady(node);
      category.attributes.push({
        label: 'newAttribute',
        value: 'newValue',
        type: 'newType',
        unit: 'newUnit',
        isEditing: true,
        serverId: node._server_id,
      });
      this.isEditing = true;
    },

    async delAttribute(category, attribute) {
      if (attribute.isEditing) {
        attribute.isEditing = false;
        this.isEditing = false;
      }
      await serviceDocumentation.removeAttributesById(
        category.cat.node,
        attribute.serverId
      );
      category.attributes = category.attributes.filter(
        (attr) => attr.serverId != attribute.serverId
      );
    },

    async editAttribute(attribute, category) {
      if (!attribute.isEditing) {
        attribute.isEditing = true;
        this.isEditing = true;
        return;
      }
      if (
        category.attributes.some((attr) => {
          return (
            attr.label == attribute.label && attr.serverId != attribute.serverId
          );
        })
      ) {
        alert(
          "Attribute '" +
            attribute.label +
            "' already exists in '" +
            category.name +
            "'"
        );
        return;
      }
      await serviceDocumentation.setAttributeById(
        this.ctxNode,
        attribute.serverId,
        attribute.label,
        attribute.value,
        attribute.type,
        attribute.unit
      );
      attribute.isEditing = false;
      this.isEditing = false;
    },

    async addCategory() {
      const category = await serviceDocumentation.addCategoryAttribute(
        this.ctxNode,
        'NewCategory'
      );
      this.Categories.push({
        cat: category,
        name: 'NewCategory',
        attributes: [],
        isEditing: true,
      });
      this.isEditing = true;
    },

    async delCategory(category) {
      if (category.isEditing) {
        category.isEditing = false;
        this.isEditing = false;
      }
      await serviceDocumentation.delCategoryAttribute(
        this.ctxNode,
        category.cat.node._server_id
      );
      this.Categories = this.Categories.filter(
        (cat) => !(cat.cat.node._server_id == category.cat.node._server_id)
      );
    },

    async editCategory(category) {
      if (!category.isEditing) {
        category.isEditing = true;
        this.isEditing = true;
        return;
      }
      if (
        this.Categories.some((cat) => {
          return (
            cat.name == category.name &&
            cat.cat.node._server_id != category.cat.node._server_id
          );
        })
      ) {
        alert("Category '" + category.name + "' already exists");
        return;
      }
      await serviceDocumentation.editCategoryAttribute(
        this.ctxNode,
        category.cat.node._server_id,
        category.name
      );
      category.isEditing = false;
      this.isEditing = false;
    },

    httpify(url) {
      if (!url.startsWith('http')) {
        return 'http://' + url;
      }
      return url;
    },
  },
};
</script>

<style scoped>
.spl-button-bar {
  /* overflow: hidden; */
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}
/* .el-button-add{
  background-color: #14202C;
  color: #F9F9F9;
} */
/* .el-button-delete{
  color: #EF5F32;
  border-color: #EF5F32;
} */

</style>
