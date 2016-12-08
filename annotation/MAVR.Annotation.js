MAVR.Annotation = function () {
	var that = this;
	var targetURL;
	var annotations = new Hashtable();
	var _annotationObjectNum = 0;
	var _annotationObjectRecv = 0;
	var recursiveAnnotation = [];
	var lod;
	
	this.loadURL = function(url, callback) {
		$.ajax({
			url: url, 
			success: function(result) {
				that.loadAnnotation(result, callback);
			}, 
			error: function() {
				console.log("Annotation loadURL error");
			}
		});
	}
	
	this.loadAnnotation = function(annotation, callback) {
		targetURL = annotation.targetURL;
		
		this.loadLOD(annotation);
		
		for( var i = 0 ; i < annotation.body.length ; i++) {
			for( var j = 0 ; j < annotation.body[i].annotationObject.length ; j++) {
				_annotationObjectNum++;
				
				(function() {
					var resourceURL = annotation.body[i].annotationObject[j].resourceURL;
					var annotationType = targetURL + "-" + annotation.body[i].annotationType;
					var typeThingUUID = MAVR.Things.getThingUUID(annotationType);
					
					if ( typeThingUUID === null) {
						typeThingUUID = MAVR.Things.generateUUID();						
						MAVR.Things.setThing(typeThingUUID, { id:typeThingUUID, origin: annotationType, 
							type: MAVR.Type.AnnotationType, name: annotation.body[i].annotationType} );
						
						MAVR.Things.setAnnotationTypeTarget(annotation.body[i].annotationType, targetURL);
					}
					
					var vrObjThing = MAVR.Things.generateUUID();
					var vrObjID = annotationType + "-" + annotation.body[i].level + "-" + j + "-" + resourceURL;
					vrObjID = vrObjID.replace(/:/gi, ":").replace(/\//gi, "_");
					var vrObjProfile = { id: vrObjThing, origin: vrObjID, draw: false,
							target: targetURL, annotationType: annotation.body[i].annotationType, level: annotation.body[i].level, 
							index: j, resourceURL: resourceURL, size: annotation.body[i].annotationObject[j].size, 
							transform: { position: annotation.body[i].annotationObject[j].position,
							rotation: annotation.body[i].annotationObject[j].rotation, scale: annotation.body[i].annotationObject[j].scale} };
					
					// check annotationURL
					if ( annotation.body[i].annotationObject[j].annotationURL !== undefined ) {						
						recursiveAnnotation.push({url: annotation.body[i].annotationObject[j].annotationURL, target: vrObjThing});
					}
					
					// check annotationObjects
					if ( annotation.body[i].annotationObject[j].annotationObjects !== undefined ) {
						recursiveAnnotation.push({json: annotation.body[i].annotationObject[j].annotationObjects, target: vrObjThing});
					}
					
					// load vr object
					$.ajax({
						url: resourceURL,
						success: function(data) {
							vrObjProfile.name = data.name;
							vrObjProfile.type = data["@type"];
							vrObjProfile.description = data.description;
							vrObjProfile.size = data.size;
							vrObjProfile.category = data.category;
							vrObjProfile.resourceURL = data.resourceURL;
							
							MAVR.Things.setThing(vrObjThing, vrObjProfile );
							
							var objects = annotations.get(typeThingUUID);
							
							if( objects === null) {
								objects = [];
							}
							
							objects.push(vrObjThing);
							
							annotations.put(typeThingUUID, objects);
							_annotationObjectRecv++;
							
							if( _annotationObjectNum === _annotationObjectRecv ) {
								console.log("Annotation load completed")
								callback(recursiveAnnotation);
							}
						},
						error: function(data) {
							console.log("Annotation load error")
						}
					});
				})();
			}
		}
	}
	
	this.getTargetURL = function() {
		return targetURL;
	}
	
	this.getAnnotations = function() {
		return annotations;
	}
	
	this.showAnnotations = function() {
		var annotationTypes = annotations.keys();
		
		for( var i = 0 ; i < annotationTypes.length ; i++) {
			var annotationType = MAVR.Things.getThing(annotationTypes[i]);
			var objects = annotations.get(annotationTypes[i]);

			console.log("id: " + annotationType.id + ", type: " + annotationType.type +", origin: " + annotationType.origin);
			
			for( var j = 0 ; j < objects.length ; j++) {
				var object = MAVR.Things.getThing(objects[j]);
				
				console.log("\tid: " + object.id + ", type: " + object.type +", origin: " + object.origin);
			}
		}
	}
	
	this.loadLOD = function(annotation) {
		if(annotation.lod !== undefined) {
			lod = annotation.lod;
		}
	}
	
	this.getLOD = function() {
		return lod;
	}
};