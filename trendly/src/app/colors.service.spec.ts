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

  it('should create light color for each color', () => {
    expect(service.colors.length === service.lightColors.length)
        .toBeTrue();
  });

  it('should create light color for color blind for each such color', () => {
    expect(service.colorsForColorBlind.length === service.lightColorForColorBlind.length)
        .toBeTrue();
  });

  it('should create colors with valid hex color representation',
     () => {service.colors.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  it('should create light colors with valid hex color representation',
     () => {service.lightColors.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  it('should create colors for color blind with valid hex color representation',
     () => {service.colorsForColorBlind.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  it('should create light colors for color blind with valid hex color representation',
     () => {service.lightColorForColorBlind.forEach((color) => {
       expect(/^#[0-9A-F]{6}$/i.test(color)).toBeTrue();
     })});

  it('should not change color when given zero lightnessAmount', () => {
    expect(service.changeColorLightness('#64b5f6', 0)).toBe('#64b5f6');
  });

  it('should return a valid hex color representation after applying changeColorLightness',
     () => {
       const newColor = service.changeColorLightness('#64b5f6', 40);
       expect(/^#[0-9A-F]{6}$/i.test(newColor)).toBeTrue();
     });
});
