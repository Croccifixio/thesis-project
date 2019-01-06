export const getMacroHeader = () => `
  App.getActiveProject().getGeometryAssembly().clear()
  ${addMaterials()}
  ${setFrequencyRange()}
  var shape = new Sketch()
`

export const getMacroFooter = () => `
  var depth = 0.0001
  var extrude = Extrude(shape, depth)
  var name = "ring"
	var recipe = new Recipe()
	recipe.append(extrude)
	var m = new Model()
	m.setRecipe(recipe)
	m.name = name
	App.getActiveProject().getGeometryAssembly().append(m)
  App.getActiveProject().getGeometryAssembly().append(shape)
  View.zoomToExtents()
`

export const getMacroLine = (shape) => shape.map((points, index) =>
  index < (shape.length - 1) ? drawGeometricLine(shape, points, index) : '').join('')



const addMaterials = () => `
  Output.println("Creating Materials Definitions")
  var pmc = new Material()
  pmc.name = "PMC"

  var pmcPhysicalMaterial = new PhysicalMaterial()
  pmcPhysicalMaterial.setMagneticProperties( new PMC() )
  pmcPhysicalMaterial.setElectricProperties( new ElectricFreespace() )
  pmc.setDetails( pmcPhysicalMaterial )

  var pmcBodyAppearance = pmc.getAppearance()
  pmcBodyAppearance.getFaceAppearance().setColor( new Color( 205, 92, 92 ) )
  pmcBodyAppearance.getEdgeAppearance().setColor( new Color( 246, 110, 110 ) )
  pmcBodyAppearance.getVertexAppearance().setColor( new Color( 164, 73, 73 ) )

  if( null != App.getActiveProject().getMaterialList().getMaterial( pmc.name ) ) {
    App.getActiveProject().getMaterialList().removeMaterial( pmc.name )
  }
  App.getActiveProject().getMaterialList().addMaterial( pmc )

  var substrate = new Material()
  substrate.name = "substrate"

  var substratePhysicalMaterial = new PhysicalMaterial()
	var electricIsotropic = new ElectricIsotropic()
  electricIsotropic.setParameters( new ElectricNormalParameters( 3, 0 ) )
  substratePhysicalMaterial.setMagneticProperties( new MagneticFreespace() )
  substratePhysicalMaterial.setElectricProperties( electricIsotropic )
  substrate.setDetails( substratePhysicalMaterial )

  var substrateBodyAppearance = substrate.getAppearance()
  substrateBodyAppearance.getFaceAppearance().setColor( new Color( 46, 139, 87 ) )
  substrateBodyAppearance.getEdgeAppearance().setColor( new Color( 55, 166, 104 ) )
  substrateBodyAppearance.getVertexAppearance().setColor( new Color( 36, 111, 69 ) )

  if( null != App.getActiveProject().getMaterialList().getMaterial( substrate.name ) ) {
    App.getActiveProject().getMaterialList().removeMaterial( substrate.name )
  }
  App.getActiveProject().getMaterialList().addMaterial( substrate )
`

const drawGeometricLine = (shape, points, index) => `
  shape.addEdge( new Line(new Cartesian3D(${points[0] / 1000}, ${points[1] / 1000}, 0), new Cartesian3D(${shape[index + 1][0] / 1000}, ${shape[index + 1][1] / 1000}, 0)) )
`

const setFrequencyRange = () => `
  App.getActiveProject().setUseAutomaticFrequencyRangeOfInterest(false)
  App.getActiveProject().getUserDefinedFrequencyRangeOfInterest().set('1.5 GHz', '3.3 GHz')
`
