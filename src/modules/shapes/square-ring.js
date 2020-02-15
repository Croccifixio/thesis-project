import { getMacroFooter, getMacroHeader, getMacroLine } from '../helpers'


const params = {
  outerMarginVertical: 825,
  outerMarginHorizontal: 825,
  outerGapHorizontal: 1000,
  outerThicknessVertical: 1000,
  outerThicknessHorizontal: 1000,
  innerMarginVertical: 825,
  innerMarginHorizontal: 825,
  innerGapHorizontal: 1000,
  innerThicknessVertical: 1000,
  innerThicknessHorizontal: 1000,
};


const constraints = {
  outerMarginVertical: {
    min: 0,
    max: ['innerThicknessVertical', 'innerMarginVertical', 'outerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  outerMarginHorizontal: {
    min: 0,
    max: ['innerThicknessHorizontal', 'innerMarginHorizontal', 'outerThicknessHorizontal', 'innerGapHorizontal'],
    maxAlt: ['outerThicknessHorizontal', 'innerMarginHorizontal', 'outerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: -300,
  },
  outerGapHorizontal: {
    min: 300,
    max: ['outerThicknessHorizontal', 'outerMarginHorizontal'],
    maxOffset: 400,
    maxAltOffset: 0,
  },
  outerThicknessVertical: {
    min: 0,
    max: ['outerMarginVertical', 'innerMarginVertical', 'innerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  outerThicknessHorizontal: {
    min: 0,
    max: ['outerMarginHorizontal', 'innerMarginHorizontal', 'innerThicknessHorizontal', 'innerGapHorizontal'],
    maxAlt: ['outerMarginHorizontal', 'outerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: 500,
  },
  innerMarginVertical: {
    min: 300,
    max: ['outerMarginVertical', 'outerThicknessVertical', 'innerThicknessVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  innerMarginHorizontal: {
    min: 300,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerThicknessHorizontal', 'innerGapHorizontal'],
    maxOffset: 500,
    maxAltOffset: 0,
  },
  innerGapHorizontal: {
    min: 300,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerMarginHorizontal', 'innerThicknessHorizontal'],
    maxOffset: 600,
    maxAltOffset: 0,
  },
  innerThicknessVertical: {
    min: 0,
    max: ['outerMarginVertical', 'outerThicknessVertical', 'innerMarginVertical'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
  innerThicknessHorizontal: {
    min: 0,
    max: ['outerMarginHorizontal', 'outerThicknessHorizontal', 'innerMarginHorizontal', 'innerGapHorizontal'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
};


const getOuterArray = (params) => {
  params = Object.assign(params, {
    outerHeight: params.cellHeight - params.outerMarginVertical - params.outerMarginVertical,
    outerWidth: params.cellWidth - params.outerMarginHorizontal - params.outerMarginHorizontal,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [o|i|g]    ->  outer | inner | gap
  // [t|r|b|l]  ->  top | right | bottom | left
  const yot = params.cellHeight / 2 - params.outerMarginVertical,
        yit = params.cellHeight / 2 - params.outerMarginVertical - params.outerThicknessVertical,
        yob = -params.cellHeight / 2 + params.outerMarginVertical,
        yib = -params.cellHeight / 2 + params.outerMarginVertical + params.outerThicknessVertical,
        xor = params.cellWidth / 2 - params.outerMarginHorizontal,
        xir = params.cellWidth / 2 - params.outerMarginHorizontal - params.outerThicknessHorizontal,
        xgr = params.outerGapHorizontal / 2,
        xol = -params.cellWidth / 2 + params.outerMarginHorizontal,
        xil = -params.cellWidth / 2 + params.outerMarginHorizontal + params.outerThicknessHorizontal,
        xgl = -params.outerGapHorizontal / 2;

  return [
    [xol, yob],
    [xor, yob],
    [xor, yot],
    [xgr, yot],
    [xgr, yit],
    [xir, yit],
    [xir, yib],
    [xil, yib],
    [xil, yit],
    [xgl, yit],
    [xgl, yot],
    [xol, yot],
    [xol, yob],
  ];
};


const getInnerArray = (params) => {
  params = Object.assign(params, {
    innerHeight: params.outerHeight - params.innerMarginVertical - params.innerMarginVertical,
    innerWidth: params.outerWidth - params.innerMarginHorizontal - params.innerMarginHorizontal,
    innerOffsetTop: params.cellHeight / 2 - params.outerMarginVertical - params.outerThicknessVertical,
    innerOffsetRight: params.cellWidth / 2 - params.outerMarginHorizontal - params.outerThicknessHorizontal,
    innerOffsetBottom: -params.cellHeight / 2 + params.outerMarginVertical + params.outerThicknessVertical,
    innerOffsetLeft: -params.cellWidth / 2 + params.outerMarginHorizontal + params.outerThicknessHorizontal,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [o|i|g]    ->  outer | inner | gap
  // [t|r|b|l]  ->  top | right | bottom | left
  const yot = params.innerOffsetTop - params.innerMarginVertical,
        yit = params.innerOffsetTop - params.innerMarginVertical - params.innerThicknessVertical,
        yob = params.innerOffsetBottom + params.innerMarginVertical,
        yib = params.innerOffsetBottom + params.innerMarginVertical + params.innerThicknessVertical,
        xor = params.innerOffsetRight - params.innerMarginHorizontal,
        xir = params.innerOffsetRight - params.innerMarginHorizontal - params.innerThicknessHorizontal,
        xgr = params.innerGapHorizontal / 2,
        xol = params.innerOffsetLeft + params.innerMarginHorizontal,
        xil = params.innerOffsetLeft + params.innerMarginHorizontal + params.innerThicknessHorizontal,
        xgl = -params.innerGapHorizontal / 2;

  return [
    [xol, yob],
    [xgl, yob],
    [xgl, yib],
    [xil, yib],
    [xil, yit],
    [xir, yit],
    [xir, yib],
    [xgr, yib],
    [xgr, yob],
    [xor, yob],
    [xor, yot],
    [xol, yot],
    [xol, yob],
  ];
};


const surfaceSensorPosition = ({ cellHeight, outerMarginVertical, outerThicknessVertical }) => (cellHeight / 2) - outerMarginVertical - (outerThicknessVertical / 2)


const download = ({ cell, name, params, scale, settings, shapes }) => `
  ${getMacroHeader()}
  ${shapes.map(shape => getMacroLine(shape)).join('')}
  ${getMacroFooter({ cell, name, params, scale, settings, surfaceSensorPosition })}
`


export default {
  name: 'Rectangular split-ring resonator',
  params,
  constraints,
  shapes: [
    {
      id: 1,
      points: getOuterArray,
    },
    {
      id: 2,
      points: getInnerArray,
    },
  ],
  download,
};
