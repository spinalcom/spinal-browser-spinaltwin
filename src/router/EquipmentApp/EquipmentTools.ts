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

import { FileSystem } from 'spinal-core-connectorjs_type';
import { AppItem } from '../../services/backend/AppItem';
import { EQUIPMENT_TYPE } from '../../constants';

async function getEquipmentNumber(item: AppItem): Promise<number> {
  const node = FileSystem._objects[item.serverId];
  if (node && node.getType().get() === EQUIPMENT_TYPE) return 1;
  if (typeof item.children === 'undefined') return 0;
  const prom: Promise<number>[] = [];
  for (const [, arrayItem] of item.children) {
    for (const i of arrayItem) {
      prom.push(getEquipmentNumber(i));
    }
  }
  return Promise.all(prom).then((resArr) =>
    resArr.reduce((prev, curr) => prev + curr, 0)
  );
}

module.exports = {
  getEquipmentNumber: getEquipmentNumber,
};
