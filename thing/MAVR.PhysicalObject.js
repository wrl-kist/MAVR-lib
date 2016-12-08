MAVR.PhysicalObject = function() {
	MAVR.WebizedThing.call( this );
	
	this.type = 'PhysicalObject';	
}

MAVR.PhysicalObject.prototype = Object.create( MAVR.PhysicalObject.prototype );
MAVR.PhysicalObject.prototype.constructor = MAVR.WebizedThing;