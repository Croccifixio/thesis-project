export const getMacroHeader = () => `
  (function clearProject() {
    App.getActiveProject().getGeometryAssembly().clear()
  }());

  (function definePMCMaterial() {
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
  }());

  var substrate = new Material();
  (function defineSubstrateMaterial() {
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
  }());

  (function setFrequencyRange() {
    App.getActiveProject().setUseAutomaticFrequencyRangeOfInterest(false)
    App.getActiveProject().getUserDefinedFrequencyRangeOfInterest().set('1.5 GHz', '3.3 GHz')
  }());

  var conductor = new Sketch();
`

export const getMacroFooter = (name, cell) => `
  (function renderSubstrate() {
    var cuboid = new Cuboid( ${cell.cellWidth}, ${cell.cellHeight}, 0.001 )
    var recipe = new Recipe
    recipe.append( cuboid )
    var model = new Model()
    model.setRecipe( recipe )
    model.name = "substrate"
    model.getCoordinateSystem().translate(new Cartesian3D( 0.0, 0.0, 0.0001 ))

    var substrateModel = App.getActiveProject().getGeometryAssembly().append( model )
    var substrateMaterial = App.getActiveProject().getMaterialList().getMaterial( 'substrate' )

    App.getActiveProject().setMaterial( substrateModel, substrateMaterial )
  }());

  (function renderConductor( conductor ) {
    var depth = 0.0001
    var extrude = Extrude( conductor, depth )
    var recipe = new Recipe()
    recipe.append( extrude )
    var model = new Model()
    model.setRecipe( recipe )
    model.name = "${name}"

    var conductorModel = App.getActiveProject().getGeometryAssembly().append( model )
    var conductorMaterial = App.getActiveProject().getMaterialList().getMaterial( 'PMC' )

    App.getActiveProject().setMaterial( conductorModel, conductorMaterial )
    App.getActiveProject().getGeometryAssembly().append( conductor )
  }( conductor ));

  View.zoomToExtents();
`

export const getMacroLine = (shape) => shape.map((points, index) =>
  index < (shape.length - 1) ? drawGeometricLine(shape, points, index) : '').join('')


const drawGeometricLine = (shape, points, index) => `
  conductor.addEdge( new Line(new Cartesian3D(${points[0]}, ${points[1]}, 0), new Cartesian3D(${shape[index + 1][0]}, ${shape[index + 1][1]}, 0)) );
`
