MAVR.Editor = function() {

	var renderer = MAVR.Config.renderer;

	var signal = new MAVR.Editor.Signal();
	this.signals = signal.signals;

	this.sceneHelpers = new THREE.Scene();
	
	var grid = new THREE.GridHelper(300, 10);
	grid.setColors(0x000000, 0x888888);
	this.sceneHelpers.add( grid );

	this.transformControls = new THREE.TransformControls(MAVR.Config.camera, renderer.getCSS3DRenderer().domElement);

	this.transformControls.addEventListener('change', function() {
		var object = this.object;
		if (object !== undefined) {
			MAVR.Editor.signals.refreshSidebarObject3D.dispatch(object);
		}
	});

	this.transformControls.addEventListener('mouseDown', function () {
		MAVR.Editor.controls.enabled = false;
	});
	
	this.transformControls.addEventListener('mouseUp', function () {
		MAVR.Editor.controls.enabled = true;
	});

	renderer.getWebGLScene().add(this.transformControls);

	this.controls = new THREE.EditorControls(MAVR.Config.camera, renderer.getCSS3DRenderer().domElement);

	
	
	this.controls.addEventListener('change', function() {
		MAVR.Editor.sidebar.updateCamera( MAVR.Config.camera );
		MAVR.Editor.transformControls.update();
	});                                                                                                               

	//scenegraph event
	
	var scenegraph = MAVR.SceneGraph.getSceneGraph();
	scenegraph.element.on("select_node.jstree", function(e, data) {
		var id = data.node.id.substring(5);
		var glScene = MAVR.Config.renderer.getWebGLScene();

		for (var i = 0, len = glScene.children.length ; i < len ; i++) {
			var userData = glScene.children[i].userData;
			if (userData.id === id) {
				if (userData.VRobject !== undefined) {
					MAVR.Editor.select(userData.VRobject.getWebGLElement());
				} else {
					MAVR.Editor.select(glScene.children[i]);
				}
			}
		}
	});

	// function

	this.init = function() {

		this.viewport = new MAVR.Viewport();

		this.menubar = new MAVR.Menubar();
		document.body.appendChild( this.menubar.getContainer().dom );

		this.toolbar = new MAVR.Toolbar();
		document.body.appendChild( this.toolbar.getContainer().dom );

		this.sidebar = new MAVR.Sidebar();
		document.body.appendChild( this.sidebar.getContainer().dom );

		this.switchbar = new MAVR.Switchbar();
		document.body.appendChild( this.switchbar.getContainer().dom );
	};

	this.select = function(object) {

		if (this.selected === object) {
			return;
		}

		this.selected = object;

		this.transformControls.detach();
		if (object !== null) {
			this.transformControls.attach(object);
			this.signals.selectObject.dispatch(object);
		}

	};

};
