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
  <div class="ticket-center">
    <SpinalBreadcrumb :view-key="viewKey"> </SpinalBreadcrumb>
    <!-- <TicketDetails> </TicketDetails> -->
    <tab-manager :tabsprop="tabs" />
  </div>
</template>

<script>
// Script & tools
// import { ViewManager } from "../../services/ViewManager/ViewManager";

// Generic components
import SpinalBreadcrumb from '../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue';
import TabManager from '../../compoments/TabManager/TabManager.vue';

// Specific components
import Explorer from './components/Explorer.vue';
import Visualizer from './components/Visualizer.vue';
import TicketDetails from './components/TicketDetails.vue';

const VIEW_KEY = 'Ticket Center';

// Component exports
export default {
  name: 'TicketCenter',
  components: {
    SpinalBreadcrumb,
    TabManager,
    TicketDetails,
  },
  data() {
    return {
      viewKey: VIEW_KEY,
      tabs: [
        {
          name: 'Explorer',
          content: Explorer,
          props: {
            viewKey: VIEW_KEY,
            tabManager: TabManager,
          },
          optional: false,
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
.ticket-center {
  margin: 5px 5px 5px 5px;
  overflow-x: auto;
  overflow-y: hidden;
}
.tab-manager {
  margin: 5px auto;
  height: calc(100% - 55px);
  overflow: auto;
  border-radius: 5px;
}
</style>
