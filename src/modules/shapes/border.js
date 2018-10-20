export const borderParams = {
  cellHeight: 15000,
  cellWidth: 15000,
};

export const getBorderArray = (params) => {
  // LEGEND:
  // [t|r|b|l]  ->  top | right | bottom | left
  const yt = params.cellHeight / 2,
        xr = params.cellWidth / 2,
        yb = -params.cellHeight / 2,
        xl = -params.cellWidth / 2;

  return [
    [xl, yb],
    [xr, yb],
    [xr, yt],
    [xl, yt],
    [xl, yb]
  ];
}
