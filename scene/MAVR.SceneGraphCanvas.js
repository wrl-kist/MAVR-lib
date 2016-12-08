MAVR.SceneGraphCanvas = function () {
	this.drawAnnotation = function(annotation) {
		var annotations = annotation.getAnnotations();
		var annotationTypes = annotations.keys();
		
		for( var i = 0 ; i < annotationTypes.length ; i++) {
			var objects = annotations.get(annotationTypes[i]);
			
			// create group node and add the group to the target
			
			for( var j = 0 ; j < objects.length ; j++) {
				var object = MAVR.Things.getThing(objects[j]);
				
				// pass the group node
				// if the group node is null, the root scene is a parent node.
				this.drawAnnotationObject(object);
			}
		}
	}
	
	this.drawAnnotationObject = function(object) {
		var htmlElement = new MAVR.HTMLElement();
		
		var mimetype = object.category[0].substring(0, object.category[0].indexOf("/"));
		
		var params = { transform: object.transform };
		var virtualObjectType;
		
		switch(mimetype) {
			case MAVR.Type.MIMEImage:
				virtualObjectType = MAVR.Type.HTMLVRObject;
				htmlElement.createImageElement(object.id, object.resourceURL, object.size.x, object.size.y);
				break;
				
			case MAVR.Type.MIMEVideo:
				virtualObjectType = MAVR.Type.HTMLVRObject;
				htmlElement.createVideoElement(object.id, object.resourceURL, object.size.x, object.size.y, object.category[0]);
				break;
				
			case MAVR.Type.MIMEAudio:
				virtualObjectType = MAVR.Type.HTMLVRObject;
				htmlElement.createAudioElement(object.id, object.resourceURL, object.size.x, object.size.y, object.category[0]);
				break;
			
			case MAVR.Type.MIMEModel:
			case MAVR.Type.MIMEApplication:						
				var modeltype = object.category[0].substring(object.category[0].indexOf("/")+1);
				
				switch(modeltype) {
					case "vrml":
						virtualObjectType = MAVR.Type.WebGLVRObject;
						
						(function() {
							var loadObject = object; 
							var loader = new THREE.VRMLLoader();
							
							loader.load( loadObject.resourceURL, function ( vrmlObject ) {
								var virtualObject = new MAVR.WebGLVRObject();
								virtualObject.loadObject(vrmlObject, loadObject, loadObject);									
								MAVR.Config.renderer.getWebGLScene().add(virtualObject.getWebGLElement());									
								
								MAVR.SceneGraph.addVirtualObjects.put(virtualObject.getProperty().id, virtualObject);
								loadObject.draw = true;
							} );
						})();
						
						break;
					
					case "json":
						virtualObjectType = MAVR.Type.WebGLVRObject;
						
						(function() {
							var loadObject = object;
							
							$.getJSON( loadObject.resourceURL, function( jsonObject ) {
								jsonObject.transform = loadObject.transform;
								var virtualObject = new MAVR.WebGLVRObject();
								virtualObject.createObject(jsonObject, loadObject);		
								MAVR.Config.renderer.getWebGLScene().add(virtualObject.getWebGLElement());
								
								MAVR.SceneGraph.addVirtualObjects(virtualObject.getProperty().id, virtualObject);
								loadObject.draw = true;
							});
						})();
							
						break;
						
					case "binary":
						virtualObjectType = MAVR.Type.WebGLVRObject;
						var loader = new THREE.BinaryLoader();
						
						(function() {
							var loadObject = object;
							
							loader.load( loadObject.resourceURL, function ( vrmlObject ) {
								
							});
						})();
						
						break;
						
					default:
						break;
				}
				
			default:
				break;
		}
		
		if (virtualObjectType === MAVR.Type.HTMLVRObject ) {
			var domElement = document.getElementById(object.id);			
			params.planeW = params.elementW = domElement.clientWidth;
			params.planeH = domElement.clientHeight;
			
			var virtualObject = new MAVR.HTMLVRObject(domElement, params, object);
			MAVR.Config.renderer.getWebGLScene().add(virtualObject.getWebGLElement());
			
			MAVR.SceneGraph.addVirtualObjects(virtualObject.getProperty().id, virtualObject);
			object.draw = true;
		}
	}
	
	this.undrawAnnotation = function(annotationTypeName) {
		var targetURL = MAVR.Things.getAnnotationTypeTarget(annotationTypeName);
		var annotationTypeUUID = MAVR.Things.getThingUUID(targetURL + "-" + annotationTypeName);
		var annotationNode = this.getNode(annotationTypeUUID);
		
		//scenegraphUI.selectNode(annotationNode.id);		
		scenegraphUI.traverse(annotationNode, function(node) {
//			node.type
//			switch(thing.type) {
//				case MAVR.Type.AnnotationType:
//					break;
//					
//				case MAVR.Type.VirtualObject:
//					if (thing.draw === true) {
//						var virtualObject = virtualObjects.get(objectID);
//						virtualObject.getWebGLElement().visible = status;
//						
//						if (virtualObject instanceof MAVR.HTMLVRObject ) {
//							virtualObject.getCSS3DElement().visible = status;
//							
//							if ( status === true ) {
//								virtualObject.getDomElement().style.display = 'block';
//							} else {
//								virtualObject.getDomElement().style.display = 'none';
//							}							 
//						}
//					}
//					
//					break;
//					
//				default:
//					break;
//			}
			
			//scenegraphUI.selectNode([node.id]);
		});
	}
	
	this.undrawAnnotationObject = function(annotation, object) {
		
	}
};
