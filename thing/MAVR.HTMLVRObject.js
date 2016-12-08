MAVR.HTMLVRObject = function(domElement, opts, userData) {
	MAVR.VirtualObject.call( this );
	
	this.type = 'HTMLVRObject';
	
	opts = opts	|| {};
	opts.elementW = opts.elementW	!== undefined	? opts.elementW	: 768;
	opts.planeW = opts.planeW !== undefined	? opts.planeW	: 1;
	opts.planeH = opts.planeH !== undefined	? opts.planeH	: 3/4;
	opts.object3d = opts.object3d !== undefined	? opts.object3d	: null;
	var domElement = domElement;
	var object3d;
	var cssScene = MAVR.Config.renderer.getCSS3DScene();
	
	var planeW	= opts.planeW;
	var planeH	= opts.planeH;
	var updateTextureFlag = false;
	
	if( opts.object3d === null ){
		var planeMaterial = new THREE.MeshBasicMaterial({
			opacity: 0,
			blending: THREE.NoBlending,
			side: THREE.DoubleSide,
		});
		
		if( (opts.useTexture === undefined) || (opts.useTexture === false) ) {
			planeMaterial.color = new THREE.Color('black');
		}
		
		var geometry = new THREE.PlaneGeometry( opts.planeW, opts.planeH );
		object3d = new THREE.Mesh( geometry, planeMaterial );
	} else {
		object3d = opts.object3d;
	}
	
	var aspectRatio = planeH / planeW;
	var elementWidth = opts.elementW;
	var elementHeight	= elementWidth * aspectRatio;
	
	object3d = this.applyTransform(object3d, opts.transform);
	
	this.setDomElement = function(newDomElement){
		var oldDomElement	= domElement;// remove the oldDomElement
		
		if( oldDomElement.parentNode ){
			oldDomElement.parentNode.removeChild(oldDomElement);
		}
		
		domElement = newDomElement;	// update local variables	
		cssObject.element	= domElement;	// update cssObject
		setDomElementSize();	// reset the size of the domElement
	}
	
	function setDomElementSize(){
		domElement.style.width	= elementWidth  + "px";
		domElement.style.height	= elementHeight + "px";
	}
	
	setDomElementSize();
	
	var cssObject	= new THREE.CSS3DObject( domElement );
	cssObject.scale.set(1,1,1).multiplyScalar(MAVR.Config.renderer.getCSSFactor() / (elementWidth / planeW));
	
	if (userData !== undefined) {
		object3d.userData = userData;
		cssObject.userData = userData;
	}
	
	cssObject.userData.VRobject	= this;	// hook cssObhect to annotation
	
	//////////////////////////////////////////////////////////////////////////////////
	//		hook event so cssObject is attached to cssScene when object3d is added/removed
	//////////////////////////////////////////////////////////////////////////////////
	object3d.addEventListener('added', function(event){
		cssScene.add(cssObject);
	});
	
	object3d.addEventListener('removed', function(event){
		cssScene.remove(cssObject);
	});
	
	this.setProperty(userData);
	this.setupAnimate(object3d, opts.animation);
	
	this.update = function() {
		object3d.updateMatrixWorld();
		var worldMatrix	= object3d.matrixWorld;

		// get position/quaternion/scale of object3d
		var position	= new THREE.Vector3();
		var scale	= new THREE.Vector3();
		var quaternion	= new THREE.Quaternion();
		worldMatrix.decompose(position, quaternion, scale);

		cssObject.quaternion.copy(quaternion);	// handle quaternion

		// handle position
		cssObject.position.copy(position).multiplyScalar(MAVR.Config.renderer.getCSSFactor());
		
		// handle scale
		var scaleFactor	= elementWidth / (object3d.geometry.parameters.width * scale.x);
		cssObject.scale.set(1,1,1).multiplyScalar(MAVR.Config.renderer.getCSSFactor() / scaleFactor);
		
		if ( updateTextureFlag === true ) {
			var element = new MAVR.HTMLElement();
			
			element.createHTML2Texture(domElement, function( texture ) {
				object3d.material.map = texture;	
			});
		}
	};
	
	this.updateTexture = function(texture, flag) {
		object3d.material.map = texture;
		object3d.material.transparent = true;
		object3d.material.blending = THREE.NormalBlending;
		object3d.material.opacity = 1;
		
		if( flag !== undefined ) {
			updateTextureFlag = flag;
		}
	}
	
	this.getWebGLElement = function() {
		return object3d;
	};
	
	this.getDomElement = function() {
		return domElement;
	};
	
	this.getCSS3DElement = function() {
		return cssObject;
	};
}

MAVR.HTMLVRObject.prototype = Object.create( MAVR.VirtualObject.prototype );
MAVR.HTMLVRObject.prototype.constructor = MAVR.HTMLVRObject;