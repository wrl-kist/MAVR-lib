
MAVR.Toolbar = function (  ) {

	var signals = MAVR.Editor.signals;

	var container = new MAVR.UI.Panel();
	container.setId( 'toolbar' );
	container.dom.className='Panel';

	var buttons = new MAVR.UI.Panel();
	buttons.dom.className='Panel';
	container.add( buttons );

	// translate / rotate / scale

	var translate = new MAVR.UI.Button( 'translate' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	buttons.add( translate );

	var rotate = new MAVR.UI.Button( 'rotate' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	buttons.add( rotate );

	var scale = new MAVR.UI.Button( 'scale' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	buttons.add( scale );

	// grid

	var grid = new MAVR.UI.Number( 300 ).setWidth( '40px' ).onChange( update );
	buttons.add( new MAVR.UI.Text( 'grid: ' ) );
	buttons.add( grid );

	var snap = new MAVR.UI.THREE.Boolean( false, 'snap' ).onChange( update );
	buttons.add( snap );

	var local = new MAVR.UI.THREE.Boolean( false, 'local' ).onChange( update );
	buttons.add( local );

	var showGrid = new MAVR.UI.THREE.Boolean( true, 'show' ).onChange( update );
	buttons.add( showGrid );

	function update() {
		signals.gridChanged.dispatch( grid.getValue() );
		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		signals.showGridChanged.dispatch( showGrid.getValue() );
	}
	
	this.getContainer = function () {
		return container;
	};
	
	this.show = function() {
		container.setDisplay('block');
	};

	this.hide = function() {
		container.setDisplay('none');
	};

};
