MAVR.Sidebar.Object = function () {
	
	var container = new MAVR.UI.Panel();
	container.setId('sidebar');

	// type

	var objectTypeRow = new MAVR.UI.Row();
	var objectType = new MAVR.UI.Text();

	objectTypeRow.add(new MAVR.UI.Text('Type').setWidth('90px'));
	objectTypeRow.add(objectType);

	container.add(objectTypeRow);

	// uuid

	var objectUUIDRow = new MAVR.UI.Row();
	var objectUUID = new MAVR.UI.Text().setWidth('260px').setFontSize('12px');

	objectUUIDRow.add(new MAVR.UI.Text('UUID').setWidth('85px'));
	objectUUIDRow.add(objectUUID);

	container.add(objectUUIDRow);

	// name

	var objectNameRow = new MAVR.UI.Row();
	var objectName = new MAVR.UI.Text().setWidth('150px').setFontSize('12px');

	objectNameRow.add(new MAVR.UI.Text('Name').setWidth('90px'));
	objectNameRow.add(objectName);

	container.add(objectNameRow);

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

	// scale

	var objectScaleRow = new MAVR.UI.Row();
	var objectScaleLock = new MAVR.UI.Checkbox(true).setPosition('absolute').setLeft('75px');
	var objectScaleX = new MAVR.UI.Number(1).setWidth('80px').onChange(updateScaleX);
	var objectScaleY = new MAVR.UI.Number(1).setWidth('80px').onChange(updateScaleY);
	var objectScaleZ = new MAVR.UI.Number(1).setWidth('80px').onChange(updateScaleZ);

	objectScaleRow.add(new MAVR.UI.Text('Scale').setWidth('90px'));
	objectScaleRow.add(objectScaleLock);
	objectScaleRow.add(objectScaleX, objectScaleY, objectScaleZ);

	container.add(objectScaleRow);

	// shadow

	var objectShadowRow = new MAVR.UI.Row();

	objectShadowRow.add(new MAVR.UI.Text('Shadow').setWidth('90px'));

	var objectCastShadow = new MAVR.UI.THREE.Boolean(false, 'cast').onChange(update);
	objectShadowRow.add(objectCastShadow);

	var objectReceiveShadow = new MAVR.UI.THREE.Boolean(false, 'receive').onChange(update);
	objectShadowRow.add(objectReceiveShadow);

	container.add(objectShadowRow);

	//

	function updateScaleX() {
		var object = MAVR.Editor.selected;

		if (objectScaleLock.getValue() === true) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue(objectScaleY.getValue() * scale);
			objectScaleZ.setValue(objectScaleZ.getValue() * scale);
		}
		update();
	}

	function updateScaleY() {
		var object = MAVR.Editor.selected;

		if (objectScaleLock.getValue() === true) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue(objectScaleX.getValue() * scale);
			objectScaleZ.setValue(objectScaleZ.getValue() * scale);
		}
		update();
	}

	function updateScaleZ() {
		var object = MAVR.Editor.selected;

		if (objectScaleLock.getValue() === true) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue(objectScaleX.getValue() * scale);
			objectScaleY.setValue(objectScaleY.getValue() * scale);
		}
		update();
	}

	function update() {

		var object = MAVR.Editor.selected;

		if (object !== null) {

			var newPosition = new THREE.Vector3(objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue());
			if (object.position.distanceTo(newPosition) >= 0.01) {

				object.position.copy(newPosition);
				object.updateMatrixWorld(true);
			}

			var newRotation = new THREE.Euler(objectRotationX.getValue(), objectRotationY.getValue(), objectRotationZ.getValue());
			if (object.rotation.toVector3().distanceTo(newRotation.toVector3()) >= 0.01) {

				object.rotation.copy(newRotation);
				object.updateMatrixWorld(true);
			}

			var newScale = new THREE.Vector3(objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue());
			if (object.scale.distanceTo(newScale) >= 0.01) {

				object.scale.copy(newScale);
				object.updateMatrixWorld(true);
			}

			if (object.castShadow !== objectCastShadow.getValue()) {
				object.castShadow = objectCastShadow.getValue();
			}

			if (object.receiveShadow !== undefined) {

				if (object.receiveShadow !== objectReceiveShadow.getValue()) {
					object.receiveShadow = objectReceiveShadow.getValue();
					object.material.needsUpdate = true;
				}
			}
		}
	}

	this.updateUI = function(object) {
		objectType.setValue(object.type);

		objectUUID.setValue(object.uuid);
		objectName.setValue(object.userData.name);

		objectPositionX.setValue(object.position.x);
		objectPositionY.setValue(object.position.y);
		objectPositionZ.setValue(object.position.z);

		objectRotationX.setValue(object.rotation.x);
		objectRotationY.setValue(object.rotation.y);
		objectRotationZ.setValue(object.rotation.z);

		objectScaleX.setValue(object.scale.x);
		objectScaleY.setValue(object.scale.y);
		objectScaleZ.setValue(object.scale.z);

		if (object.castShadow !== undefined) {

			objectCastShadow.setValue(object.castShadow);
		}

		if (object.receiveShadow !== undefined) {

			objectReceiveShadow.setValue(object.receiveShadow);
		}
	};
	
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
