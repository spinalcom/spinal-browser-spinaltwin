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

const validNames = [
  'top',
  'front',
  'right',
  'left',
  'back',
  'bottom',
  'top,front',
  'top right',
  'top,left',
  'top,back',
  'bottom,front',
  'bottom,right',
  'bottom,left',
  'bottom,back',
  'left,front',
  'front,right',
  'right,back',
  'back,left',
  'front,top,right',
  'back,top,right',
  'front,top,left',
  'back,top,left',
  'front,bottom,right',
  'back,bottom,right',
  'front,bottom,left',
  'back,bottom,left',
];

/**
 * NEED TO BE CALLED WITH A `viewer.viewCubeUi.cube` INSTANCE.
 *
 * E.G : `rotateTo.call(viewer.viewCubeUi.cube, viewer, 'top');`
 * @param {*} viewer
 * @export
 * @param {string} face
 * @returns Promise<void>
 */
export default function rotateTo(viewer, face): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!validNames.includes(face)) {
      return reject();
    }
    if (face === 'top') {
      if (
        viewer.getCamera().rotation.x == 0 &&
        viewer.getCamera().rotation.y == 0 &&
        viewer.getCamera().rotation.z == 0
      )
        return resolve();
    }
    if (viewer.autocam.orthographicFaces && face.indexOf(',') !== -1) {
      viewer.autocam.setCameraOrtho(false);
    }
    viewer.autocam.calculateCubeTransform(face);
    viewer.autocam.elapsedTime = 0;
    viewer.autocam.sphericallyInterpolateTransition(() => {
      resolve();
    });
  });
}
