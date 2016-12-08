MAVR.Menubar = function (  ) {

	var container = new MAVR.UI.Panel();
	container.setId( 'menubar' );

	container.add( new MAVR.Menubar.File(  ) );


	this.getContainer = function () {
		return container;	
	}
	
	this.show = function() {
		container.setDisplay('block');
	};

	this.hide = function() {
		container.setDisplay('none');
	};
};
