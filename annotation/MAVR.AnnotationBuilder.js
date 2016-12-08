MAVR.AnnotationBuilder = function () {
	this.createAnnotation = function() {
		var obj = {
			"@type": MAVR.Type.Annotation,
		  "body": []
    }
		
		return obj;
	}
	
	this.createAnnotationType = function(annotationId, annotationType) {
		var obj = {
			"@type": MAVR.Type.AnnotationType,
			"annotationType": annotationType,
      "level": 0,
      "annotationId": annotationId,
      "annotationObject": []
    }
		
		return obj;
	}
	
	this.createAnnotationObject = function(annotationId, objectName) {
		var obj = {
		  "@type": MAVR.Type.AnnotationObject,
		  "annotationId": annotationId,
		  "name": objectName,
		  "annotationObjects": undefined
		}
		
		return obj;
	}
};
