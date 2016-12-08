///////////////////////////////////////////////////////////////////////////
// 
//  Usage.
//  
//	MAVR.CompassInterface.watchHeading(function(result) {
//		// Do what you want when the function is called with success.
//	}, function(result) {
//		// Do what you want when the function is called with error.
//	}, { interval: 1000
//	});
//
///////////////////////////////////////////////////////////////////////////

MAVR.CompassInterface = {
	wrapResultWithJson: function(heading) {
		var result = {};
		
		result.success = true;
		result.data = { 'heading' : heading };
		
		return result;
	},

	getCurrentHeading: function(success, error, options) {
		this.headingSuccess = success;
		this.headingError = error;	
		window.mavrCompass.getCurrentHeading(options);
	},
	
	headingSuccess: undefined,
	headingError: undefined,
	
	headingCallback: function(heading) {
		var result = this.wrapResultWithJson(heading);
	
		if (result.success === true) {
			if (this.headingSuccess !== undefined ) {
				this.headingSuccess(result);
			}			
		} else {
			if (this.headingError !== undefined ) {
				this.headingError(result);
			}
		}
	},
	
	watchHeading: function(success, error, options) {
		this.watchSuccess = success;
		this.watchError = error;
		window.mavrCompass.watchHeading(options);
	},
	
	watchSuccess: undefined,
	watchError: undefined,
	
	watchCallback: function(heading) {
		var result = MAVR.CompassInterface.wrapResultWithJson(heading);
		
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
		window.mavrCompass.clearHeading();
	}
}