import {Injectable} from '@angular/core';

/**
 * Colors service, for consistent color palette for Histogramy and Clusterly.
 */
@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  readonly colors: string[] = [
    '#2196f3',
    '#673ab7',
    '#009688',
    '#ff9800',
    '#ff5722',
    '#e91e63',
    '#3f51b5',
    '#ffeb3b',
  ];
  readonly lightColors: string[] = [];
  // A colorblind-friendly palette.
  readonly colorsForColorBlind: string[] =
      ['#f5793A', '#a95aa1', '#85C0f9', '#0f2080'];
  readonly lightColorForColorBlind: string[] = [];

  constructor() {
    this.colors.forEach(
        (color) => this.lightColors.push(this.changeColorLightness(color, 45)));
    this.colorsForColorBlind.forEach(
        (color) => this.lightColorForColorBlind.push(
            this.changeColorLightness(color, 45)));
  }

  /**
   * Returns a hex representation of lighter/ darken version of color
   * by lightnessAmount.
   * @param color - hex represantion of a color, statrs with #
   * @param lightnessAmount - a number representing the amount of
   * requested lightening of the given color. Given a negative number,
   * the returned color will be a darken version of the given one.
   */
  changeColorLightness(color: string, lightnessAmount: number): string {
    color = color.slice(1);
    const num = parseInt(color, 16);
    const getColorLightness = (colorNum) =>
        Math.max(Math.min(colorNum + lightnessAmount, 255), 0);
    const r = getColorLightness(num >> 16);
    const b = getColorLightness((num >> 8) & 0x00FF);
    const g = getColorLightness(num & 0x0000FF);
    const newColor = g | (b << 8) | (r << 16);
    return '#' + newColor.toString(16);
  }
}
