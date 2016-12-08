///////////////////////////////////////////////////////////////////////////
// 
//  Usage.
//  
//	MAVR.ScreenOrientation.watchOrientation(function(result) {
//		// Do what you want when the function is called with success.
//	}, function(result) {
//		// Do what you want when the function is called with error.
//	}, { interval: 1000
//	});
//
///////////////////////////////////////////////////////////////////////////

MAVR.ScreenOrientation = {
	// current value of the orientation					

	wrapResultWithJson: function(orientation) {
		var result = {};
		
		if(orientation !== undefined) {
			result.success = true;
			result.data = orientation;
		}
		else {
			result.success = false;
		}
		
		return result;
	},

	getCurrentOrientation: function(success, error, options) {
		var orientation = window.screen.orientation;
		var result = this.wrapResultWithJson(orientation);
		
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
			var orientation = window.screen.orientation;		
			var result = MAVR.ScreenOrientation.wrapResultWithJson(orientation);
			
			MAVR.ScreenOrientation.watchCallback(result);
		}, options.interval);	
	},
	
	watchCallback: function(result) {
			console.log(JSON.stringify(result));	
	
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
	
	clearOrientation: function() {
		clearInterval(this.watchOrientationID);
	}
}