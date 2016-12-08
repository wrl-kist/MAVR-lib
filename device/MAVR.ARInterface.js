MAVR.ARInterface = {
	eventListenerCallback: {
		'onCameraProjectionUpdated' : undefined,
		'onTargetLoaded'   : undefined,
		'onTargetDetected' : undefined,
		'onTargetMoved'	   : undefined,
		'onTargetMissed'   : undefined,
		'notifyActivateResult'  : undefined,
		'notifyDectivateResult' : undefined
	},

	initInstance: function() {
		window.mavrARTracker.ready();
	},	
	
	addTargets: function(lodObjects) {
		for(var i = 0; i < lodObjects.level.length; i++) {
			var featureUrl = lodObjects.level[i].featureURL;
			var metadataUrl = lodObjects.level[i].metadataURL;		
			
			window.mavrARTracker.addTarget(featureUrl, metadataUrl);
		}	
	},
	
	activeTarget : function(metadataUrl) {
		window.mavrARTracker.activateTrackersData(metadataUrl);
	},
	
	deactiveTarget: function(metadataUrl) {
		window.mavrARTracker.deactivateTrackersData(metadataUrl);	
	},

	clearTargets: function() {
		window.mavrARTracker.clearTargets(targetInfo);
	},		
	
	addEventListener : function(event, calback) {
		this.eventListenerCallback[event] = callback;
	},

	// Related to Vuforia for Augmented Reality
	// Update projection matrix to adjust ratio of the camera view to the screen size (width, height).
	updateCameraProjectionMatrix: function(matrix) {
		var callback = MAVR.ARInterface.eventListenerCallback.onCameraProjectionUpdated;
		if(callback !== undefined) {
			callback(matrix);
		}	
	},
	
	// activate target 
	// when loading process for tracking data is completely ended.
	onTargetLoaded: function(urlTarget) {
		var callback = MAVR.ARInterface.eventListenerCallback.onTargetLoaded;
		if(callback !== undefined) {
			callback(urlTarget);
		}
	},
	
	// Related to Vuforia for Augmented Reality
	// Notify target is detected on the video frames from the camera of the device.
	onTargetDetected: function(targetName) {
		var callback = MAVR.ARInterface.eventListenerCallback.onTargetDetected;
		if(callback !== undefined) {
			callback(targetName);
		}		
	},
	
	// Related to Vuforia for Augmented Reality
	// Update model view matrix to adjust location of orientations of augmented object in the screen of the device.
	onTargetMoved : function(modelViewMatrix) {
		var callback = MAVR.ARInterface.eventListenerCallback.onTargetMoved;
		if(callback !== undefined) {
			callback(modelViewMatrix);
		}			
	},
	
	// Related to Vuforia for Augmented Reality
	// Notify target is missed on the video frames from the camera of the device.
	onTargetMissed : function() {
		var callback = MAVR.ARInterface.eventListenerCallback.onTargetMissed;
		if(callback !== undefined) {
			callback();
		}		
	},
	
	onActivateResult: function(result) {
		var callback = MAVR.ARInterface.eventListenerCallback.notifyActivateResult;
		if(callback !== undefined) {
			callback(result);
		}		
	},
	
	onDeactivateResult: function(result) {
		var callback = MAVR.ARInterface.eventListenerCallback.notifyDeactivateResult;
		if(callback !== undefined) {
			callback(result);
		}		
	}	
};