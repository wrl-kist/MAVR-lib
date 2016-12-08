MAVR.MultiCamera = function () {
	this.type = 'MultiCamera';
	this.aspect = 1;
	//this.aspect = 1 / MAVR.Config.multiCameraNum;	
	this.cameras = [];
	this.eyeSep = MAVR.EYE_SEPARATION;
	
	var multiCameraNum = MAVR.Config.multiCameraNum;
	
	for( var i = 0 ; i < multiCameraNum ; i++ ) {
		this.cameras[i] = new THREE.PerspectiveCamera();
		this.cameras[i].layers.enable( i+1 );
		this.cameras[i].matrixAutoUpdate = false;
	}
};

MAVR.MultiCamera.prototype = {
	constructor: MAVR.MultiCamera,

	update: ( function () {
		var focalLength, fov, aspect, near, far;
		var eyes = [];
		var multiCameraNum = MAVR.Config.multiCameraNum;
		var multiCameraCol = MAVR.Config.multiCameraCol;
		
		for( var i = 0 ; i < multiCameraNum ; i++ ) {
			eyes[i] = new THREE.Matrix4();
		}

		return function update ( camera ) {
			var needsUpdate = focalLength !== camera.focalLength || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far;

			if ( needsUpdate ) {
				focalLength = camera.focalLength;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;

				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				var projectionMatrix = camera.projectionMatrix.clone();				
				var eyeSepOnProjection = this.eyeSep * near / focalLength;
				var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
				//var ymax = near * Math.tan( THREE.Math.degToRad( fov * this.aspect ) );
				var xmin, xmax;

				// translate
				for( var i = 0 ; i < multiCameraNum ; i++ ) {
					eyes[i].elements[ 12 ] = - this.eyeSep + this.eyeSep * (i % multiCameraCol);
					
					xmin = - ymax * aspect + eyeSepOnProjection - eyeSepOnProjection * (i % multiCameraCol);
					xmax = ymax * aspect + eyeSepOnProjection - eyeSepOnProjection * (i % multiCameraCol);
	
					projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
					//projectionMatrix.elements[ 0 ] = multiCameraCol * near / ( xmax - xmin );					
					projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );
	
					this.cameras[i].projectionMatrix.copy( projectionMatrix );
				}
			}

			for( var i = 0 ; i < multiCameraNum ; i++ ) {
				this.cameras[i].matrixWorld.copy( camera.matrixWorld ).multiply( eyes[i] );
			}
		};
	} )()
};
