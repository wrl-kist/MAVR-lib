MAVR.Viewport = function () {
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	
	var objects = MAVR.Config.renderer.getWebGLScene().children;
	var camera = MAVR.Config.camera;
	
	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );
			
			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					MAVR.Editor.select( object.userData.object );

				} else {
					MAVR.Editor.select( object );

				}

			} else {

				MAVR.Editor.select( null );
				MAVR.Editor.signals.deselectObject.dispatch();
			}
		}
	}

	var domElement = MAVR.Config.renderer.getCSS3DRenderer().domElement;
	
	
	function onMouseDown( event ) {

		event.preventDefault();
		var array = getMousePosition( domElement, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		domElement.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( domElement, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		domElement.removeEventListener( 'mouseup', onMouseUp, false );

	}

	domElement.addEventListener( 'mousedown', onMouseDown, false );
	
};
