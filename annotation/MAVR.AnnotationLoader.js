MAVR.AnnotationLoader = function () {
	var annotationSources = [];
	var callbackFtn;
	var that = this;
	var annotations = [];
	
	this.loadAnnotations = function(annotationList, callback, mode) {
		callbackFtn = callback;
		
		if (mode === "json") {
			this.buildJSONs(annotationList); 
			this.loadAnnotationJSON(0);
		} else if (mode === "html") {
			
		} else {
			this.buildURLs(annotationList); 
			this.loadAnnotationURL(0);
		}
	}
	
	this.buildURLs = function(annotationList) {
		for( var i = 0 ; i < annotationList.length ; i++ ) {
			annotationSources.push({url: annotationList[i]});
		}
	}
	
	this.buildJSONs = function(annotationList) {
		for( var i = 0 ; i < annotationList.length ; i++ ) {
			annotationSources.push({json: annotationList[i]});
		}
	}
	
	this.loadAnnotationURL = function(idx) {
		var annotation = new MAVR.Annotation();
		
		annotation.loadURL(annotationSources[idx].url, function(recursiveAnnotation) {
			var targetURL, targetThing;
			
			if( annotationSources[idx].target === undefined ) {
				targetURL = annotation.getTargetURL();
				targetThing = that.getTargetNodeID(targetURL);
			} else {
				targetThing = annotationSources[idx].target;
			}
			
			annotations.push({target:targetThing, annotation:annotation});
			
			if( recursiveAnnotation !== undefined ) {
				for( var i = 0 ; i < recursiveAnnotation.length ; i++) {
					annotationSources.push(recursiveAnnotation[i]);
				}				
			}
			
			idx++;
			if( idx !== annotationSources.length ) {
				that.loadAnnotationURL(idx);
			} else {
				callbackFtn();
			}
		});
	}
	
	this.loadAnnotationJSON = function(idx) {
		var annotation = new MAVR.Annotation();
		
		annotation.loadAnnotation(annotationSources[idx].json, function(recursiveAnnotation) {
			var targetURL, targetThing;
			
			if( annotationSources[idx].target === undefined ) {
				targetURL = annotation.getTargetURL();
				targetThing = that.getTargetNodeID(targetURL);
			} else {
				targetThing = annotationSources[idx].target;
			}
			
			annotations.push({target:targetThing, annotation:annotation});
			
			if( recursiveAnnotation !== undefined ) {
				for( var i = 0 ; i < recursiveAnnotation.length ; i++) {
					annotationSources.push(recursiveAnnotation[i]);					
				}
			}
			
			idx++;
			if( idx !== annotationSources.length ) {
				that.loadAnnotationJSON(idx);
			} else {
				callbackFtn();
			}
		});
	}

	this.getTargetNodeID = function(targetURL) {
		var targetThing = MAVR.Things.getThingUUID(targetURL);
		
		if ( targetThing === null) {
			targetThing = MAVR.Things.generateUUID();
			
			$.ajax({
				url: targetURL,
				async: false,
				success: function(data) {
					var targetProfile = { 
						id: targetThing, 
						origin:targetURL, 
						type: data["@type"], 
						name: data.name,
						description: data.description,
						category: data.category,
						resourceURL: data.resourceURL,
						draw: false 
					};

					MAVR.Things.setThing(targetThing, targetProfile );
					MAVR.SceneGraph.createNode(null, MAVR.Things.getThing(targetThing));
					
					console.log("Target load completed");
				},
				error: function(data) {
					console.log("AnnotationLoader getTargetNodeID error");
				}
			});		
		}
		
		return targetThing;
	}
	
	this.getAnnotations = function() {
		return annotations;
	}
};
