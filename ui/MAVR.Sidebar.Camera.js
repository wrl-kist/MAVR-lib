MAVR.Sidebar.Camera = function () {
	
	var container = new MAVR.UI.Panel();

	// type

	var objectTypeRow = new MAVR.UI.Row();
	var objectType = new MAVR.UI.Text();

	objectTypeRow.add(new MAVR.UI.Text('Type').setWidth('90px'));
	objectTypeRow.add(objectType);

	container.add(objectTypeRow);

	// position

	var objectPositionRow = new MAVR.UI.Row();
	var objectPositionX = new MAVR.UI.Number().setWidth('80px').onChange(update);
	var objectPositionY = new MAVR.UI.Number().setWidth('80px').onChange(update);
	var objectPositionZ = new MAVR.UI.Number().setWidth('80px').onChange(update);

	objectPositionRow.add(new MAVR.UI.Text('Position').setWidth('90px'));
	objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);

	container.add(objectPositionRow);

	// rotation

	var objectRotationRow = new MAVR.UI.Row();
	var objectRotationX = new MAVR.UI.Number().setWidth('80px').onChange(update);
	var objectRotationY = new MAVR.UI.Number().setWidth('80px').onChange(update);
	var objectRotationZ = new MAVR.UI.Number().setWidth('80px').onChange(update);

	objectRotationRow.add(new MAVR.UI.Text('Rotation').setWidth('90px'));
	objectRotationRow.add(objectRotationX, objectRotationY, objectRotationZ);

	container.add(objectRotationRow);

	
	// fov

	var objectFovRow = new MAVR.UI.Row();
	var objectFov = new MAVR.UI.Number().onChange( update );

	objectFovRow.add( new MAVR.UI.Text( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );
	
	// near

	var objectNearRow = new MAVR.UI.Row();
	var objectNear = new MAVR.UI.Number().onChange( update );

	objectNearRow.add( new MAVR.UI.Text( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new MAVR.UI.Row();
	var objectFar = new MAVR.UI.Number().onChange( update );

	objectFarRow.add( new MAVR.UI.Text( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	function update() {

		var object = MAVR.Config.camera;

		if (object !== null) {

			var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());
			if (object.position.distanceTo(newPosition) >= 0.01) {

				object.position.copy(newPosition);
				object.updateMatrixWorld( true );
				object.updateProjectionMatrix();
			}

			var newRotation = new THREE.Euler(objectRotationX.getValue(), objectRotationY.getValue(), objectRotationZ.getValue());
			if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {
				
				object.rotation.copy(newRotation);
				object.updateMatrixWorld( true );
				object.updateProjectionMatrix();
			}
			
			if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {
				
				object.fov = objectFov.getValue();
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {
				
				object.near = objectNear.getValue();
				object.updateProjectionMatrix();
			}

			if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {
				
				object.far = objectFar.getValue();
				object.updateProjectionMatrix();
			}
		
		}
	}

	this.updateUI = function(object) {
		objectType.setValue(object.type);

		objectPositionX.setValue(object.position.x);
		objectPositionY.setValue(object.position.y);
		objectPositionZ.setValue(object.position.z);

		objectRotationX.setValue(object.rotation.x);
		objectRotationY.setValue(object.rotation.y);
		objectRotationZ.setValue(object.rotation.z);

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}
	};
	
	this.updateUI(MAVR.Config.camera);
	
	this.show = function() {
		container.setDisplay('block');
	};

	this.hide = function() {
		container.setDisplay('none');
	};
	
	this.getContainer = function() {
		return container;	
	};
};
