MAVR.MixedRenderer = function ( camera, opts ) {
	MAVR.Renderer.call( this );
	
	this.type = 'MixedRenderer';
	
	var autoUpdateObjects = true;
	var glCamera = camera;
	var glScene = new THREE.Scene();
	var cssScene = new THREE.Scene();
	var cssFactor = 1000;
	var cssCamera = new THREE.PerspectiveCamera(camera.fov, camera.aspect, 
												camera.near * cssFactor, camera.far * cssFactor);
	
	var glRenderer = new THREE.WebGLRenderer({alpha: true});
	
	if( opts !== undefined ) {
		glRenderer.setClearColor( (opts.clearColor !== undefined ) ? opts.clearColor : 0x000000 );
		glRenderer.autoClear = (opts.autoClear !== undefined ) ? opts.autoClear : false;
	} else {
		glRenderer.setClearColor( 0x000000 );
		glRenderer.autoClear = false;
	}
	
	glRenderer.setSize( window.innerWidth, window.innerHeight );
	glRenderer.domElement.style.pointerEvents = 'none';
	
	glRenderer.domElement.style.position = 'absolute';
	glRenderer.domElement.style.top	= '0px';
	glRenderer.domElement.style.width = '100%';
	glRenderer.domElement.style.height = '100%';

	var cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.domElement.style.position = 'absolute';
	cssRenderer.domElement.style.top = 0;
	cssRenderer.domElement.style.width = '100%'
	cssRenderer.domElement.style.height = '100%'
	cssRenderer.domElement.style.zIndex = -2;
	document.body.appendChild( cssRenderer.domElement );
	
	cssRenderer.domElement.appendChild( glRenderer.domElement );
	
	this.update = function() {
		MAVR.SceneGraph.update();
		
		cssCamera.quaternion.copy(camera.quaternion);
		cssCamera.position.copy(camera.position).multiplyScalar(cssFactor);
		
		if( autoUpdateObjects !== true )	{ 
			return; 
		}
		
		cssScene.traverse(function(cssObject) {
			if( cssObject instanceof THREE.Scene === true )	{
				return;
			}
			
			var vrobject = cssObject.userData.VRobject;
			
			if( vrobject === undefined ) {
				return; 
			}
			
			vrobject.update();
		});
		
		cssRenderer.render( cssScene, cssCamera );		
		glRenderer.render( glScene, glCamera );
	};
	
	this.getWebGLRenderer = function() {
		return glRenderer;
	};
	
	this.getCSS3DRenderer = function() {
		return cssRenderer;
	};
	
	this.getWebGLScene = function() {
		return glScene;
	};
	
	this.getCSS3DScene = function() {
		return cssScene;
	};
	
	this.getCSSFactor = function() {
		return cssFactor;
	};
}

MAVR.MixedRenderer.prototype = Object.create( MAVR.Renderer.prototype );
MAVR.MixedRenderer.prototype.constructor = MAVR.MixedRenderer;