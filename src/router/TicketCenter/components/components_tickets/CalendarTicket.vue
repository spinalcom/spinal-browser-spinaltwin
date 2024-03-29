<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="container">
    <div class="createEvent">
      <Create-Event v-bind:nodeId="nodeId" @reload="updateDate"></Create-Event>
    </div>
    <div class="spinal-space-table-content spinal-scrollbar">
      <vueCal
        class="calendar_container vuecal--full-height-delete"
        ref="vuecal"
        :time="true"
        :dblclick-to-navigate="true"
        events-count-on-year-view
        events-on-month-view="short"
        default-view="month"
        active-view="month"
        :editable-events="{
          title: false,
          drag: false,
          resize: false,
          delete: true,
          create: false,
        }"
        :events="calendrier"
      ></vueCal>
    </div>
  </div>
</template>
<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileSystem } from "spinal-core-connectorjs_type";
import { SpinalEventService } from "spinal-env-viewer-task-service";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import CreateEvent from "./createEventTicket";
import moment from "moment";

export default {
  name: "Calendar",
  components: { CreateEvent, VueCal },
  props: ["nodeId"],

  data() {
    return {
      nodeInfo: { selectedNode: FileSystem._objects[this.nodeId] },
      calendrier: [],
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: FileSystem._objects[this.nodeId],
      };
    },
  },
  async mounted() {
    await this.loadCalendar();
  },
  methods: {
    getEvents(Id) {
      return SpinalGraphService.getChildren(Id, ["hasEvent"]);
    },
    async updateDate() {
      this.calendrier = await this.getEvents(
        this.nodeInfo.selectedNode.getId().get()
      );
    },
    async loadCalendar() {
      this.calendrier = await SpinalEventService.getEvents(
        this.nodeInfo.selectedNode.getId().get()
      ).then((rest) => {
        return rest.map((el) => {
          const event = el.get();
          return {
            title: event.name,
            start: this._formatDate(event.startDate),
            end: this._formatDate(event.endDate),
            class: event.groupId,
            // backgroundColor : group && group.color
          };
        });
      });
    },
    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
  },
  beforeDestroy() {},
};
</script>

<style>
.containe {
  display: flex;
  flex-direction: column;
}
.createEvent {
  width: 100%;
  margin-bottom: 3px;
}
</style>

<style>
.vuecal--month-view .vuecal__cell {
  height: 80px;
}
.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}
.vuecal--month-view .vuecal__cell-date {
  padding: 4px;
}
.vuecal--month-view .vuecal__no-event {
  display: none;
}
</style>

<style>
/** 
///////////////////////////////////////
//              CSS ADDED            //
///////////////////////////////////////
*/
.event_container .addIconFab .md-ripple,
.event_container .headerButtons .md-ripple {
  padding: 0px;
}
.vuecal__event {
  width: 90%;
  height: auto;
  margin: auto;
  cursor: pointer;
  margin-top: 5px;
  color: rgb(70, 42, 196);
  padding: 3px;
  /*padding: 5px;
  text-align: center; */
}
.vuecal__flex.vuecal__weekdays-headings {
  padding-bottom: 10px;
}
.vuecal__flex.vuecal__menu {
  background-color: #9cbdf6 !important;
}
.vuecal__title-bar {
  background-color: #5d85c58c !important;
}
/* .vuecal__cell--today,
.vuecal__cell--current {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
} */
/** 
///////////////////////////////////////
//              CSS ADDED            //
///////////////////////////////////////
*/
.vuecal__weekdays-headings {
  border-bottom: 1px solid #ddd;
  margin-bottom: -1px;
}
.vuecal--view-with-time .vuecal__weekdays-headings,
.vuecal--week-numbers .vuecal__weekdays-headings {
  padding-left: 3em;
}
.vuecal--view-with-time.vuecal--twelve-hour .vuecal__weekdays-headings {
  font-size: 0.9em;
  padding-left: 4em;
}
.vuecal--overflow-x.vuecal--view-with-time .vuecal__weekdays-headings {
  padding-left: 0;
}
.vuecal__heading {
  width: 100%;
  height: 2.8em;
  font-weight: 400;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.vuecal__heading > .vuecal__flex {
  width: 100%;
  height: 100%;
  -webkit-box-align: initial !important;
  -ms-flex-align: initial !important;
  align-items: normal !important;
}
.vuecal--sticky-split-labels .vuecal__heading {
  height: 3.4em;
}
.vuecal--day-view .vuecal__heading,
.vuecal--month-view .vuecal__heading,
.vuecal--week-view .vuecal__heading {
  width: 14.2857%;
}
.vuecal--hide-weekends.vuecal--day-view .vuecal__heading,
.vuecal--hide-weekends.vuecal--month-view .vuecal__heading,
.vuecal--hide-weekends.vuecal--week-view .vuecal__heading,
.vuecal--years-view .vuecal__heading {
  width: 20%;
}
.vuecal--year-view .vuecal__heading {
  width: 33.33%;
}
.vuecal__heading .weekday-label {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.vuecal--small .vuecal__heading .small,
.vuecal--xsmall .vuecal__heading .xsmall {
  display: block;
}
.vuecal--small .vuecal__heading .full,
.vuecal--small .vuecal__heading .xsmall,
.vuecal--xsmall .vuecal__heading .full,
.vuecal--xsmall .vuecal__heading .small,
.vuecal__heading .small,
.vuecal__heading .xsmall {
  display: none;
}
.vuecal .vuecal__split-days-headers {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .vuecal__heading {
    line-height: 1.2;
  }
  .vuecal--small .vuecal__heading .small,
  .vuecal--xsmall .vuecal__heading .xsmall,
  .vuecal__heading .small {
    display: block;
  }
  .vuecal--small .vuecal__heading .full,
  .vuecal--small .vuecal__heading .xsmall,
  .vuecal--xsmall .vuecal__heading .full,
  .vuecal--xsmall .vuecal__heading .small,
  .vuecal__heading .full,
  .vuecal__heading .xsmall {
    display: none;
  }
  .vuecal--overflow-x .vuecal__heading .full,
  .vuecal--small.vuecal--overflow-x .vuecal__heading .small,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .xsmall {
    display: block;
  }
  .vuecal--overflow-x .vuecal__heading .small,
  .vuecal--overflow-x .vuecal__heading .xsmall,
  .vuecal--small.vuecal--overflow-x .vuecal__heading .full,
  .vuecal--small.vuecal--overflow-x .vuecal__heading .xsmall,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .full,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .small {
    display: none;
  }
}
@media screen and (max-width: 450px) {
  .vuecal--small .vuecal__heading .xsmall,
  .vuecal--xsmall .vuecal__heading .xsmall,
  .vuecal__heading .xsmall {
    display: block;
  }
  .vuecal--small .vuecal__heading .full,
  .vuecal--small .vuecal__heading .small,
  .vuecal--xsmall .vuecal__heading .full,
  .vuecal--xsmall .vuecal__heading .small,
  .vuecal__heading .full,
  .vuecal__heading .small {
    display: none;
  }
  .vuecal--small.vuecal--overflow-x .vuecal__heading .small,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .xsmall {
    display: block;
  }
  .vuecal--small.vuecal--overflow-x .vuecal__heading .full,
  .vuecal--small.vuecal--overflow-x .vuecal__heading .xsmall,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .full,
  .vuecal--xsmall.vuecal--overflow-x .vuecal__heading .small {
    display: none;
  }
}
.vuecal__header button {
  outline: none;
  font-family: inherit;
}
.vuecal__menu {
  padding: 0;
  margin: 0;
  list-style-type: none;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.02);
}
.vuecal__view-btn {
  background: none;
  border: none;
  padding: 0.3em 1em;
  height: 2.2em;
  font-size: 1.3em;
  border-bottom: 0 solid currentColor;
  cursor: pointer;
  color: inherit;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.vuecal__view-btn--active {
  border-bottom-width: 2px;
  background: hsla(0, 0%, 100%, 0.15);
}
.vuecal__title-bar {
  background-color: rgba(0, 0, 0, 0.1);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 1.4em;
  line-height: 1.3;
  min-height: 2em;
}
.vuecal--xsmall .vuecal__title-bar {
  font-size: 1.3em;
}
.vuecal__title {
  position: relative;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.vuecal__title button {
  cursor: pointer;
  background: none;
  border: none;
}
.vuecal__title button.slide-fade--left-leave-active,
.vuecal__title button.slide-fade--right-leave-active {
  width: 100%;
}
.vuecal__today-btn {
  position: relative;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 0.8em;
  background: none;
  border: none;
}
.vuecal__today-btn span.default {
  font-size: 0.8em;
  padding: 3px 6px;
  text-transform: uppercase;
  cursor: pointer;
}
.vuecal__arrow {
  cursor: pointer;
  position: relative;
  z-index: 1;
  background: none;
  border: none;
  white-space: nowrap;
}
.vuecal__arrow--prev {
  margin-left: 0.6em;
}
.vuecal__arrow--next {
  margin-right: 0.6em;
}
.vuecal__arrow i.angle {
  display: inline-block;
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  padding: 0.25em;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.vuecal__arrow--prev i.angle {
  border-width: 2px 0 0 2px;
}
.vuecal__arrow--highlighted,
.vuecal__today-btn--highlighted,
.vuecal__view-btn--highlighted {
  position: relative;
  background-color: rgba(0, 0, 0, 0.04);
}
.vuecal__arrow--highlighted *,
.vuecal__today-btn--highlighted *,
.vuecal__view-btn--highlighted * {
  pointer-events: none;
}
.vuecal__arrow--highlighted:after,
.vuecal__arrow--highlighted:before,
.vuecal__today-btn--highlighted:after,
.vuecal__today-btn--highlighted:before,
.vuecal__view-btn--highlighted:after,
.vuecal__view-btn--highlighted:before {
  content: "";
  background-color: inherit;
  -webkit-animation: sonar 0.8s ease-out infinite;
  animation: sonar 0.8s ease-out infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
}
.vuecal__arrow--highlighted:before,
.vuecal__today-btn--highlighted:before,
.vuecal__view-btn--highlighted:before {
  width: 3em;
  height: 3em;
  border-radius: 3em;
  margin-top: -1.5em;
  margin-left: -1.5em;
}
.vuecal__arrow--highlighted:after,
.vuecal__today-btn--highlighted:after,
.vuecal__view-btn--highlighted:after {
  -webkit-animation-duration: 1.5s;
  animation-duration: 1.5s;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
  width: 2.6em;
  height: 2.6em;
  border-radius: 2.6em;
  margin-top: -1.3em;
  margin-left: -1.3em;
}
@-webkit-keyframes sonar {
  0%,
  20% {
    opacity: 1;
  }
  to {
    -webkit-transform: scale(2.5);
    transform: scale(2.5);
    opacity: 0;
  }
}
@keyframes sonar {
  0%,
  20% {
    opacity: 1;
  }
  to {
    -webkit-transform: scale(2.5);
    transform: scale(2.5);
    opacity: 0;
  }
}
@media screen and (max-width: 450px) {
  .vuecal__title {
    font-size: 0.9em;
  }
  .vuecal__view-btn {
    padding-left: 0.6em;
    padding-right: 0.6em;
  }
}
@media screen and (max-width: 350px) {
  .vuecal__view-btn {
    font-size: 1.1em;
  }
}
.vuecal__event {
  /* color: #666; */
  font-weight: bold;
  background-color: hsla(0, 0%, 97.3%, 0.8);
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 0;
  /* width: 100%; */
  z-index: 1;
  -webkit-transition: left 0.3s, width 0.3s, -webkit-box-shadow 0.3s;
  transition: left 0.3s, width 0.3s, -webkit-box-shadow 0.3s;
  transition: box-shadow 0.3s, left 0.3s, width 0.3s;
  transition: box-shadow 0.3s, left 0.3s, width 0.3s, -webkit-box-shadow 0.3s;
  overflow: hidden;
}
.vuecal--no-time .vuecal__event {
  min-height: 8px;
}
.vuecal:not(.vuecal--dragging-event) .vuecal__event:hover {
  z-index: 2;
}
.vuecal__cell .vuecal__event * {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
.vuecal--view-with-time .vuecal__event:not(.vuecal__event--all-day) {
  position: absolute;
}
.vuecal--view-with-time .vuecal__bg .vuecal__event--all-day {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.6;
  width: auto;
  right: 0;
}
.vuecal--view-with-time .vuecal__all-day .vuecal__event--all-day {
  position: relative;
  left: 0;
}
.vuecal__event--background {
  z-index: 0;
}
.vuecal__event--focus,
.vuecal__event:focus {
  -webkit-box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
  z-index: 3;
  outline: none;
}
.vuecal__event.vuecal__event--dragging {
  opacity: 0.7;
}
.vuecal__event.vuecal__event--static {
  opacity: 0;
  -webkit-transition: opacity 0.1s;
  transition: opacity 0.1s;
}
@-moz-document url-prefix() {
  .vuecal__event.vuecal__event--dragging {
    opacity: 1;
  }
}
.vuecal__event-resize-handle {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1em;
  background-color: hsla(0, 0%, 100%, 0.3);
  opacity: 0;
  -webkit-transform: translateY(110%);
  transform: translateY(110%);
  -webkit-transition: 0.3s;
  transition: 0.3s;
  cursor: ns-resize;
}
.vuecal__event--focus .vuecal__event-resize-handle,
.vuecal__event--resizing .vuecal__event-resize-handle,
.vuecal__event:focus .vuecal__event-resize-handle,
.vuecal__event:hover .vuecal__event-resize-handle {
  opacity: 1;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}
.vuecal__event--dragging .vuecal__event-resize-handle {
  display: none;
}
.vuecal__event-delete {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 1.4em;
  line-height: 1.4em;
  background-color: rgba(221, 51, 51, 0.85);
  color: #fff;
  z-index: 0;
  cursor: pointer;
  -webkit-transform: translateY(-110%);
  transform: translateY(-110%);
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.vuecal__event .vuecal__event-delete {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vuecal--full-height-delete .vuecal__event-delete {
  height: auto;
  bottom: 0;
}
.vuecal--full-height-delete .vuecal__event-delete:before {
  content: "";
  width: 1.7em;
  height: 1.8em;
  display: block;
  background-image: url('data:image/svg+xml;utf8,<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zm5 14.1c.2 0 .2.2.2.2l-.1.3-1 1-.3.1h-.2L12 13.5l-3.5 3.6h-.3-.3l-1-1v-.4-.2l3.6-3.6-3.6-3.5A.4.4 0 017 8l1-1 .3-.2c.1 0 .2 0 .2.2l3.6 3.5L15.6 7l.2-.2c.1 0 .2 0 .3.2l1 1v.5L13.5 12z" fill="%23fff" opacity=".9"/></svg>');
}
.vuecal__event--deletable .vuecal__event-delete {
  -webkit-transform: translateY(0);
  transform: translateY(0);
  z-index: 1;
}
.vuecal__event--deletable.vuecal__event--dragging .vuecal__event-delete {
  opacity: 0;
  -webkit-transition: none;
  transition: none;
}
.vuecal--month-view .vuecal__event-title {
  font-size: 0.85em;
}
.vuecal--short-events .vuecal__event-title {
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 3px;
}
.vuecal__event-content,
.vuecal__event-title {
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
.vuecal__event-title--edit {
  border-bottom: 1px solid transparent;
  text-align: center;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  color: inherit;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M442 150l-39 39-80-80 39-39q6-6 15-6t15 6l50 50q6 6 6 15t-6 15zM64 368l236-236 80 80-236 236H64v-80z" fill="%23000" opacity=".4"/></svg>');
  background-repeat: no-repeat;
  background-position: 120% 0.15em;
  background-size: 0.4em;
  outline: none;
  width: 100%;
}
.vuecal__event-title--edit:focus,
.vuecal__event-title--edit:hover {
  border-color: rgba(0, 0, 0, 0.4);
  background-position: 99% 0.15em;
  background-size: 1.2em;
}
.vuecal__cell {
  position: relative;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
  -webkit-transition: background-color 0.15s ease-in-out;
  transition: background-color 0.15s ease-in-out;
}
.vuecal__cells.month-view .vuecal__cell,
.vuecal__cells.week-view .vuecal__cell {
  width: 14.2857%;
}
.vuecal--hide-weekends .vuecal__cells.month-view .vuecal__cell,
.vuecal--hide-weekends .vuecal__cells.week-view .vuecal__cell,
.vuecal__cells.years-view .vuecal__cell {
  width: 20%;
}
.vuecal__cells.year-view .vuecal__cell {
  width: 33.33%;
}
.vuecal__cells.day-view .vuecal__cell {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.vuecal--overflow-x.vuecal--day-view .vuecal__cell {
  width: auto;
}
.vuecal--click-to-navigate .vuecal__cell:not(.vuecal__cell--disabled) {
  cursor: pointer;
}
.vuecal--day-view.vuecal--no-time .vuecal__cell:not(.vuecal__cell--has-splits),
.vuecal--view-with-time .vuecal__cell,
.vuecal--week-view.vuecal--no-time
  .vuecal__cell:not(.vuecal__cell--has-splits) {
  display: block;
}
.vuecal__cell.vuecal__cell--has-splits {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.vuecal__cell:before {
  content: "";
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: -1px;
  bottom: -1px;
  border: 1px solid hsla(0, 0%, 76.9%, 0.25);
}
.vuecal--overflow-x.vuecal--day-view .vuecal__cell:before {
  bottom: 0;
}
.vuecal__cell--current,
.vuecal__cell--today {
  background-color: rgba(240, 240, 255, 0.4);
  z-index: 1;
}
.vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
  z-index: 2;
}
.vuecal--day-view .vuecal__cell--selected {
  background: none;
}
.vuecal__cell--out-of-scope {
  color: rgba(0, 0, 0, 0.25);
}
.vuecal__cell--disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
.vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal__cell-split.vuecal__cell-split--highlighted {
  background-color: rgba(0, 0, 0, 0.04);
  -webkit-transition-duration: 5ms;
  transition-duration: 5ms;
}
.vuecal__cell-content {
  position: relative;
  width: 100%;
  height: 100%;
  outline: none;
}
.vuecal--month-view .vuecal__cell-content,
.vuecal--year-view .vuecal__cell-content,
.vuecal--years-view .vuecal__cell-content {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.vuecal__cell-split {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 100%;
  position: relative;
  -webkit-transition: background-color 0.15s ease-in-out;
  transition: background-color 0.15s ease-in-out;
}
.vuecal__cell-events {
  width: 100%;
}
.vuecal__cell-events-count {
  left: 50%;
  top: 65%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  min-width: 12px;
  height: 12px;
  line-height: 12px;
  padding: 0 3px;
  background: #999;
  color: #fff;
  border-radius: 12px;
  font-size: 10px;
}
.vuecal__cell-events-count,
.vuecal__cell .vuecal__special-hours {
  position: absolute;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.vuecal__cell .vuecal__special-hours {
  left: 0;
  right: 0;
}
.vuecal--overflow-x.vuecal--week-view .vuecal__cell,
.vuecal__cell-split {
  overflow: hidden;
}
.vuecal__no-event {
  padding-top: 1em;
  color: #aaa;
  justify-self: flex-start;
  margin-bottom: auto;
}
.vuecal__all-day .vuecal__no-event {
  display: none;
}
.vuecal__now-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 0;
  color: red;
  border-top: 1px solid currentColor;
  opacity: 0.6;
  z-index: 1;
}
.vuecal__now-line:before {
  content: "";
  position: absolute;
  top: -6px;
  left: 0;
  border: 5px solid transparent;
  border-left-color: currentColor;
}
.vuecal {
  height: 100%;
  -webkit-box-shadow: 0 0 0 1px inset rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.vuecal *,
.vuecal--has-touch :not(.vuecal__event-title--edit) {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vuecal--has-touch :not(.vuecal__event-title--edit) {
  -webkit-touch-callout: none;
}
.vuecal .clickable {
  cursor: pointer;
}
.vuecal--drag-creating-event,
.vuecal--resizing-event {
  cursor: ns-resize;
}
.vuecal--dragging-event {
  cursor: move;
  cursor: -webkit-grabbing;
  cursor: grabbing;
}
.vuecal .dragging-helper {
  position: absolute;
  width: 60px;
  height: 40px;
  background: rgba(138, 190, 230, 0.8);
  border: 1px solid #61a9e0;
  z-index: 10;
}
.vuecal--xsmall {
  font-size: 0.9em;
}
.vuecal__flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}
.vuecal__flex[column] {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
.vuecal__flex[column],
.vuecal__flex[grow] {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}
.vuecal__flex[grow] {
  width: 100%;
}
.vuecal__flex[wrap] {
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.vuecal__split-days-headers.slide-fade--right-leave-active {
  display: none;
}
.vuecal--week-numbers.vuecal--month-view .vuecal__split-days-headers {
  margin-left: 3em;
}
.vuecal--day-view:not(.vuecal--overflow-x) .vuecal__split-days-headers {
  margin-left: 3em;
  height: 2.2em;
}
.vuecal--day-view.vuecal--twelve-hour:not(.vuecal--overflow-x)
  .vuecal__split-days-headers {
  margin-left: 4em;
}
.vuecal__split-days-headers .day-split-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100%;
}
.vuecal__split-days-headers
  .vuecal--day-view.vuecal--overflow-x.vuecal--sticky-split-labels
  .day-split-header {
  height: 1.5em;
}
.vuecal__body {
  position: relative;
  overflow: hidden;
}
.vuecal__all-day {
  min-height: 1.7em;
  margin-bottom: -1px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.vuecal__all-day-text {
  width: 3em;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #999;
  padding-right: 2px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  border-bottom: 1px solid #ddd;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
.vuecal__all-day-text span {
  font-size: 0.85em;
  text-align: right;
  line-height: 1.1;
}
.vuecal--twelve-hour .vuecal__all-day > span {
  width: 4em;
}
.vuecal__bg {
  overflow: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 60px;
  position: relative;
  width: 100%;
  margin-bottom: 1px;
}
.vuecal--no-time .vuecal__bg {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  overflow: auto;
}
.vuecal__week-numbers {
  width: 3em;
  -ms-flex-negative: 0 !important;
  flex-shrink: 0 !important;
}
.vuecal__week-numbers .vuecal__week-number-cell {
  opacity: 0.4;
  font-size: 0.9em;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.vuecal__scrollbar-check {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
  visibility: hidden;
  z-index: -1;
}
.vuecal__scrollbar-check div {
  height: 120%;
}
.vuecal__time-column {
  width: 3em;
  height: 100%;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.vuecal--twelve-hour .vuecal__time-column {
  width: 4em;
  font-size: 0.9em;
}
.vuecal--overflow-x.vuecal--week-view .vuecal__time-column {
  margin-top: 2.8em;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}
.vuecal--overflow-x.vuecal--week-view.vuecal--sticky-split-labels
  .vuecal__time-column {
  margin-top: 3.4em;
}
.vuecal--overflow-x.vuecal--day-view.vuecal--sticky-split-labels
  .vuecal__time-column {
  margin-top: 1.5em;
}
.vuecal__time-column .vuecal__time-cell {
  color: #999;
  text-align: right;
  padding-right: 2px;
  font-size: 0.9em;
}
.vuecal__time-column .vuecal__time-cell-line:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid hsla(0, 0%, 76.9%, 0.3);
}
.vuecal__cells {
  margin: 0 1px 1px 0;
}
.vuecal--overflow-x.vuecal--day-view .vuecal__cells {
  margin: 0;
}
.vuecal--events-on-month-view.vuecal--short-events .vuecal__cells {
  width: 99.9%;
}
.vuecal--overflow-x.vuecal--day-view .vuecal__cells,
.vuecal--overflow-x.vuecal--week-view .vuecal__cells {
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  overflow: auto;
}
.slide-fade--left-enter-active,
.slide-fade--left-leave-active,
.slide-fade--right-enter-active,
.slide-fade--right-leave-active {
  -webkit-transition: 0.25s ease-out;
  transition: 0.25s ease-out;
}
.slide-fade--left-enter,
.slide-fade--right-leave-to {
  -webkit-transform: translateX(-15px);
  transform: translateX(-15px);
  opacity: 0;
}
.slide-fade--left-leave-to,
.slide-fade--right-enter {
  -webkit-transform: translateX(15px);
  transform: translateX(15px);
  opacity: 0;
}
.slide-fade--left-leave-active,
.slide-fade--right-leave-active {
  position: absolute !important;
  height: 100%;
}
.vuecal__title-bar .slide-fade--left-leave-active,
.vuecal__title-bar .slide-fade--right-leave-active {
  left: 0;
  right: 0;
  height: auto;
}
.vuecal__heading .slide-fade--left-leave-active,
.vuecal__heading .slide-fade--right-leave-active {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.vuecal--green-theme .vuecal__cell-events-count,
.vuecal--green-theme .vuecal__menu {
  background-color: #42b983;
  color: #fff;
}
.vuecal--green-theme .vuecal__title-bar {
  background-color: #e4f5ef;
}
.vuecal--green-theme .vuecal__cell--current,
.vuecal--green-theme .vuecal__cell--today {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal--green-theme:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 255, 245, 0.4);
}
.vuecal--green-theme .vuecal__cell--selected:before {
  border-color: rgba(66, 185, 131, 0.5);
}
.vuecal--green-theme .vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal--green-theme .vuecal__cell-split--highlighted {
  background-color: rgba(195, 255, 225, 0.5);
}
.vuecal--green-theme .vuecal__arrow--highlighted,
.vuecal--green-theme .vuecal__today-btn--highlighted,
.vuecal--green-theme .vuecal__view-btn--highlighted {
  background-color: rgba(136, 236, 191, 0.25);
}
.vuecal--blue-theme .vuecal__cell-events-count,
.vuecal--blue-theme .vuecal__menu {
  background-color: rgba(66, 163, 185, 0.8);
  color: #fff;
}
.vuecal--blue-theme .vuecal__title-bar {
  background-color: rgba(0, 165, 188, 0.3);
}
.vuecal--blue-theme .vuecal__cell--current,
.vuecal--blue-theme .vuecal__cell--today {
  background-color: rgba(240, 240, 255, 0.4);
}
.vuecal--blue-theme:not(.vuecal--day-view) .vuecal__cell--selected {
  background-color: rgba(235, 253, 255, 0.4);
}
.vuecal--blue-theme .vuecal__cell--selected:before {
  border-color: rgba(115, 191, 204, 0.5);
}
.vuecal--blue-theme .vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal--blue-theme .vuecal__cell-split--highlighted {
  background-color: rgba(0, 165, 188, 0.06);
}
.vuecal--blue-theme .vuecal__arrow--highlighted,
.vuecal--blue-theme .vuecal__today-btn--highlighted,
.vuecal--blue-theme .vuecal__view-btn--highlighted {
  background-color: rgba(66, 163, 185, 0.2);
}
.vuecal--rounded-theme .vuecal__weekdays-headings {
  border: none;
}
.vuecal--rounded-theme .vuecal__cell,
.vuecal--rounded-theme .vuecal__cell:before {
  background: none;
  border: none;
}
.vuecal--rounded-theme .vuecal__cell--out-of-scope {
  opacity: 0.4;
}
.vuecal--rounded-theme .vuecal__cell-content {
  width: 30px;
  height: 30px;
  -webkit-box-flex: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  border: 1px solid transparent;
  border-radius: 30px;
  color: #333;
}
.vuecal--rounded-theme.vuecal--day-view .vuecal__cell-content {
  width: auto;
  background: none;
}
.vuecal--rounded-theme.vuecal--year-view .vuecal__cell {
  width: 33.33%;
}
.vuecal--rounded-theme.vuecal--year-view .vuecal__cell-content {
  width: 85px;
}
.vuecal--rounded-theme.vuecal--years-view .vuecal__cell-content {
  width: 52px;
}
.vuecal--rounded-theme .vuecal__cell {
  background-color: transparent !important;
}
.vuecal--rounded-theme.vuecal--green-theme:not(.vuecal--day-view)
  .vuecal__cell-content {
  background-color: #f1faf7;
}
.vuecal--rounded-theme.vuecal--green-theme:not(.vuecal--day-view)
  .vuecal__cell--today
  .vuecal__cell-content {
  background-color: #42b983;
  color: #fff;
}
.vuecal--rounded-theme.vuecal--green-theme
  .vuecal--day-view
  .vuecal__cell--today:before {
  background-color: rgba(66, 185, 131, 0.05);
}
.vuecal--rounded-theme.vuecal--green-theme:not(.vuecal--day-view)
  .vuecal__cell--selected
  .vuecal__cell-content {
  border-color: #42b983;
}
.vuecal--rounded-theme.vuecal--green-theme
  .vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal--rounded-theme.vuecal--green-theme .vuecal__cell-split--highlighted {
  background-color: rgba(195, 255, 225, 0.5);
}
.vuecal--rounded-theme.vuecal--blue-theme:not(.vuecal--day-view)
  .vuecal__cell-content {
  background-color: rgba(100, 182, 255, 0.2);
}
.vuecal--rounded-theme.vuecal--blue-theme:not(.vuecal--day-view)
  .vuecal__cell--today
  .vuecal__cell-content {
  background-color: #8fb7e4;
  color: #fff;
}
.vuecal--rounded-theme.vuecal--blue-theme
  .vuecal--day-view
  .vuecal__cell--today:before {
  background-color: rgba(143, 183, 228, 0.1);
}
.vuecal--rounded-theme.vuecal--blue-theme:not(.vuecal--day-view)
  .vuecal__cell--selected
  .vuecal__cell-content {
  border-color: #61a9e0;
}
.vuecal--rounded-theme.vuecal--blue-theme
  .vuecal__cell--highlighted:not(.vuecal__cell--has-splits),
.vuecal--rounded-theme.vuecal--blue-theme .vuecal__cell-split--highlighted {
  background-color: rgba(0, 165, 188, 0.06);
}
.vuecal--date-picker .vuecal__title-bar {
  font-size: 1.2em;
}
.vuecal--date-picker .vuecal__heading {
  height: 2.2em;
  font-weight: 500;
  opacity: 0.4;
}
.vuecal--date-picker .vuecal__weekdays-headings {
  border: none;
}
.vuecal--date-picker .vuecal__body {
  margin-left: 1px;
}
.vuecal--date-picker .vuecal__cell,
.vuecal--date-picker .vuecal__cell:before {
  background: none;
  border: none;
}
.vuecal--date-picker .vuecal__cell-content {
  height: 26px;
  -webkit-box-flex: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  border: 1px solid transparent;
  border-radius: 25px;
  -webkit-transition: background-color 0.2s cubic-bezier(0.39, 0.58, 0.57, 1);
  transition: background-color 0.2s cubic-bezier(0.39, 0.58, 0.57, 1);
}
.vuecal--date-picker.vuecal--years-view .vuecal__cell-content {
  -webkit-box-flex: 0;
  -ms-flex: 0;
  flex: 0;
  padding: 0 4px;
  height: 24px;
}
.vuecal--date-picker.vuecal--year-view .vuecal__cell-content {
  -webkit-box-flex: 0;
  -ms-flex: 0;
  flex: 0;
  padding: 0 15px;
}
.vuecal--date-picker.vuecal--month-view .vuecal__cell-content {
  width: 26px;
}
.vuecal--date-picker:not(.vuecal--day-view) .vuecal__cell-content:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.vuecal--date-picker:not(.vuecal--day-view)
  .vuecal__cell--selected
  .vuecal__cell-content {
  background-color: #42b982;
  color: #fff;
}
.vuecal--date-picker:not(.vuecal--day-view)
  .vuecal__cell--current
  .vuecal__cell-content,
.vuecal--date-picker:not(.vuecal--day-view)
  .vuecal__cell--today
  .vuecal__cell-content {
  border-color: #42b982;
}
</style>
