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
  <div class="category-attribute-component">
    <div class="spl-button-bar" :style="{ 'max-height': '60vh' }">
      <el-tooltip :content="$t('spinal-twin.CategoryAdd')" style="float: right">
        <!-- <el-button
          @click.native="addCategory()"
          :disabled="ctxNode == false || isEditing"
          icon="el-icon-plus"
          circle
          class="el-button-add"
        ></el-button> -->

        <el-button
          @click.native="dialogAddCategoryVisible = true"
          icon="el-icon-plus"
          circle
          class="el-button-add"
        ></el-button>

        <!-- <el-button type="text" @click="dialogAddCategoryVisible = true"
          >click to open the Dialog</el-button
        > -->

        <!-- <el-button
          @click.native="OpenDialog()"
          :disabled="ctxNode == false || isEditing"
          icon="el-icon-plus"
          circle
          class="el-button-add"
        ></el-button>
        <el-dialog class="add-category-attribute-dialog" v-model="dialogAddCategoryVisible" title="Shipping address"></el-dialog> -->
      </el-tooltip>
    </div>

    <el-collapse accordion>
      <el-collapse-item v-for="cat of Categories" :key="cat" :title="cat.name">
      <!-- <el-collapse-item v-for="cat of Categories" :key="cat">
        <template #title>
          <editable-text
            :content="cat.name"
            :isEditing="cat.isEditing"
            slot-scope="cat"
          >
            {{ cat.name }}
          </editable-text>
        </template> -->
        <el-table
          :data="cat.attributes"
          :header-cell-style="{
            'background-color': '#ffffff',
            'letter-spacing': '1px',
            color: '#214353',
            opacity: '1',
            height: 'fit-content',
          }"
          :row-style="{
            background: '#ffffff 0% 0% no-repeat padding-box',
            border: '1px solid #F8F8F8',
            'border-radius': '5px',
            opacity: '1',
            'text-align': 'left',
            'letter-spacing': '0.9px',
            color: '#214353',
            opacity: '1',
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

          <!-- <el-table-column fixed="right" label="Options" width="120"> -->
          <el-table-column fixed="right" width="120" align="center" header-align="center">
            <template #header>
              <el-button
                @click.native="addAttribute(cat)"
                :disabled="ctxNode == false || isEditing"
                icon="el-icon-plus"
                circle
                class="el-button-add"
              ></el-button>
            </template>
            <div slot-scope="scope">
              <el-tooltip
                :content="$t('spinal-twin.AttributeEdit') + scope.row.label"
              >
                <el-button
                  @click.native="editAttribute(scope.row, cat)"
                  :icon="
                    scope.row.isEditing ? 'el-icon-success' : 'el-icon-edit'
                  "
                  :disabled="!scope.row.isEditing && isEditing"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('Remove attribute ') + scope.row.label">
                <el-popconfirm
                  @confirm="delAttribute(cat, scope.row)"
                  :title="$t('spinal-twin.DeleteConfirm')"
                >
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
      </el-collapse-item>
    </el-collapse>
    <div v-for="p of parents" :key="p">
      <el-divider class="parent-attributes-divider">
        <span class="parent-attributes-divider-text">{{
          p.name + "'s Attributes"
        }}</span>
      </el-divider>
      <el-collapse accordion>
        <el-collapse-item
          v-for="cat of p.categories"
          :key="cat"
          :title="cat.name"
        >
          <el-table
            :data="cat.attributes"
            :header-cell-style="{
              'background-color': '#ffffff',
              'text-align': 'left',
              'letter-spacing': '1px',
              color: '#214353',
              opacity: '1',
              height: 'fit-content',
            }"
            :row-style="{
              background: '#ffffff 0% 0% no-repeat padding-box',
              border: '1px solid #F8F8F8',
              'border-radius': '5px',
              opacity: '1',
              'text-align': 'left',
              'letter-spacing': '0.9px',
              color: '#214353',
              opacity: '1',
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

            <!-- <el-table-column fixed="right" label="Options" width="120">
            <div slot-scope="scope">
              <el-tooltip
                :content="$t('spinal-twin.AttributeEdit') + scope.row.label"
              >
                <el-button
                  @click.native="editAttribute(scope.row, cat)"
                  :icon="
                    scope.row.isEditing ? 'el-icon-success' : 'el-icon-edit'
                  "
                  :disabled="!scope.row.isEditing && isEditing"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('Remove attribute ') + scope.row.label">
                <el-popconfirm
                  @confirm="delAttribute(cat.row, scope.row)"
                  :title="$t('spinal-twin.DeleteConfirm')"
                >
                  <el-button
                    icon="el-icon-delete"
                    circle
                    slot="reference"
                    class="el-button-delete"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </div>
          </el-table-column> -->
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>


    <el-dialog
      append-to-body
      title="Add a Category"
      :visible.sync="dialogAddCategoryVisible"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <!-- <span id="123456">This is a message</span> -->
      <el-input
            v-model="newCategoryName"
            autosize
            placeholder="Name of the Category"
          ></el-input>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogAddCategoryVisible = false">Cancel</el-button> -->
        <el-button type="primary" @click="addCategory()"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { FileSystem } from "spinal-core-connectorjs_type";

import EditableText from "../../../compoments/EditableText.vue";
import { spinalIO } from "../../../services/spinalIO";

import { EventBus } from "../../../services/event";

// import { ref } from 'vue'

export default {
  name: "Attributes",
  components: { EditableText },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      dialogAddCategoryVisible: false,
      ctxNode: false,
      Categories: [],
      isEditing: false,
      parents: [],
      // showParents: false,
      // dialogAddCategoryVisible: false,
      newCategoryName: "",
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          this.update(newProp.view.serverId);
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
    EventBus.$on("click-on_spinal-twin.hasCategoryAttributes", () =>
      this.update(this.Properties.view.serverId)
    );
  },

  methods: {
    handleCloseDialog() {
      this.newCategoryName = "";
      this.dialogAddCategoryVisible = false;
    },
    async update(id) {
      this.ctxNode = FileSystem._objects[id];
      this.parents = [];
      this.Categories = [];
      // this.showParents = false;
      let Categories = await serviceDocumentation.getCategory(this.ctxNode);
      for (const category of Categories) {
        let attrs = [];
        let attributes = await serviceDocumentation.getAttributesByCategory(
          this.ctxNode,
          category.nameCat
        );
        for (const attribute of attributes) {
          attrs.push({
            label: attribute.label.get(),
            value: attribute.value.get(),
            type: attribute.type.get(),
            unit: attribute.unit.get(),
            isEditing: false,
            serverId: attribute._server_id,
          });

          // this.Categories.push(cat);
        }
        this.Categories.push({
          cat: category,
          name: category.nameCat,
          attributes: attrs,
          isEditing: false,
        });
      }
      let parents = await this.ctxNode.getParents();
      for (let p of parents) {
        let Categories = await serviceDocumentation.getCategory(p);
        let cats = [];
        for (const category of Categories) {
          let attributes = await serviceDocumentation.getAttributesByCategory(
            p,
            category.nameCat
          );
          let attrs = [];
          for (const attribute of attributes) {
            attrs.push({
              label: attribute.label.get(),
              value: attribute.value.get(),
              type: attribute.type.get(),
              unit: attribute.unit.get(),
              isEditing: false,
              serverId: attribute._server_id,
            });
          }
          cats.push({
            cat: category,
            name: category.nameCat,
            attributes: attrs,
            isEditing: false,
          });
        }
        if (cats.length != 0) {
          this.parents.push({
            name: p.getName().get(),
            categories: cats,
          });
        }
      }
    },

    async addAttribute(category) {
      const node = await serviceDocumentation.addAttributeByCategory(
        this.ctxNode,
        category.cat,
        "newAttribute",
        "newValue",
        "newType",
        "newUnit"
      );
      await spinalIO.waitNodeReady(node);
      category.attributes.push({
        label: "newAttribute",
        value: "newValue",
        type: "newType",
        unit: "newUnit",
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
      if(this.newCategoryName != ""){
        const category = await serviceDocumentation.addCategoryAttribute(
        this.ctxNode,
        this.newCategoryName
      );
      this.Categories.push({
        cat: category,
        name: this.newCategoryName,
        attributes: [],
      });
      }
      this.dialogAddCategoryVisible = false;
      this.newCategoryName = "";
      
      
      // this.isEditing = true;
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
      if (!url.startsWith("http")) {
        return "http://" + url;
      }
      return url;
    },
    OpenDialog() {
      this.dialogAddCategoryVisible = true;
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
.parent-attributes-divider {
  color: #58727e;
}
.parent-attributes-divider-text {
  color: #58727e;
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200;
}
/* .el-button-add{
  background-color: #14202C;
  color: #F9F9F9;
} */
/* .el-button-delete{
  color: #EF5F32;
  border-color: #EF5F32;
} */
.add-category-attribute-dialog {
  z-index: 2000;
}
.category-attribute-component{
  max-height: 70vh;
  overflow: scroll;
}
</style>

