export const crossParams = {
  marginTop: 0.825,
  marginRight: 0.825,
  marginBottom: 0.825,
  marginLeft: 0.825,
  depthTopLeft: 6.14 / Math.sqrt(2),
  depthTopRight: 6.14 / Math.sqrt(2),
  depthBottomRight: 6.14 / Math.sqrt(2),
  depthBottomLeft: 6.14 / Math.sqrt(2),
  girthTopLeft: 1.6 / Math.sqrt(2),
  girthTopRight: 1.6 / Math.sqrt(2),
  girthBottomRight: 1.6 / Math.sqrt(2),
  girthBottomLeft: 1.6 / Math.sqrt(2),
  thickness: 1,
  // lengthTop: (cellWidth - marginLeft - marginRight) - (girthTopLeft + girthTopRight),
  // lengthRight: (cellHeight - marginTop - marginBottom) - (girthTopRight + girthBottomRight),
  // lengthBottom: (cellWidth - marginLeft - marginRight) - (girthBottomLeft + girthBottomRight),
  // lengthLeft: (cellHeight - marginTop - marginBottom) - (girthTopLeft + girthBottomLeft),
};

export const getOuterCrossArray = (params) => {
  params = Object.assign(params, {
    lengthTop: (params.cellWidth - params.marginLeft - params.marginRight) - (params.girthTopLeft + params.girthTopRight),
    lengthRight: (params.cellHeight - params.marginTop - params.marginBottom) - (params.girthTopRight + params.girthBottomRight),
    lengthBottom: (params.cellWidth - params.marginLeft - params.marginRight) - (params.girthBottomLeft + params.girthBottomRight),
    lengthLeft: (params.cellHeight - params.marginTop - params.marginBottom) - (params.girthTopLeft + params.girthBottomLeft),
  });

  const prevX1 = -params.lengthBottom / 2 + Math.abs(params.marginLeft - params.marginRight) / 2 + params.lengthBottom - params.depthBottomRight + params.girthBottomRight;
  const prevY1 = -params.cellHeight / 2 + params.marginBottom + params.depthBottomRight + params.girthBottomRight - params.depthBottomRight + params.lengthRight + -params.depthTopRight + params.girthTopRight;
  const prevX2 = -params.lengthBottom/2 + Math.abs(params.marginLeft - params.marginRight)/2 + params.lengthBottom - params.depthBottomRight + params.girthBottomRight + params.cellWidth/2 - prevX1 - params.marginRight - params.depthTopRight - params.girthTopRight + params.depthTopRight - params.lengthTop + params.depthTopLeft - params.girthTopLeft;

  return [
    [-params.lengthBottom/2 + Math.abs(params.marginLeft - params.marginRight)/2, -params.cellHeight/2 + params.marginBottom],
    [params.lengthBottom, 0],
    [-params.depthBottomRight, params.depthBottomRight],
    [params.girthBottomRight, params.girthBottomRight],
    [params.cellWidth/2 - prevX1 - params.marginRight, -params.depthBottomRight],
    [0, params.lengthRight],
    [-params.depthTopRight, -params.depthTopRight],
    [-params.girthTopRight, params.girthTopRight],
    [params.depthTopRight, params.cellHeight/2 - prevY1 - params.marginTop],
    [-params.lengthTop, 0],
    [params.depthTopLeft, -params.depthTopLeft],
    [-params.girthTopLeft, -params.girthTopLeft],
    [-params.cellWidth/2 - prevX2 + params.marginLeft, params.depthTopLeft],
    [0, -params.lengthLeft],
    [params.depthBottomLeft, params.depthBottomLeft],
    [params.girthBottomLeft, -params.girthBottomLeft],
    [-params.depthBottomLeft, -params.depthBottomLeft],
  ];
};
