MAVR.Editor.Signal = function () {
	var SIGNALS = signals;
	this.signals = {
		selectObject : new SIGNALS.Signal(),
		deselectObject : new SIGNALS.Signal(),
		refreshSidebarObject3D : new SIGNALS.Signal(),
		transformModeChanged : new SIGNALS.Signal(),
		gridChanged : new SIGNALS.Signal(),
		snapChanged : new SIGNALS.Signal(),
		spaceChanged : new SIGNALS.Signal(),
		showGridChanged : new SIGNALS.Signal(),
		toggleOn : new SIGNALS.Signal(),
		toggleOff : new SIGNALS.Signal(),
		objectFocused : new SIGNALS.Signal()
	};
	
	//signal
	
	this.signals.transformModeChanged.add(function(mode) {
		MAVR.Editor.transformControls.setMode(mode);
	});

	this.signals.gridChanged.add(function( value ) {
		var scene = MAVR.Editor.sceneHelpers;
		for ( var  i = 0 ; i < scene.children.length ; i++ ) {
			scene.remove( scene.children[i] );
		}
		var grid = new THREE.GridHelper(value, 10);
		MAVR.Editor.sceneHelpers.add(grid);
	});

	this.signals.snapChanged.add(function(dist) {
		MAVR.Editor.transformControls.setTranslationSnap(dist);
	});

	this.signals.spaceChanged.add(function(space) {
		MAVR.Editor.transformControls.setSpace(space);
	});

	this.signals.showGridChanged.add(function(showGrid) {
		MAVR.Editor.grid.visible = showGrid;
	});
	
	this.signals.toggleOn.add(function() {
		MAVR.Editor.menubar.show();
		MAVR.Editor.sidebar.show();
		MAVR.Editor.toolbar.show();
		MAVR.SceneGraph.show();
	});
	
	this.signals.toggleOff.add(function() {
		MAVR.Editor.menubar.hide();
		MAVR.Editor.sidebar.hide();
		MAVR.Editor.toolbar.hide();
		MAVR.SceneGraph.hide();
	});
	
	this.signals.selectObject.add( function (object) {
		var scenegraphPrefix = MAVR.SceneGraph.getSceneGraphPrefix();
		var nodeID = scenegraphPrefix + object.userData.id;
		MAVR.SceneGraph.getSceneGraph().deselect_all();
		MAVR.SceneGraph.getSceneGraph().select_node(nodeID);
	});
	
	this.signals.deselectObject.add( function () {
		MAVR.SceneGraph.getSceneGraph().deselect_all();
		MAVR.Editor.sidebar.closeInfo();
	});
	
	this.signals.refreshSidebarObject3D.add(function(object) {

		if (object !== MAVR.Editor.selected)
			return;

		MAVR.Editor.sidebar.updateUI(object);
	});
	
	this.signals.selectObject.add(function(object) {
		MAVR.Editor.sidebar.updateUI(object);
		MAVR.Editor.sidebar.openInfo();
	});

};
