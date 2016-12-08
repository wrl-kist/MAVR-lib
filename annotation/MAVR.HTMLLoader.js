MAVR.HTMLLoader = function () {
	var cssRules = [];
	
	this.parse = function() {
		console.log("start parsing CSS");
		this.loadEmbeddedCSSRules();
		console.log("end parsing CSS");
		this.showCSSRules();
	}
	
	this.loadEmbeddedCSSRules = function() {
		var parser = new cssjs();
		
		for( var i = 0 ; i < document.styleSheets.length ; i++ ) {
			if( document.styleSheets[i].cssRules !== null) {
				for( var j = 0 ; j < document.styleSheets[i].cssRules.length ; j++) {
					var parsedCSS = parser.parseCSS(document.styleSheets[i].cssRules[j].cssText);
					
					for( var k = 0 ; k < parsedCSS.length ; k++ ) {
						if( parsedCSS[k].rules !== undefined ) {
							for( var l = 0 ; l < parsedCSS[k].rules.length ; l++ ) {
								if( parsedCSS[k].rules[l].directive === MAVR.CSS.Directive ) {
									cssRules.push( {
										selector: parsedCSS[k].selector,
										directive: parsedCSS[k].rules[l].directive,
										value: parsedCSS[k].rules[l].value
									});
								}
							}
						} else if ( parsedCSS[k].subStyles !== undefined ) {
							
						}
					}
				}
			}
		}
	}
	
	this.showCSSRules = function() {
		for( var i = 0 ; i < cssRules.length ; i++ ) {
			console.log(cssRules[i]);
		}
	}
	
	this.exportMAVR = function() {
		var result;
		var htmlCode = this.generateHTML();
		var cssCode = this.generateCSS();
		var scriptCode = this.generateScript();
		
		$.get('../../mavr-lib/template/codetemplate.txt', function(data) {
			result = data.replace("$CSS$", cssCode).replace("$HTML$", htmlCode).replace("$JAVASCRIPT$", scriptCode);
			
			console.log(result);
		});
	}
	
	this.generateHTML = function() {
		var htmlElement = new MAVR.HTMLElement();
		var virtualObjects = MAVR.SceneGraph.getVirtualObjects();
		var objIDs = virtualObjects.keys();
		
		var exportNode = htmlElement.createCustomTagElement("body", "body", undefined, undefined, undefined, false);
		
		for( var i = 0 ; i < objIDs.length ; i++) {
			var visualObj = virtualObjects.get(objIDs[i]).getProperty();
			var mimetype = visualObj.category[0].substring(0, visualObj.category[0].indexOf("/"));
			var htmlObject;
			
			switch(mimetype) {
				case MAVR.Type.MIMEImage:
					htmlObject = htmlElement.createImageElement(visualObj.id, visualObj.resourceURL, 
							visualObj.size.x, visualObj.size.y, false);
					break;
					
				case MAVR.Type.MIMEVideo:
					htmlObject = htmlElement.createVideoElement(visualObj.id, visualObj.resourceURL,
							visualObj.size.x, visualObj.size.y, visualObj.category[0], false);
					break;
					
				case MAVR.Type.MIMEAudio:
					htmlObject = htmlElement.createAudioElement(visualObj.id, visualObj.resourceURL, 
							visualObj.size.x, visualObj.size.y, visualObj.category[0], false);
					break;
				
				case MAVR.Type.MIMEModel:
				case MAVR.Type.MIMEApplication:
					htmlObject = htmlElement.createAnchorElement(visualObj.id, visualObj.resourceURL,
							visualObj.category[0], false);
					break;
			}
			
			if( htmlObject !== undefined ) {
				htmlObject.appendTo(exportNode);
			}
		}
		
		var camera = htmlElement.createCustomElement("camera", undefined, undefined, undefined, false);
		camera.appendTo(exportNode);
		
		return exportNode[0].outerHTML;
	}
	
	this.generateCSS = function() {
		var virtualObjects = MAVR.SceneGraph.getVirtualObjects();
		var objIDs = virtualObjects.keys();
		var cssStyle = "";
		
		for( var i = 0 ; i < objIDs.length ; i++) {
			var visualObj = virtualObjects.get(objIDs[i]).getProperty();
			
			var position = visualObj.transform.position;
			var rotation = visualObj.transform.rotation;
			var scale = visualObj.transform.scale;
			
			var selector = "#"+visualObj.id;
			var directive = MAVR.CSS.Directive;
			var value = "translate3d(" + position.x + ", " + position.y + ", " + position.z + ") "
					+"rotate3d(" + rotation.x + ", " + rotation.y + ", " + rotation.z + ") "
					+"scale3d(" + scale.x + ", " + scale.y + ", " + scale.z + ");";
			
			cssStyle += selector + " { " + directive + ": " + value + " } \r\n";
		}
		
		return cssStyle;		
	}
	
	this.generateScript = function() {
		var builder = new MAVR.AnnotationBuilder();
		var result = [];
			
		MAVR.SceneGraph.exportSceneGraph(function(node) {	
			var nodeId = node.id.substring(5);
			var parentNodeId = node.parent.substring(5);
			var nodeThing = MAVR.Things.getThing(nodeId);
			var nodeObject;
			
			if( nodeThing.type === MAVR.Type.AnnotationType ) {
				nodeObject = builder.createAnnotationType(nodeThing.id, nodeThing.name);
			} else {
				nodeObject = builder.createAnnotationObject(nodeThing.id, nodeThing.name);
			}
			
			var parentNode = JSON.search(result, '//*[annotationId="' + parentNodeId + '"]')[0];
			
			if( parentNode === undefined ) {
				if( nodeObject["@type"] === MAVR.Type.AnnotationType ) {
					var annotationObj = builder.createAnnotation();
					annotationObj.body.push(nodeObject);
					
					result.push(annotationObj);
				} else if( nodeObject["@type"] === MAVR.Type.AnnotationObject ) {
					result.push(nodeObject);
				}
			} else {
				if( parentNode["@type"] === MAVR.Type.AnnotationType ) {
					parentNode.annotationObject.push(nodeObject);
				} else if( parentNode["@type"] === MAVR.Type.AnnotationObject ) {
					var annotationObj = builder.createAnnotation();
					annotationObj.body.push(nodeObject);
					
					parentNode.annotationObjects = annotationObj;
				} else {
					console.log("err2");
				}
			}
		});
		
		return "var annotation = " + JSON.stringify(result) + ";";
	}
};
