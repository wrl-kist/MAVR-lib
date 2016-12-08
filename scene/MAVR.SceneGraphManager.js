MAVR.SceneGraphManager = function () {
	var scenegraphPrefix = "mavr-";
	var scenegraphUI = new MAVR.SceneGraphView();
	var scenegraphCanvas = new MAVR.SceneGraphCanvas();
	var that = this;
	var sceneNode;
	var virtualObjects = new Hashtable();	// uuid, object3Ds
	var reverseObjects = new Hashtable();	// object3D.id, uuid
	var annotationObjects = new Hashtable();	// target, annotation
	
	this.init = function(nodeID) {
		scenegraphUI.init(nodeID, scenegraphPrefix);
	}
	
	this.load = function(annotations, mode, callback) {
		var loader = new MAVR.AnnotationLoader();
		
		loader.loadAnnotations(annotations, function() {
			var annotations = loader.getAnnotations();
			
			for( var i = 0 ; i < annotations.length ; i++) {
				annotationObjects.put(annotations[i].target, annotations[i].annotation);

				MAVR.SceneGraph.addAnnotationNodes(annotations[i].target, annotations[i].annotation);
				MAVR.SceneGraph.drawAnnotation(annotations[i].annotation);
			}
			
			if( callback !== undefined ) {
				callback();
			}
		}, mode);
	}
	
	this.unload = function(callback) {
		if( callback !== undefined ) {
			callback();
		}
	}
	
	this.show = function() {
		scenegraphUI.show();
	}
	
	this.hide = function() {
		scenegraphUI.hide();
	}
	
	this.update = function() {
		TWEEN.update();
	}
	
	this.addVirtualObjects = function(key, value) {
		virtualObjects.put(key, value);
	}
	
	this.getVirtualObjects = function() {
		return virtualObjects;
	}
	
	this.getAnnotationObjects = function() {
		return annotationObjects;
	}
	
	this.showVirtualObjects = function() {
		var objIDs = virtualObjects.keys();
		
		for( var i = 0 ; i < objIDs.length ; i++) {
			var visualObj = virtualObjects.get(objIDs[i]);
			console.log(visualObj.getProperty().id);
		}
	}
	
	this.getNode = function(nodeID) {	
		return scenegraphUI.getNode(nodeID);
	}
	
	this.createSceneNode = function(parentID, param) {
		sceneNode = scenegraphUI.createNode(null, {id: scenegraphPrefix + param.id, text: param.name});
	}
	
	this.createNode = function(parentID, param) {
		var node;
		
		if ( param.name === undefined || param.name === "" ) {
			param.name = param.id;
		}
		
		if (parentID === null || parentID === '#') {
			node = scenegraphUI.createNode(sceneNode, {id: scenegraphPrefix + param.id, text: param.name});
		} else {
			var parentNode = this.getNode(parentID);
			node = scenegraphUI.createNode(parentNode, {id: scenegraphPrefix + param.id, text: param.name});
		}
		
		return node;
	}
	
	this.addAnnotationNodes = function(parentID, annotation) {
		var annotations = annotation.getAnnotations();
		var annotationTypes = annotations.keys();
		
		for( var i = 0 ; i < annotationTypes.length ; i++) {
			var annotationType = MAVR.Things.getThing(annotationTypes[i]);
			this.createNode(parentID, annotationType);
			
			var objects = annotations.get(annotationTypes[i]);
			for( var j = 0 ; j < objects.length ; j++) {
				var object = MAVR.Things.getThing(objects[j]);
				this.createNode(annotationType.id, object);
			}
		}
	}
	
	this.removeAnnatationNodes = function() {
		
	}
	
	this.drawAnnotation = function(annotation) {
		scenegraphCanvas.drawAnnotation(annotation);
	}
	
	this.drawAnnotationObject = function(object) {
		scenegraphCanvas.drawAnnotationObject(object);
	}
	
	this.changeAnnotationObjects = function(data, status) {
			var objectID = data.substring(scenegraphPrefix.length);
			var thing = MAVR.Things.getThing(objectID);
			
			switch(thing.type) {
				case MAVR.Type.AnnotationType:
					break;
					
				case MAVR.Type.VirtualObject:
					if (thing.draw === true) {
						var virtualObject = virtualObjects.get(objectID);
						virtualObject.getWebGLElement().visible = status;
						
						if (virtualObject instanceof MAVR.HTMLVRObject ) {
							virtualObject.getCSS3DElement().visible = status;
							
							if ( status === true ) {
								virtualObject.getDomElement().style.display = 'block';
							} else {
								virtualObject.getDomElement().style.display = 'none';
							}							 
						}
					}
					
					break;
					
				default:
					break;
			}
	}
	
	this.selectRecursiveAnnotation = function(annotationTypeName) {
		var targetURL = MAVR.Things.getAnnotationTypeTarget(annotationTypeName);
		var annotationTypeUUID = MAVR.Things.getThingUUID(targetURL + "-" + annotationTypeName);
		var annotationNode = this.getNode(annotationTypeUUID);

		scenegraphUI.selectNode(annotationNode.id);		
		scenegraphUI.traverse(annotationNode, function(node) {
			scenegraphUI.selectNode([node.id]);
		});
	}
	
	this.deselectRecursiveAnnotation = function(annotationTypeName) {
		var targetURL = MAVR.Things.getAnnotationTypeTarget(annotationTypeName);
		var annotationTypeUUID = MAVR.Things.getThingUUID(targetURL + "-" + annotationTypeName);
		var annotationNode = this.getNode(annotationTypeUUID);
		
		scenegraphUI.deselectNode(annotationNode.id);
		scenegraphUI.traverse(annotationNode, function(node) {
			scenegraphUI.deselectNode([node.id]);
		});
	}
	
	this.exportSceneGraph = function(callback) {
		scenegraphUI.traverseAll(callback);
	}
	
	this.getSceneGraph = function() {
		return scenegraphUI.getSceneGraph();
	}
	this.getSceneGraphPrefix = function() {
		return scenegraphPrefix;
	}
};
