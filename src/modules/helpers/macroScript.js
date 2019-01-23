export const getMacroHeader = () => `
  var MIN_FREQ = '5.5 GHz'
      MAX_FREQ = '9.5 GHz';

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

  (function definePECMaterial() {
    var pec = new Material()
    pec.name = "PEC"

    var pecPhysicalMaterial = new PhysicalMaterial()
    pecPhysicalMaterial.setElectricProperties( new PEC() )
    pecPhysicalMaterial.setMagneticProperties( new MagneticFreespace() )
    pec.setDetails( pecPhysicalMaterial )

    var pecBodyAppearance = pec.getAppearance()
    pecBodyAppearance.getFaceAppearance().setColor( new Color( 205, 92, 92 ) )
    pecBodyAppearance.getEdgeAppearance().setColor( new Color( 246, 110, 110 ) )
    pecBodyAppearance.getVertexAppearance().setColor( new Color( 164, 73, 73 ) )

    if( null != App.getActiveProject().getMaterialList().getMaterial( pec.name ) ) {
      App.getActiveProject().getMaterialList().removeMaterial( pec.name )
    }
    App.getActiveProject().getMaterialList().addMaterial( pec )
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
    var conductorMaterial = App.getActiveProject().getMaterialList().getMaterial( 'PEC' )

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

  (function createPointSensor() {
    var sensor = new PointSensor()
    var sensorGeometry = new PointPositionGeometry()
    var sensorDataDefinition = new PointSensorDataDefinition()

    sensorDataDefinition.name = 'Point Sensor Definition'
    sensorDataDefinition.setCollectEFieldsVsTime( true )
    sensorDataDefinition.setCollectHFieldsVsTime( true )
    sensorGeometry.setPosition( CoordinateSystemPosition( 0, 0, '15 mm' ) )
    sensor.name = 'Point Sensor'
    sensor.setGeometry( sensorGeometry )
    sensor.setDataDefinition( sensorDataDefinition )

    App.getActiveProject().getNearFieldSensorList().addNearFieldSensor( sensor )
  })();

  //(function createPlaneSensor() {
  //  var sensor = new SurfaceSensor()
  //  var sensorGeometry = new RectangleSurfaceGeometry()
  //  var sensorDataDefinition = new SurfaceSensorDataDefinition()
  //
  //  sensorGeometry.getCoordinateSystem().setPrimaryAxis(0)
  //  sensorGeometry.getCoordinateSystem().setSecondaryAxis(1)
  //  sensorDataDefinition.name = 'Surface Sensor'
  //  sensorDataDefinition.setCollectEFieldsVsTime( true )
  //  sensorDataDefinition.setCollectHFieldsVsTime( true )
  //  sensorGeometry.setCorner1( new Cartesian2D( '-30 mm', '-30 mm' ) )
  //  sensorGeometry.setCorner2( new Cartesian2D( '30 mm', '30 mm' ) )
  //  sensor.name = 'Surface Sensor'
  //  sensor.setGeometry( sensorGeometry )
  //  sensor.setDataDefinition( sensorDataDefinition )
  //
  //  App.getActiveProject().getNearFieldSensorList().addNearFieldSensor( sensor )
  //})();

  (function setPeriodicBoundaries() {
    var boundaryConditions = App.getActiveProject().getBoundaryConditions()
    boundaryConditions.absorptionType = BoundaryConditions.PML
    boundaryConditions.numPMLLayers = "7"

    boundaryConditions.xLowerBoundaryType = BoundaryConditions.Periodic
    boundaryConditions.yLowerBoundaryType = BoundaryConditions.Periodic

    boundaryConditions.xUpperBoundaryType = BoundaryConditions.Periodic
    boundaryConditions.yUpperBoundaryType = BoundaryConditions.Periodic
  })();

  (function createSimulation() {
    var newSimData = App.getActiveProject().getNewSimulationData()
    var terminationCriteria = newSimData.getTerminationCriteria()

    terminationCriteria.setConvergenceThreshold(-30)
    terminationCriteria.setMinimumSimulationTime('0.01 us')
    terminationCriteria.setMaximumSimulationTime('0.02 us')
    terminationCriteria.setMaximumWallClockTime('0')

    newSimData.setTerminationCriteria(terminationCriteria)
    newSimData.excitationType = NewSimulationData.ExternalExcitation
    newSimData.getExternalExcitationList().getExternalExcitation('Plane Wave')

    App.getActiveProject().createSimulation()
  })();

  (function runSimulations() {
    var simIds = App.getActiveProject().getSimulationIds()
    var simId = simIds[simIds.length - 1]
    App.saveCurrentProject()
    App.startSimulationQueue()
  })();

  function readSimulationResults() {
    var query = new ResultQuery()
    query.projectId = query.getAvailableProjectIds()[0]
    query.simulationId = query.getAvailableSimulationIds()[0]
    query.runId = query.getAvailableRunIds()[0]
    query.sensorType = ResultQuery.CircuitComponent
    query.sensorId = query.getAvailableSensorIds()[0]
    Output.println( ResultUtils.getComponentTable( query ) )
    query.timeDependence = ResultQuery.Transient
    query.resultType = ResultQuery.E
    query.fieldScatter = ResultQuery.TotalField
    query.resultComponent = ResultQuery.X // only y-component //VectorMagnitude
    query.dataTransform = ResultQuery.Fft
    query.fftSize = 16
    query.complexPart = ResultQuery.ComplexMagnitude
    query.surfaceInterpolationResolution = ResultQuery.NoInterpolation
    query.setDimensionRange( "Time" , 0, '10 ms' )

    Output.println("Time Dimension Max: "+query.getDimensionMax("Time"))

    var result
    result = new ResultDataSet( "" )
    result.setQuery(query)
  }

  function waitForSimulation() {
    App.sleep(10000)

    if (!App.isSimulationQueueStarted()) readSimulationResults()
    else waitForSimulation()
  }

  //waitForSimulation()
`

export const getMacroLine = (shape) => shape.map((points, index) =>
  index < (shape.length - 1) ? drawGeometricLine(shape, points, index) : '').join('')


const drawGeometricLine = (shape, points, index) => `
  conductor.addEdge( new Line(new Cartesian3D(${points[0]}, ${points[1]}, 0), new Cartesian3D(${shape[index + 1][0]}, ${shape[index + 1][1]}, 0)) );
`
