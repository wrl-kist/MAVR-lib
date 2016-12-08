MAVR.WebGLVRObject = function() {
	MAVR.VirtualObject.call( this );
	
	this.type = 'WebGLVRObject';
	
	var that = this;
	var object3d;
		
	this.createObject = function(opts, userData) {
		opts = opts	|| {};
		
		var object3dGeometry, object3dMaterial;
		
		if( (opts.geometry instanceof THREE.Geometry) || (opts.geometry instanceof THREE.BufferGeometry)
				 || (opts.geometry instanceof THREE.PlaneBufferGeometry)) {
			object3dGeometry = opts.geometry;
		} else {
			switch(opts.geometry.type) {
				case MAVR.Geometry.Sphere:
					object3dGeometry = new THREE.SphereGeometry(opts.geometry.radius, opts.geometry.widthSegments, opts.geometry.heightSegments);
					break;

				case MAVR.Geometry.Box:
					object3dGeometry = new THREE.BoxGeometry(opts.geometry.width, opts.geometry.height, opts.geometry.depth);
					break;
					
				case MAVR.Geometry.Cylinder:
					object3dGeometry = new THREE.CylinderGeometry(opts.geometry.radiusTop, opts.geometry.radiusBottom, opts.geometry.height,
							opts.geometry.radiusSegments, opts.geometry.heightSegments);
					break;
				
				case MAVR.Geometry.Line:
					object3dGeometry = new THREE.Geometry();
					
					for( var j = 0 ; j < opts.geometry.vertex.length ; j++) {
						object3dGeometry.vertices.push(
							new THREE.Vector3(opts.geometry.vertex[j][0], opts.geometry.vertex[j][1], opts.geometry.vertex[j][2]));
					}
					break;
				
				case MAVR.Geometry.Ring:
					object3dGeometry = new THREE.RingGeometry(opts.geometry.innerRadius, opts.geometry.outerRadius, opts.geometry.thetaSegments);
					break;

				default:
					break;
			}
		}
		
		if( opts.material instanceof THREE.Material ) {
			object3dMaterial = opts.material;
		} else {
			switch(opts.material.type) {
				case MAVR.Material.Basic:
					object3dMaterial = new THREE.MeshBasicMaterial(opts.material.parameters);
					break;
					
				case MAVR.Material.Line:
					object3dMaterial = new THREE.LineBasicMaterial(opts.material.parameters);
					break;

				default:
					break;
			}

			if( opts.material.map !== undefined ) {
				object3dMaterial.map = new THREE.TextureLoader().load( opts.material.map );
			}
		}
		
		if( ( (object3dGeometry instanceof THREE.Geometry) || (object3dGeometry instanceof THREE.BufferGeometry) 
				|| (opts.geometry instanceof THREE.PlaneBufferGeometry)) && (object3dMaterial instanceof THREE.Material) ) {
			
			if( object3dMaterial instanceof THREE.LineBasicMaterial ) { 
				object3d = new THREE.Line( object3dGeometry, object3dMaterial );
			} else {
				object3d = new THREE.Mesh( object3dGeometry, object3dMaterial );
			}
			
			object3d.overdraw = true;
			
			if (userData !== undefined) {
				object3d.userData = userData;
			}
			
			object3d = this.applyTransform(object3d, opts.transform);
			this.setProperty(userData);
			this.setupAnimate(object3d, opts.animation);
		} else {
			console.log("WebGLVRObject creation error");
		}	
	}
	
	this.loadObject = function(object, opts, userData) {
		opts = opts	|| {};
		
		object3d = object;
		
		if (userData !== undefined) {
			object3d.userData = userData;
		}
		
		object3d = this.applyTransform(object3d, opts.transform);
		this.setProperty(userData);
		this.setupAnimate(object3d, opts.animation);
	}
	
	this.createObjectWithHTMLTexture = function(domelement, opts, userData, callback) {
		var element = new MAVR.HTMLElement();
		
		element.createHTML2Texture(domelement, function( texture ) {
			var planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side:THREE.DoubleSide });
			var geometry = new THREE.PlaneGeometry( opts.elementW, opts.elementH );
			var object = new THREE.Mesh( geometry, planeMaterial );
			
			object3d = object;
			
			that.loadObject(object3d, opts, userData);
			
			callback();
		});
	}
	
	this.update = function() {
		
	};
	
	this.getWebGLElement = function() {
		return object3d;
	};
}

MAVR.WebGLVRObject.prototype = Object.create( MAVR.WebGLVRObject.prototype );
MAVR.WebGLVRObject.prototype.constructor = MAVR.VirtualObject;