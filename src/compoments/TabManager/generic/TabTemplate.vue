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
      Component Header
    </el-header>
    <el-main>
      Component Content
    </el-main>
  </el-container>
</template>

<script>
// imports

export default {
  name: "TabTemplate",
  components: {  },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      // properties
    };
  },

  watch:
  {
    Properties:
    {
      handler: async function(oldProp, newProp)
      {
        if (newProp.view.serverId != 0)
        {
          await this.update(newProp.view.serverId);
        }
        else
        {
          this.ctxNode = false;
        }
      },
      deep: true,
    }
  },

  async mounted() {
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async update(id)
    {
      // update tab infos from current node
    },
  
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>