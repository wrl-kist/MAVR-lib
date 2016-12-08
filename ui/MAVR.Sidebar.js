MAVR.Sidebar = function() {

	var signals = MAVR.Editor.signals;
	var container = new MAVR.UI.Panel();
	container.setId('side');
	
	var tab = new MAVR.UI.Tab();
	tab.event();
	container.add( tab );

	var tabSceneGraph = new MAVR.UI.TabMenu( '#scenegraph' );
	tabSceneGraph.setText( 'SceneGraph' );
	tabSceneGraph.select();
	tab.add( tabSceneGraph );
	
	var tabCamera = new MAVR.UI.TabMenu( '#camera' );
	tabCamera.setText( 'Camera' );	
	tab.add( tabCamera );
	
	container.add(tab);
	
	var tabContent = new MAVR.UI.TabContent();
	container.add(tabContent);
	
	var tabPanelSceneGraph = new MAVR.UI.TabPanel();
	tabPanelSceneGraph.setId( 'scenegraph' );
	tabPanelSceneGraph.select();
	
	$(document).ready( function () {
		$('#mavr-scenegraph').appendTo( tabPanelSceneGraph.dom );	
	});
	
	tabContent.add( tabPanelSceneGraph );
	
	var tabPanelCamera = new MAVR.UI.TabPanel();
	tabPanelCamera.setId( 'camera' );
	tabContent.add( tabPanelCamera );
	
	var camera = new MAVR.Sidebar.Camera();
	tabPanelCamera.add( camera.getContainer() );
	
	
	var objectSide = new MAVR.Sidebar.Object();
	container.add( objectSide.getContainer() );

	this.show = function() {
		container.setDisplay('block');
	};

	this.hide = function() {
		container.setDisplay('none');
	};
	
	this.openInfo = function() {
		objectSide.show();
	};
	
	this.closeInfo = function() {
		objectSide.hide();
	};
	
	this.updateUI = function(object) {
		objectSide.updateUI(object);
	};
	
	this.updateCamera = function ( object ) {
		camera.updateUI( object );
	};
	
	this.getContainer = function() {
		return container;	
	};
	
};
