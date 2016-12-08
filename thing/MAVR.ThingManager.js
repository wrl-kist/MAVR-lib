MAVR.ThingManager = function () {
	var UUIDs = new Hashtable();
	var reverseUUIDs = new Hashtable();
	var annotations = new Hashtable();
	
	this.generateUUID = function() {
		var genUUID = uuid.v4();
		
		return genUUID;
	}
	
	this.getThing = function(uuid) {
		return UUIDs.get(uuid);
	}
	
	this.getThingUUID = function(origin) {
		return reverseUUIDs.get(origin);
	}
	
	this.setThing = function(uuid, value) {
		UUIDs.put(uuid, value);
		reverseUUIDs.put(value.origin, uuid);
	}
	
	this.setAnnotationTypeTarget = function(annotation, target) {
		annotations.put(annotation, target);
	}
	
	this.getAnnotationTypeTarget = function(annotation) {
		return annotations.get(annotation);
	}
};
