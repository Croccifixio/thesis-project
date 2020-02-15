import { getMacroFooter, getMacroHeader, getMacroLine } from '../helpers'


const params = {
  marginVertical: 2000,
  marginHorizontal: 825,
  marginHorizontal: 825,
  thicknessVertical: 1000,
  thicknessHorizontal: 1000,
  stemHeight: 3000,
  stemWidth: 1000,
  capWidth: 7000,
  capHeight: 1000,
}


const constraints = {
  marginVertical: {
    min: 0,
    max: ['capHeight', 'stemHeight', 'thicknessVertical'],
    maxOffset: 100,
    maxAltOffset: 0,
  },
  marginHorizontal: {
    min: 0,
    max: ['capWidth', 'thicknessHorizontal'],
    maxOffset: 400,
    maxAltOffset: 0,
  },
  thicknessVertical: {
    min: 0,
    max: ['capHeight', 'stemHeight', 'marginVertical'],
    maxOffset: 100,
    maxAltOffset: 0,
  },
  thicknessHorizontal: {
    min: 0,
    max: ['capWidth', 'marginHorizontal'],
    maxOffset: 400,
    maxAltOffset: 0,
  },
  stemHeight: {
    min: 0,
    max: ['capHeight', 'thicknessVertical', 'marginVertical'],
    maxOffset: 100,
    maxAltOffset: 0,
  },
  stemWidth: {
    min: 0,
    max: ['-capWidth', 'cellWidth'],
    maxOffset: 300,
    maxAltOffset: 0,
  },
  capWidth: {
    min: 0,
    max: ['thicknessHorizontal'], // TODO: needs some thinking
    maxOffset: 0,
    maxAltOffset: 0,
  },
  capHeight: {
    min: 0,
    max: ['marginVertical', 'thicknessVertical', 'stemHeight'],
    maxOffset: 0,
    maxAltOffset: 0,
  },
}


const getOuterArray = (params) => {
  params = {
    ...params,
    outerWidth: params.cellWidth - params.marginHorizontal - params.marginHorizontal,
    outerHeight: params.cellHeight - params.marginVertical - params.marginVertical,
  }

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [t|r|b|l]  ->  top | right | bottom | left
  const yt = params.cellHeight / 2 - params.marginVertical,
        yb = -params.cellHeight / 2 + params.marginVertical,
        xr = params.cellWidth / 2 - params.marginHorizontal,
        xl = -params.cellWidth / 2 + params.marginHorizontal

  return [
    [xl, yb],
    [xr, yb],
    [xr, yt],
    [xl, yt],
    [xl, yb],
  ]
}


const getInnerArray = (params) => {
  params = {
    ...params,
    width: params.outerWidth - params.marginHorizontal - params.marginHorizontal,
    height: params.outerHeight - params.marginVertical - params.marginVertical,
    offsetTop: params.cellHeight / 2 - params.marginVertical - params.thicknessVertical,
    offsetRight: params.cellWidth / 2 - params.marginHorizontal - params.thicknessHorizontal,
    offsetBottom: -params.cellHeight / 2 + params.marginVertical + params.thicknessVertical,
    offsetLeft: -params.cellWidth / 2 + params.marginHorizontal + params.thicknessHorizontal,
  }

  // LEGEND:
  // [y|x]      ->  y axis | x axis
  // [t|r|b|l]  ->  top | right | bottom | left
  //
  // [y|x]  ->  y axis | x axis
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
        xcbl = -params.capWidth / 2

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
  ]
}


const surfaceSensorPosition = ({ cellHeight, marginVertical, thicknessVertical }) => (cellHeight / 2) - marginVertical - (thicknessVertical / 2)


const download = ({ cell, name, params, scale, settings, shapes }) => `
  ${getMacroHeader()}
  ${shapes.map(shape => getMacroLine(shape)).join('')}
  ${getMacroFooter({ cell, name, params, scale, settings, surfaceSensorPosition })}
`


export default {
  name: 'Rectangular T-shaped resonator',
  params,
  constraints,
  shapes: [
    {
      id: 1,
      points: getOuterArray,
    },
    {
      id: 2,
      inverse: true,
      points: getInnerArray,
    },
  ],
  download,
}
