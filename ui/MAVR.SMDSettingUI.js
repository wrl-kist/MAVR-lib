MAVR.SMDSettingUI = function(MVStereoRenderer, defaultProfile, monitorProfiles) {
	var gui;
	var myConfig = defaultProfile;
	var renderer = MVStereoRenderer;
	
	var guiItem = {
		// message: 'dat.gui',
		monitorType : myConfig.name, // 40 viewpoints, 81 viewpoints
		viewOffsetTranslate : 0.0,
		viewOffsetRotate : 0.17,
		viewFocalLength : 0.0,
		startViewIndex : 33,
		viewOffsetDirFlipping : false,
		animationVelocity : 1.0,
		useAnimation : true,
		showExternalViewIndexBMP : false,
		useExternalViewIndexMap : false,
		overlayViewIndexMap : false,
		showFboTable : false,
		useDebugMode : false,
		curViewIndexForDebugMode : 0
	};

	guiItem.viewCount = parseFloat(myConfig.viewCount);
	guiItem.viewOffsetRotate = parseFloat(myConfig.viewOffsetRotate);
	guiItem.viewFocalLength = parseFloat(myConfig.viewFocalLength);	

	this.initGUI = function() {		
		var uniformsForStereo = renderer.uniforms;
	
		gui = new dat.GUI({
			load : JSON,
			autoPlace : true,
			width : 500
		});

		gui.remember(guiItem);

		var profileNames = [];

		for (var i = 0; i < monitorProfiles.length; i++) {
			profileNames[i] = monitorProfiles[i].name;
		};
		
		gui.add(guiItem, 'monitorType', profileNames).listen().onChange(function(newValue) {
			for (var i = 0; i < monitorProfiles.length; i++) {
				if (newValue == monitorProfiles[i].name)
					myConfig = monitorProfiles[i];
			};
			console.log(myConfig);
			
			guiItem.viewCount = parseFloat(myConfig.viewCount);
			guiItem.viewOffsetRotate = parseFloat(myConfig.viewOffsetRotate);
			guiItem.viewFocalLength = parseFloat(myConfig.viewFocalLength);	
			renderer.reInitMonitorType(window.innerWidth, window.innerHeight, myConfig);
		});
		
		gui.add(guiItem, 'viewOffsetRotate', 0.0, 0.3, 0.001).listen().onChange(function(newValue) {
			renderer.viewOffsetRotate = newValue;
			console.log('viewOffsetRotate :', renderer.viewOffsetRotate);
		});

		gui.add(guiItem, 'viewFocalLength', 0.0, 1.0, 0.001).listen().onChange(function(newValue) {
			renderer.viewFocalLength = newValue;
			console.log('viewFocalLength :', renderer.viewFocalLength);
		});
		
		gui.add(guiItem, 'startViewIndex', 0, 80, 1).listen().onChange(function(newValue) {
			guiItem.startViewIndex = newValue;
			uniformsForStereo.startViewIndex.value = parseFloat(parseInt(guiItem.startViewIndex));
			console.log('startViewIndex :', parseInt(guiItem.startViewIndex));
		});

		gui.add(guiItem, 'animationVelocity', 0.0, 10.0, 0.0001).listen().onChange(function(newValue) {
			guiItem.animationVelocity = newValue;
			console.log('vel : ', guiItem.animationVelocity);
		});

		gui.add(guiItem, 'useAnimation').listen();
		
		var debugFolder = gui.addFolder('Debug');
		debugFolder.open();
		
		debugFolder.add(guiItem, 'overlayViewIndexMap').listen().onChange(function(newValue) {
			uniformsForStereo.overlayViewIndexMap.value = newValue;
		});
		
		debugFolder.add(guiItem, 'showFboTable').listen().onChange(function(newValue) {
			uniformsForStereo.showFboTable.value = newValue;
		});
		
		debugFolder.add(guiItem, 'useDebugMode').listen().onChange(function(newValue) {
			
		});

		var indexUIArray = [];
		for (var i = 0; i < guiItem.viewCount; i++) {
			indexUIArray[i] = i;
		};
		
		debugFolder.add(guiItem, 'curViewIndexForDebugMode', indexUIArray).listen().onChange(function(newValue) {
			renderer.debugOption.curViewIndexForDebugMode = newValue;
		});
		
		gui.domElement.style.zIndex = 1;
	};
	
	this.exportUI = function() {
		var rememberedObjects = JSON.stringify( gui.__rememberedObjects );
		
		return rememberedObjects;	
	};
	
	this.importUI = function( json ) {
		var renderer = MAVR.Config.renderer.getMVStereoRenderer();
		
		for ( var i in guiItem) {			
			if ( json[i] !== undefined) {
				guiItem[i] = json[i];	
				renderer[i] = json[i];
			}
		}
	};
	
	this.getGuiItem = function () {
		return guiItem;
	};
};
