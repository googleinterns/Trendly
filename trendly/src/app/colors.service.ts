import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  readonly _colorShow: string[] = [
    '#2196F3',
    '#673AB7',
    '#009688',
    '#FF9800',
    '#FF5722',
    '#E91E63',
    '#3F51B5',
    '#FFEB3B',
  ];
  readonly _lightColorShow: string[] = [
    '#64B5F6',
    '#9575CD',
    '#4DB6AC',
    '#FFB74D',
    '#FF8A65',
    '#F06292',
    '#7986CB',
    '#FFF176',

  ];
  readonly _colorBlindShow: string[] = [
    '#F5793A',
    '#A95AA1',
    '#85C0F9',
    '#0F2080'
  ];
  readonly _lightColorBlingShow: string[];

  get colorShow(): string[] {
    return this._colorShow;
  }

  get lightColorShow(): string[] {
    return this._lightColorBlingShow;
  }

  get colorBlindShow(): string[] {
    return this._colorBlindShow
  }
}
