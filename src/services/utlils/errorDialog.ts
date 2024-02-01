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

export function errorDialog(title, comfimText, msg, error) {
  const h = this.$createElement;
  const msgText = [h('span', null, msg)];
  if (error) {
    msgText.push(h('br', null, null), h('i', { style: 'color: teal' }, error));
  }

  this.$msgbox({
    title,
    message: h('p', null, msgText),
    confirmButtonText: comfimText,
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        // @ts-ignore
        window.location =
          '/html/spinaltwin/login.html' + location.hash + location.search;
        // window.location = "/html/drive/";
        done();
      } else {
        done();
      }
    },
  });
}

export default errorDialog;
