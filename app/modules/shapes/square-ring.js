export const squareRingParams = {
  outerMarginVertical: 0.825,
  outerMarginHorizontal: 0.825,
  outerGap: 1,
  outerThicknessVertical: 1,
  outerThicknessHorizontal: 1,
  innerMarginVertical: 0.825,
  innerMarginHorizontal: 0.825,
  innerGap: 1,
  innerThicknessVertical: 1,
  innerThicknessHorizontal: 1,
};

export const getOuterSquareRingArray = (params) => {
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
        xgr = params.outerGap / 2,
        xol = -params.cellWidth / 2 + params.outerMarginHorizontal,
        xil = -params.cellWidth / 2 + params.outerMarginHorizontal + params.outerThicknessHorizontal,
        xgl = -params.outerGap / 2;

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

export const getInnerSquareRingArray = (params) => {
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
        xgr = params.innerGap / 2,
        xol = params.innerOffsetLeft + params.innerMarginHorizontal,
        xil = params.innerOffsetLeft + params.innerMarginHorizontal + params.innerThicknessHorizontal,
        xgl = -params.innerGap / 2;

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
