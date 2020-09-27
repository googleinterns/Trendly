import { Injectable } from '@angular/core';

/**
 * Colors service, for consistent color palette for Hitogramy and Clusterly
 */
@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  readonly colorShow: string[] = [
    '#2196f3',
    '#673ab7',
    '#009688',
    '#ff9800',
    '#ff5722',
    '#e91e63',
    '#3f51b5',
    '#ffeb3b',
  ];
  readonly lightColorShow: string[] = [];
  readonly colorBlindShow: string[] = [
    '#f5793A',
    '#a95aa1',
    '#85C0f9',
    '#0f2080'
  ];
  readonly lightColorBlingShow: string[] = [];

  constructor(){
    this.colorShow.forEach((color) =>
      this.lightColorShow.push(this.changeColorLightness(color, 45)));
    this.colorBlindShow.forEach((color) =>
      this.lightColorBlingShow.push(this.changeColorLightness(color, 45)));
  }

  /** Returns a hex representation of lighter/ darken version of color 
   * by lightnessAmount.
   * @param color - hex represantion of a color, statrs with #
   * @param lightnessAmount - a number representing the amount of
   * requested lightening of the given color. Given a negative number,
   * the returned color will be a darken version of the given one. */ 
  changeColorLightness(color: string, lightnessAmount: number): string {
    color = color.slice(1);
    const num = parseInt(color,16);
    const r = Math.max(Math.min((num >> 16) + lightnessAmount, 255), 0);
    const b = Math.max(Math.min(((num >> 8) & 0x00FF) + lightnessAmount, 255), 0);
    const g = Math.max(Math.min((num & 0x0000FF) + lightnessAmount, 255), 0);
    const newColor = g | (b << 8) | (r << 16);
    return '#' + newColor.toString(16);
  }

}
