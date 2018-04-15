export const oscillatorParams = {
  marginVertical: 2,
  marginHorizontal: 0.825,
  marginHorizontal: 0.825,
  thicknessVertical: 1,
  thicknessHorizontal: 1,
  stemHeight: 3,
  stemWidth: 1,
  capWidth: 4,
  capHeight: 1,
};

export const getOuterOscillatorArray = (params) => {
  params = Object.assign(params, {
    outerWidth: params.cellWidth - params.marginHorizontal - params.marginHorizontal,
    outerHeight: params.cellHeight - params.marginVertical - params.marginVertical,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [t|r|b|l]  ->  top | right | bottom | left
  const yt = params.cellHeight / 2 - params.marginVertical,
        yb = -params.cellHeight / 2 + params.marginVertical,
        xr = params.cellWidth / 2 - params.marginHorizontal,
        xl = -params.cellWidth / 2 + params.marginHorizontal;

  return [
    [xl, yb],
    [xr, yb],
    [xr, yt],
    [xl, yt],
    [xl, yb],
  ];
};


export const getInnerOscillatorArray = (params) => {
  params = Object.assign(params, {
    width: params.outerWidth - params.marginHorizontal - params.marginHorizontal,
    height: params.outerHeight - params.marginVertical - params.marginVertical,
    offsetTop: params.cellHeight / 2 - params.marginVertical - params.thicknessVertical,
    offsetRight: params.cellWidth / 2 - params.marginHorizontal - params.thicknessHorizontal,
    offsetBottom: -params.cellHeight / 2 + params.marginVertical + params.thicknessVertical,
    offsetLeft: -params.cellWidth / 2 + params.marginHorizontal + params.thicknessHorizontal,
  });

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [t|r|b|l]  ->  top | right | bottom | left
  //
  // [y|x]  -9>  y axis | x axis
  // [s|c]  ->  stem | cap
  // [t|b]  ->  top | bottom
  //
  // [y|x]  ->  y axis | x axis
  // [s|c]  ->  stem | cap
  // [t|b]  ->  top | bottom
  // [r|l]  ->  right | left

  const yt = params.offsetTop,
        xr = params.offsetRight,
        yb = params.offsetBottom,
        xl = params.offsetLeft,
        yst = params.offsetTop - params.stemHeight,
        xstr = params.stemWidth / 2,
        xstl = -params.stemWidth / 2,
        ysb = params.offsetBottom + params.stemHeight,
        xsbr = params.stemWidth / 2,
        xsbl = -params.stemWidth / 2,
        xctr = params.capWidth / 2,
        xctl = -params.capWidth / 2,
        yct = yst - params.capHeight,
        ycb = ysb + params.capHeight,
        xcbr = params.capWidth / 2,
        xcbl = -params.capWidth / 2;

  return [
    [xl, yb],
    [xsbl, yb],
    [xsbl, ysb],
    [xcbl, ysb],
    [xcbl, ycb],
    [xcbr, ycb],
    [xcbr, ysb],
    [xsbr, ysb],
    [xsbr, yb],
    [xr, yb],
    [xr, yt],
    [xstr, yt],
    [xstr, yst],
    [xctr, yst],
    [xctr, yct],
    [xctl, yct],
    [xctl, yst],
    [xstl, yst],
    [xstl, yt],
    [xl, yt],
    [xl, yb],
  ];
};
