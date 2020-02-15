import macroHeader from '!!raw-loader!./_macroHeader'
import macroFooter from '!!raw-loader!./_macroFooter'

const SIMULATION_SETTINGS = {
  's-parameters': `
    newSimData.excitationType = NewSimulationData.DiscreteSources
    newSimData.enableSParameters = true
    newSimData.setPortAsActive(circuitComponent)
  `,
  'fft': `
    newSimData.excitationType = NewSimulationData.ExternalExcitation
  `,
}

export const getMacroHeader = () => macroHeader

export const getMacroFooter = (name, cell, settings) => macroFooter
  .replace('__CELL_WIDTH__', cell.cellWidth)
  .replace('__CELL_HEIGHT__', cell.cellHeight)
  .replace('__NAME__', name)
  .replace('__SIMULATION_SETTINGS__', SIMULATION_SETTINGS[settings])

export const getMacroLine = shape => shape.map((points, index) => index < (shape.length - 1)
  ? drawGeometricLine(shape, points, index)
  : ''
).join('')


const drawGeometricLine = (shape, points, index) => `
  conductor.addEdge( new Line(new Cartesian3D(${points[0]}, ${points[1]}, 0), new Cartesian3D(${shape[index + 1][0]}, ${shape[index + 1][1]}, 0)) )
`
