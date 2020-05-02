import flatten from 'ramda/src/flatten';
import values from 'ramda/src/values';
const gardeLindex = () => {
  let index = -1;
  return d => {
    d.position = ++index;
    return d;
  };
};

const mapper = gardeLindex();

type Slot = {
  cx: number;
  cy: number;
  position: number;
  color?: string;
}

type PathsCollections = {
  [color: string]: Slot[]
}

export const paths: PathsCollections = {
  black: [
    {cx: 417.61, cy: 125.89, color: 'black'},
    {cx: 417.61, cy: 165.3},
    {cx: 417.61, cy: 204.72},
    {cx: 417.61, cy: 246.77},
    {cx: 417.61, cy: 288.82},
    {cx: 375.56, cy: 288.82},
    {cx: 333.52, cy: 288.82},
    {cx: 294.1, cy: 294.07},
    {cx: 254.68, cy: 304.58},
    {cx: 226.89, cy: 277.93},
    {cx: 194.99, cy: 248.65},
    {cx: 163.08, cy: 219.37},
    {cx: 134.13, cy: 188.01},
    {cx: 98.91, cy: 212.25},
    {cx: 70.82, cy: 239.9},
    {cx: 43.48, cy: 272.03}
  ],
  red: [
    {cx: 15.42, cy: 302.21, color: 'red'},
    {cx: 45.4, cy: 331.69},
    {cx: 73.51, cy: 359.32},
    {cx: 103.49, cy: 388.8},
    {cx: 133.48, cy: 418.27},
    {cx: 121.48, cy: 458.18},
    {cx: 120.34, cy: 498.22},
    {cx: 121.48, cy: 540.32},
    {cx: 134.62, cy: 577.86},
    {cx: 106.83, cy: 607.09},
    {cx: 76.64, cy: 638.14},
    {cx: 46.44, cy: 669.19},
    {cx: 17.21, cy: 696.66},
    {cx: 41.76, cy: 731.66},
    {cx: 69.66, cy: 759.51},
    {cx: 102.03, cy: 786.56}
  ],
  yellow: [
    {cx: 137.65, cy: 813.17, color: 'yellow'},
    {cx: 167.38, cy: 783.44},
    {cx: 195.25, cy: 755.56},
    {cx: 224.99, cy: 725.83},
    {cx: 254.72, cy: 696.1},
    {cx: 295.14, cy: 709.24},
    {cx: 337.46, cy: 712.69},
    {cx: 376.99, cy: 712.69},
    {cx: 420.21, cy: 710.82},
    {cx: 420.21, cy: 752.87},
    {cx: 420.21, cy: 794.92},
    {cx: 420.21, cy: 834.34},
    {cx: 420.21, cy: 876.38},
    {cx: 460.94, cy: 876.38},
    {cx: 502.99, cy: 876.38},
    {cx: 544.38, cy: 876.38}
  ],
  white: [
    {cx: 585.77, cy: 876.38, color: 'white'},
    {cx: 585.77, cy: 834.34},
    {cx: 585.77, cy: 794.92},
    {cx: 585.77, cy: 752.87},
    {cx: 585.77, cy: 710.82},
    {cx: 627.81, cy: 710.82},
    {cx: 669.86, cy: 710.82},
    {cx: 709.28, cy: 705.57},
    {cx: 748.7, cy: 695.06},
    {cx: 776.48, cy: 721.71},
    {cx: 808.39, cy: 750.99},
    {cx: 840.3, cy: 780.27},
    {cx: 869.25, cy: 811.63},
    {cx: 904.47, cy: 787.39},
    {cx: 932.56, cy: 759.74},
    {cx: 959.89, cy: 727.61}
  ],
  green: [
    {cx: 984.58, cy: 695.36, color: 'green'},
    {cx: 954.6, cy: 665.88},
    {cx: 926.49, cy: 638.25},
    {cx: 896.51, cy: 608.77},
    {cx: 866.52, cy: 579.29},
    {cx: 878.52, cy: 539.39},
    {cx: 879.66, cy: 499.35},
    {cx: 878.52, cy: 457.25},
    {cx: 865.38, cy: 419.71},
    {cx: 893.17, cy: 390.47},
    {cx: 923.36, cy: 359.43},
    {cx: 953.56, cy: 328.38},
    {cx: 982.79, cy: 300.91},
    {cx: 958.24, cy: 265.91},
    {cx: 930.34, cy: 238.06},
    {cx: 897.97, cy: 211.01}
  ],
  blue: [
    {cx: 865.3, cy: 188.52, color: 'blue'},
    {cx: 835.56, cy: 218.25},
    {cx: 807.69, cy: 246.13},
    {cx: 777.96, cy: 275.86},
    {cx: 748.23, cy: 305.59},
    {cx: 707.8, cy: 292.45},
    {cx: 665.48, cy: 289},
    {cx: 625.96, cy: 289},
    {cx: 585.36, cy: 290.86},
    {cx: 585.36, cy: 248.82},
    {cx: 585.36, cy: 206.77},
    {cx: 585.36, cy: 167.35},
    {cx: 585.36, cy: 125.31},
    {cx: 544.63, cy: 125.31},
    {cx: 502.59, cy: 125.31},
    {cx: 461.2, cy: 125.31}
  ],
};

export const allPath = flatten(values(paths));

export const start = {
  blue: [
    {cx: 793.3, cy: 186.59},
    {cx: 752.57, cy: 186.59},
    {cx: 710.52, cy: 186.59},
    {cx: 669.13, cy: 186.59},
  ],
  green: [
    {cx: 983.78, cy: 622.43},
    {cx: 983.78, cy: 581.7},
    {cx: 983.78, cy: 539.66},
    {cx: 983.78, cy: 498.27},
  ],
  white: [
    {cx: 440.5, cy: 913.89},
    {cx: 481.23, cy: 913.89},
    {cx: 523.28, cy: 913.89},
    {cx: 564.67, cy: 913.89},
  ],
  yellow: [
    {cx: 213.54, cy: 812.33},
    {cx: 254.27, cy: 812.33},
    {cx: 296.32, cy: 812.33},
    {cx: 337.71, cy: 812.33},
  ],
  red: [
    {cx: 18.13, cy: 377.24},
    {cx: 18.13, cy: 417.97},
    {cx: 18.13, cy: 460.02},
    {cx: 18.13, cy: 501.41},
  ],
  black: [
    {cx: 565.6, cy: 86.11},
    {cx: 524.87, cy: 86.11},
    {cx: 482.82, cy: 86.11},
    {cx: 441.43, cy: 86.11},
  ],
}

export const end = {
  blue: [
    {cx: 818, cy: 348.1, color: 'blue'},
    {cx: 847, cy: 319.3, color: 'blue'},
    {cx: 877, cy: 289.57, color: 'blue'},
    {cx: 876, cy: 249.15, color: 'blue'},
  ].reverse(),
  green: [
    {cx: 822.27, cy: 647.86, color: 'green'},
    {cx: 851.07, cy: 676.66, color: 'green'},
    {cx: 880.8, cy: 706.39, color: 'green'},
    {cx: 921.22, cy: 705.92, color: 'green'},
  ].reverse(),
  white: [
    {cx: 502.99, cy: 712.17, color: 'white'},
    {cx: 502.99, cy: 752.9, color: 'white'},
    {cx: 502.99, cy: 794.95, color: 'white'},
    {cx: 531.89, cy: 823.2, color: 'white'},
  ].reverse(),
  yellow: [
    {cx: 186.86, cy: 652.36, color: 'yellow'},
    {cx: 158.06, cy: 681.16, color: 'yellow'},
    {cx: 128.33, cy: 710.89, color: 'yellow'},
    {cx: 128.79, cy: 751.31, color: 'yellow'},
  ].reverse(),
  red: [
    {cx: 179.64, cy: 351.82, color: 'red'},
    {cx: 150.84, cy: 323.02, color: 'red'},
    {cx: 121.11, cy: 293.29, color: 'red'},
    {cx: 80.69, cy: 293.75, color: 'red'},
  ].reverse(),
  black: [
    {cx: 503.53, cy: 288.24, color: 'black'},
    {cx: 503.53, cy: 247.51, color: 'black'},
    {cx: 503.53, cy: 205.46, color: 'black'},
    {cx: 474.62, cy: 177.21, color: 'black'},
  ].reverse(),
}

const positionMatrice = [
  ...paths.black,
  ...paths.red,
  ...paths.yellow,
  ...paths.white,
  ...paths.green,
  ...paths.blue,

  ...start.black,
  ...end.black,
  ...start.red,
  ...end.red,
  ...start.yellow,
  ...end.yellow,
  ...start.white,
  ...end.white,
  ...start.green,
  ...end.green,
  ...start.blue,
  ...end.blue,
].map(mapper);

export default positionMatrice;
