
MAVR.Menubar.File = function (  ) {

	var container = new MAVR.UI.ButtonGroup();

	var title = new MAVR.UI.Dropdown_toggle();
	title.setTextContent( 'File' );
	container.add( title );

	var options = new MAVR.UI.Dropdown_menu();
	container.add( options );

	// New

	var row = new MAVR.UI.Row();
	row.setText( 'New' );
	row.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
		}
	} );
	options.add( row );

	// Import

	var row = new MAVR.UI.Row();
	row.setText( 'Import' );
	row.onClick( function () {

	} );
	options.add( row );

	return container;

};
