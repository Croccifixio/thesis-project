export const getMacroHeader = () => `
  App.getActiveProject().getGeometryAssembly().clear()
  var s = new Sketch()
  `

export const getMacroFooter = () => `
  App.getActiveProject().getGeometryAssembly().append(s)
  View.zoomToExtents()
`

export const getMacroLine = (shape) => shape.map((points, index) =>
  index < (shape.length-1)
    ? `
        var line = new Line(new Cartesian3D(${points[0]}, ${points[1]}, 0), new Cartesian3D(${shape[index+1][0]}, ${shape[index+1][1]}, 0))
        s.addEdge(line)
      `
    : '').join('')
