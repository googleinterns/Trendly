import {TestBed} from '@angular/core/testing';

import {ColorsService} from './colors.service';

describe('ColorsService', () => {
  let service: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Checks the size of colors.colorShow == the size of
   * colors.lightColorShow since each color in colorShow
   * supposed to have a lighter version in lightColorShow
   */
  it('check colorShow size equals lightColorShow size', () => {
    expect(service.colorShow.length === service.lightColorShow.length)
        .toBeTrue();
  });

  /**
   * Checks the size of colors.colorBlindShow == the size of
   * colors.lightColorBlingShow since each color in colorBlindShow
   * supposed to have a lighter version in lightColorBlingShow
   */
  it('check colorBlindShow size equals lightColorBlingShow size', () => {
    expect(service.colorBlindShow.length === service.lightColorBlingShow.length)
        .toBeTrue();
  });

  /**
   * Checks the strings in colorShow are valid hex represantion
   * of color
   */
  it('check colorShow has valid hex color representation',
     () => {service.colorShow.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  /**
   * Checks the strings in lightColorShow are valid hex represantion
   * of color
   */
  it('check lightColorShow has valid hex color representation',
     () => {service.lightColorShow.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  /**
   * Checks the strings in colorBlindShow are valid hex represantion
   * of color
   */
  it('check colorBlindShow has valid hex color representation',
     () => {service.colorBlindShow.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  /**
   * Checks the strings in lightColorBlingShow are valid hex represantion
   * of color
   */
  it('check lightColorBlingShow has valid hex color representation',
     () => {service.lightColorBlingShow.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  /**
   * Checks changeColorLightness with zero lightnessAmount dosen't
   * change the color
   */
  it('check changeColorLightness with zero lightnessAmount', () => {
    expect(service.changeColorLightness('#64b5f6', 0)).toBe('#64b5f6');
  });

  /** Checks changeColorLightness returns a valid hex color representation */
  it('check changeColorLightness returns a valid color', () => {
    const newColor = service.changeColorLightness('#64b5f6', 40);
    expect(/^#[0-9A-F]{6}$/i.test(newColor)).toBeTrue();
  });
});
