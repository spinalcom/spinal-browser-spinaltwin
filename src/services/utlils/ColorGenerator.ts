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

export class ColorGenerator {
  colors: string[] = [];
  constructor(nbrColors: number, colorsUsed: string[]) {
    const tmpNbrColors = nbrColors > 3 ? nbrColors : 10;
    for (let index = 0; index < tmpNbrColors; index++) {
      this.colors.push(this.rainbow(tmpNbrColors, index));
    }

    for (const color of colorsUsed) {
      const idx = this.colors.indexOf(color);
      if (idx !== -1) this.colors.splice(idx, 1);
    }
    this.shuffleColor();
    this.shuffleColor();
  }

  getColor() {
    return this.colors.pop();
  }
  private shuffleColor() {
    for (let i = this.colors.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[j]] = [this.colors[j], this.colors[i]];
    }
  }

  private getColorStr(colorCompo: number): string {
    return ('00' + (~~(colorCompo * 255)).toString(16)).slice(-2);
  }
  private rainbow(numOfSteps: number, step: number): string {
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch (i % 6) {
      case 0:
        r = 1;
        g = f;
        b = 0;
        break;
      case 1:
        r = q;
        g = 1;
        b = 0;
        break;
      case 2:
        r = 0;
        g = 1;
        b = f;
        break;
      case 3:
        r = 0;
        g = q;
        b = 1;
        break;
      case 4:
        r = f;
        g = 0;
        b = 1;
        break;
      case 5:
        r = 1;
        g = 0;
        b = q;
        break;
    }
    return `#${this.getColorStr(r)}${this.getColorStr(g)}${this.getColorStr(
      b
    )}`;
  }
}
