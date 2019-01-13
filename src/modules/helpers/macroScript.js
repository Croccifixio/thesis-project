export const getMacroHeader = () => `
  var MIN_FREQ = '1.5 GHz'
      MAX_FREQ = '3.3 GHz';

  (function clearProject() {
		App.getActiveProject().getCircuitComponentDefinitionList().clear()
		App.getActiveProject().getCircuitComponentList().clear()
		App.getActiveProject().getCircuitComponentList().clear()
		App.getActiveProject().getExternalExcitationList().clear()
		App.getActiveProject().getFarZoneSensorList().clear()
		App.getActiveProject().getGraphList().clear()
		App.getActiveProject().getGrid().removeAllManualGridRegions()
		App.getActiveProject().getMaterialList().clear()
		App.getActiveProject().getNearFieldSensorList().clear()
		App.getActiveProject().getSensorDataDefinitionList().clear()
		App.getActiveProject().getWaveformList().clear()
		App.getActiveProject().getWaveguideList().clear()
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
    App.getActiveProject().setUseAutomaticFrequencyRangeOfInterest( false )
    App.getActiveProject().getUserDefinedFrequencyRangeOfInterest().set( MIN_FREQ, MAX_FREQ )
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
    model.getCoordinateSystem().translate(new Cartesian3D( 0.0, 0.0, -0.001 ))

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
    //App.getActiveProject().getGeometryAssembly().append( conductor )
  }( conductor ));

  View.zoomToExtents();

  (function createSourcePlaneWave() {
    var planeWave = new PlaneWave()
    var waveModel = AutomaticRangeBasedWaveformShape( "Automatic WaveForm" )
    waveModel.name = "Automatic for "+MIN_FREQ+" to "+MAX_FREQ
    waveForm = new Waveform( waveModel )
    waveForm.name = "Automatic for "+MIN_FREQ+" to "+MAX_FREQ
    planeWave.setWaveform( waveForm )
    planeWave.name = "Plane Wave"
    App.getActiveProject().getExternalExcitationList().addExternalExcitation( planeWave )
  })();

  (function createPlaneSensor() {
    var sensor = new SurfaceSensor()
    var sensorGeometry = new RectangleSurfaceGeometry()
    var sensorDataDefinition = new SurfaceSensorDataDefinition()

    sensorGeometry.getCoordinateSystem().setPrimaryAxis(0)
    sensorGeometry.getCoordinateSystem().setSecondaryAxis(1)
    sensorDataDefinition.name = 'Surface Sensor'
    sensorDataDefinition.setCollectEFieldsVsTime( true )
    sensorDataDefinition.setCollectHFieldsVsTime( true )
    sensorGeometry.setCorner1( new Cartesian2D( '-30 mm', '-30 mm' ) )
    sensorGeometry.setCorner2( new Cartesian2D( '30 mm', '30 mm' ) )
    sensor.name = 'Surface Sensor'
    sensor.setGeometry( sensorGeometry )
    sensor.setDataDefinition( sensorDataDefinition )

    App.getActiveProject().getNearFieldSensorList().addNearFieldSensor( sensor )
  })();

  (function queuePlaneWaveSimulation() {
    //...
  })();

  (function runSimulations() {
    App.saveCurrentProjectAs('C:\Users\Croccifixio\Downloads\xfdtd\a')
    App.startSimulationQueue()
  })();
`

export const getMacroLine = (shape) => shape.map((points, index) =>
  index < (shape.length - 1) ? drawGeometricLine(shape, points, index) : '').join('')


const drawGeometricLine = (shape, points, index) => `
  conductor.addEdge( new Line(new Cartesian3D(${points[0]}, ${points[1]}, 0), new Cartesian3D(${shape[index + 1][0]}, ${shape[index + 1][1]}, 0)) );
`
