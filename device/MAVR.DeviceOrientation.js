///////////////////////////////////////////////////////////////////////////
// 
//  Usage.
//  
//	MAVR.DeviceOrientation.watchOrientation(function(result) {
//		// Do what you want when the function is called with success.
//	}, function(result) {
//		// Do what you want when the function is called with error.
//	}, { interval: 1000
//	});
//
///////////////////////////////////////////////////////////////////////////

MAVR.DeviceOrientation = {
	// current value of the orientation
	orientation: undefined,
					
	initInstance: function() {
		// Check for support for DeviceOrientation event
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function(data) {
				MAVR.DeviceOrientation.orientation = data;
			}, false);
		}
	},
	
	wrapResultWithJson: function() {
		var result = {};
		
		if(orientation !== undefined) {
			result.success = true;
			result.data = MAVR.DeviceOrientation.orientation;
		}
		else {
			result.success = false;
		}
		
		return result;
	},

	getCurrentOrientation: function(success, error, options) {
		var result = this.wrapResultWithJson();
		
		if (result.success === true) {
			if (success !== undefined ) {
				success(result);
			}			
		} else {
			if (error !== undefined ) {
				error(result);
			}
		}
	},
	
	watchSuccess: undefined,
	watchError: undefined,	
	
	// Timer ID
	watchOrientationID: undefined,	
	
	watchOrientation: function(success, error, options) {
		this.watchSuccess = success;
		this.watchError = error;
		
		this.watchOrientationID = setInterval(function() {
			var result = MAVR.DeviceOrientation.wrapResultWithJson();
			MAVR.DeviceOrientation.watchCallback(result);
		}, options.interval);	
	},
	
	watchCallback: function(result) {
		if (result.success === true) {
			if (this.watchSuccess !== undefined ) {
				this.watchSuccess(result);
			}			
		} else {
			if (this.watchError !== undefined ) {
				this.watchError(result);
			}
		}
	},	
	
	clearHeading: function() {
		clearInterval(this.watchOrientationID);
	}
}

MAVR.DeviceOrientation.initInstance();