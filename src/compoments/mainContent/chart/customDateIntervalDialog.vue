<!--
Copyright 2018 SpinalCom - www.spinalcom.com

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
  <md-dialog
    class="endpoint-chart-viewer-panel-dialog-custom-interval"
    :md-active.sync="isOpenComputed"
    :md-close-on-esc="true"
    :md-click-outside-to-close="true"
    :md-closed="onClose"
  >
    <md-dialog-content class="md-scrollbar">
      <div class="md-layout">
        <div
          class="endpoint-chart-viewer-panel-dialog-custom-interval-calendar-container"
        >
          <h4> Start Date </h4>

          <b-form-datepicker
            class="mb-3"
            v-model="startPickerCompu"
            right
            locale="en-US"
            aria-controls="example-input"
          >
          </b-form-datepicker>

          <h4> End Date </h4>

          <b-form-datepicker
            v-model="endPickerCompu"
            right
            locale="en-US"
            aria-controls="example-input"
          >
          </b-form-datepicker>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="closeDialog(false)"
        >Close</md-button
      >
      <md-button
        class="md-primary"
        :disabled="start === null || end === null"
        @click="closeDialog(true)"
        >Valid
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import moment from 'moment';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
export default {
  name: 'customDateIntervalDialog',
  props: ['isOpen', 'dateAvailable'],
  components: {
    VueCtkDateTimePicker,
  },
  data() {
    const today = new Date();
    today.setUTCHours(23, 59, 59);
    return {
      hint: 'Select the starting point to show',
      format: 'YYYY-MM-DD HH:mm:ss',
      today: today.toISOString(),
      start: null,
      end: null,
      valid: false,
      value: null,
    };
  },
  computed: {
    pickerModel: {
      // YYYY-MM-DD
      get() {
        const value = (this.value || '').trim();
        if (
          /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4}$/.test(value)
        ) {
          return value.split('-').reverse().join('-');
        }
        return '';
      },
      set(val) {
        if (!val) {
          this.value = '';
        }
        this.value = val.split('-').reverse().join('-');
      },
    },
    startCompu: {
      get() {
        if (this.start === null) return 'Other';
        const data = new Date(this.start.valueOf());
        data.setUTCHours(0, 0, 0, 0);
        for (let idx = 0; idx < this.dateAvailableCompu.length; idx++) {
          const element = this.dateAvailableCompu[idx];
          if (data.getTime() === element) {
            return data.toISOString();
          }
        }
        return 'Other';
      },
      set(value) {
        if (value === 'Other') return;
        this.start = moment.utc(value);
      },
    },
    startPickerCompu: {
      get() {
        if (this.start === null) {
          return null;
        } else {
          return new Date(this.start).toISOString();
        }
      },
      set(value) {
        this.start = moment.utc(value, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    endCompu: {
      get() {
        if (this.end === null) return 'Other';
        const data = new Date(this.end.valueOf());
        data.setUTCHours(0.0, 0, 0);
        for (let idx = 0; idx < this.dateAvailableCompu.length; idx++) {
          const element = this.dateAvailableCompu[idx];
          if (data.getTime() === element) {
            return this.selectDateStart(data);
          }
        }
        return 'Other';
      },
      set(value) {
        if (value === 'Other') return;
        this.end = moment.utc(value).hours(23).minutes(59).second(59);
      },
    },
    endPickerCompu: {
      get() {
        if (this.end === null) {
          return null;
        } else {
          return new Date(this.end).toISOString();
        }
      },
      set(value) {
        this.end = moment.utc(value + ' 23-59-59', 'YYYY-MM-DD HH:mm:ss');
      },
    },
    dateAvailableCompu() {
      return this.dateAvailable || [];
    },
    isOpenComputed: {
      get() {
        return this.isOpen;
      },
      set(value) {
        if (value === false) {
          this.onClose();
        }
      },
    },
    endStart() {
      if (this.start === null) return null;
      const startDate = new Date(this.start);
      startDate.setUTCHours(-1, 0, 0, 0);
      return startDate.toISOString();
    },
  },
  methods: {
    selectDateStart(date) {
      let m_date = new Date(date);
      return new Date(m_date.setUTCHours(0, 0, 0, 0)).toISOString();
    },
    selectDateEnd(date) {
      let m_date = new Date(date);
      return new Date(m_date.setUTCHours(23, 59, 59, 999)).toISOString();
    },
    formatDate(date) {
      return new Date(date).toDateString();
    },
    closeDialog(valid) {
      this.valid = valid;
      this.isOpenComputed = false;
    },
    onClose() {
      let valid = this.valid;
      if (this.end === null || this.start === null) {
        valid = false;
      }
      this.valid = false;
      this.$emit('closeDialog', {
        start: this.start,
        end: this.end,
        valid: valid,
      });
    },
  },
};
</script>

<style>
.endpoint-chart-viewer-panel-dialog-custom-interval {
  width: 100vw;
}

.endpoint-chart-viewer-panel-dialog-custom-interval > .md-dialog-container {
  max-height: 80vh;
}

.endpoint-chart-viewer-panel-dialog-custom-interval
  > .md-dialog-container
  > .md-dialog-content.md-scrollbar::-webkit-scrollbar {
  background-color: #121212;
}

.endpoint-chart-viewer-panel-dialog-custom-interval
  > .md-dialog-container
  > .md-dialog-content.md-scrollbar::-webkit-scrollbar-thumb {
  background-color: #737374;
}

.endpoint-chart-viewer-panel-dialog-custom-interval-calendar-container {
  border: 5px double #cbcbcb;
  margin: auto;
  min-height: 400px;
  width: 500px;
  text-align: center;
}

.endpoint-chart-viewer-panel-dialog-custom-interval-calendar-container > h4 {
  text-align: center;
}

.endpoint-chart-viewer-panel-dialog-custom-interval .md-field {
  padding-left: 8px;
}

.endpoint-chart-viewer-panel-dialog-custom-interval .md-field label {
  padding-left: 8px;
}

.endpoint-chart-viewer-panel-dialog-custom-interval .mb-3 {
  padding-bottom: 150px;
}
</style>
