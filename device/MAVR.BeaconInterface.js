MAVR.BeaconInterface = {
	getCurrentBeacons: function(success, error, options) {
		beaconSuccess = success;
		beaconError = error;
		window.mavrBeacon.getCurrentBeacons(options);
	},
	
	beaconSuccess: undefined,
	beaconError: undefined,
	
	beaconCallback: function(result) {
		if (result.success === true) {
			if (beaconSuccess !== undefined ) {
				beaconSuccess(result.data);
			}			
		} else {
			if (beaconError !== undefined ) {
				beaconError(result.data);
			}
		}
	},
	
	watchBeacons: function(success, error, options) {
		watchSuccess = success;
		watchError = error;
		window.mavrBeacon.watchBeacons(options);
	},
	
	watchSuccess: undefined,
	watchError: undefined,
	
	watchCallback: function(result) {
		if (result.success === true) {
			if (watchSuccess !== undefined ) {
				watchSuccess(result.data);
			}			
		} else {
			if (watchError !== undefined ) {
				watchError(result.data);
			}
		}
	},
	
	clearWatch: function() {
		window.mavrBeacon.clearWatch();
	}
}