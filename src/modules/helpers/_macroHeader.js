var MIN_FREQ = '1 GHz'
    MAX_FREQ = '11 GHz'

;(function clearProject() {
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
}())

;(function definePECMaterial() {
  var pec = new Material()
  pec.name = 'PEC'

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
}())

var substrate = new Material()
;(function defineSubstrateMaterial() {
  substrate.name = 'Substrate'

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
}())

;(function setFrequencyRange() {
  App.getActiveProject().setUseAutomaticFrequencyRangeOfInterest( false )
  App.getActiveProject().getUserDefinedFrequencyRangeOfInterest().set( MIN_FREQ, MAX_FREQ )
}())

var conductor = new Sketch()
