// these values won't validate anything at runtime. These are simply static values that you can use

// define the prices for each 'material' and 'finish' option
export const PRODUCT_PRICES = {
  material: {
    silicone: 0,
    polycarbonate: 5_00,
  },
  finish: {
    smooth: 0,
    textured: 3_00,
  },
} as const;

// define the base price of the phone case
export const BASE_PRICE = 14_00;
