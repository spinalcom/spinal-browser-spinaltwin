/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

export interface ISpinalView {
  name: string;
  serverId: number;
}
export type ViewManagerOnChangeFct = (view: ISpinalView) => void;
export type ViewManagerBreacrumbSubscribeFct = (breadcrumb: ISpinalView[]) => void;

export class ViewManager {
  static instances: Map<string, ViewManager> = new Map();
  viewKey: string;
  breadcrumb: ISpinalView[] = []
  onChangeFct: ViewManagerOnChangeFct[] = [];
  breacrumbSubscribeFct: ViewManagerBreacrumbSubscribeFct = null;

  constructor(viewKey) {
    this.viewKey = viewKey;
  }
  static getInstance(viewKey: string): ViewManager {
    if (!ViewManager.instances.has(viewKey))
      ViewManager.instances.set(viewKey, new ViewManager(viewKey))
    return ViewManager.instances.get(viewKey);
  }

  init(onChangeFct: ViewManagerOnChangeFct, serverId) {
    this.onChangeFct = []
    this.onChangeFct.push(onChangeFct)
    const view = { name: this.viewKey, serverId }
    this.breadcrumb = [view]
    this.onChangeFct.forEach(fct => {fct(view)})
    if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
  }

  push(name: string, serverId: number) {
    const view = { name, serverId };
    this.breadcrumb.push(view);
    this.onChangeFct.forEach(fct => {fct(view)})
    if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
  }

  pop() {
    this.breadcrumb.pop();
    const view = this.breadcrumb[this.breadcrumb.length - 1];
    this.onChangeFct.forEach(fct => {fct(view)})
    if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
  }

  breacrumbSubscribe(fct: ViewManagerBreacrumbSubscribeFct) {
    this.breacrumbSubscribeFct = fct;
  }
  viewSubscribe(changeFct: ViewManagerOnChangeFct, serverId) {
    const view = { name: this.viewKey, serverId }
    if (!this.onChangeFct.includes(changeFct))
      this.onChangeFct.push(changeFct)
    changeFct(view);
    // this.onChangeFct.forEach(fct => {fct(view)})
  }

 move(serverId: number) {
    for (var i = this.breadcrumb.length - 1; i >= 0; i--) {
      const bc = this.breadcrumb[i];
      if (bc.serverId === serverId) {
        this.onChangeFct.forEach(fct => {fct(bc)})
        if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
        return;
      } else
        this.breadcrumb.pop();
    }
  }
}
