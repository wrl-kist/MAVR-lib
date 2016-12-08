MAVR.AnnotationObject = function() {
	MAVR.VirtualObject.call( this );
	
	this.type = 'AnnotationObject';
	
	var that = this;
	var object3d;
	
	this.update = function() {
		
	};
	
	this.getWebGLElement = function() {
		return object3d;
	};
}

MAVR.AnnotationObject.prototype = Object.create( MAVR.AnnotationObject.prototype );
MAVR.AnnotationObject.prototype.constructor = MAVR.VirtualObject;