MAVR.Switchbar = function() {
	
	var signals = MAVR.Editor.signals;
	
	var container = new MAVR.UI.Panel();
	container.setId('switchbar');
	
	var toggleSwitch = new MAVR.UI.ToggleSwitch();
	container.add(toggleSwitch);

	toggleSwitch.getDom().bootstrapSwitch('state', true);
	toggleSwitch.getDom().on('switchChange.bootstrapSwitch', function(event, state) {
		if (state) {
			
			signals.toggleOn.dispatch();
			
		} else {
			
			signals.toggleOff.dispatch();
			
		}
	});

	this.getContainer = function() {
		return container;	
	};
};
