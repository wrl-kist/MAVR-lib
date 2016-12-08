MAVR.HTMLElement = function() {
	this.createImageElement = function(id, url, width, height, attachMode = true) {
		var params = {};
		params.id = id;
		params.src = url;
		
		if ( width !== undefined ) {
			params.width = width;
		}
		
		if ( height !== undefined ) {
			params.height = height;
		}
		
		var ele = $('<img/>', params);
		
		if( attachMode === true ) {
			ele.appendTo('body');
		}
		
		return ele;
	}
	
	this.createVideoElement = function(id, url, width, height, mimetype, attachMode = true) {
		var ele = this.createMediaElement(MAVR.Type.MIMEVideo, id, url, width, height, mimetype, attachMode);
		
		return ele;
	}
	
	this.createAudioElement = function(id, url, width, height, mimetype, attachMode = true) {
		var ele = this.createMediaElement(MAVR.Type.MIMEAudio, id, url, width, height, mimetype, attachMode);
		
		return ele;
	}
	
	this.createMediaElement = function(tag, id, url, width, height, mimetype, attachMode = true) {
		var params = {};
		var sourceParams = {};
		params.id = id;		
		params.controls = true;
		
		if ( width !== undefined ) {
			params.width = width;
		}
		
		if ( height !== undefined ) {
			params.height = height;
		}
		
		sourceParams.src = url;
		
		if ( mimetype !== undefined ) {
			sourceParams.type = mimetype;
		}
		
		var source = $('<source/>', sourceParams);
		
		var ele = $('<'+tag+'/>', params);
		source.appendTo(ele);
		
		if( attachMode === true ) {
			ele.appendTo('body');
		}
		
		return ele;
	}
	
	this.createTextElement = function(id, text, css, attachMode = true) {
		var div = $('<div/>', {id: id}).text(text);
		
		for( var i = 0 ; i < css.length ; i++ ) {
			div.css(css[i].key, css[i].value);
		}
		
		if( attachMode === true ) {
			div.appendTo('body');
		}
		
		return div;
	}
	
	this.createAnchorElement = function(id, url, mimetype, attachMode = true) {
		var params = {};
		params.id = id;
		params.src = url;
		
		if ( mimetype !== undefined ) {
			params.type = mimetype;
		}
		
		var ele = $('<a/>', params);
		
		if( attachMode === true ) {
			ele.appendTo('body');
		}
		
		return ele;
	}
	
	this.createiFrameElement = function(id, url, width, height, attachMode = true) {
		var params = {};
		params.id = id;		
		params.src = url;
		
		if ( width !== undefined ) {
			params.width = width;
		}
		
		if ( height !== undefined ) {
			params.height = height;
		}
		
		var ele = $('<iframe/>', params);
		
		if( attachMode === true ) {
			ele.appendTo('body');
		}
		
		return ele;
	}
	
	this.createCustomElement = function(id, code, width, height, attachMode = true) {
		var ele = this.createCustomTagElement('div', id, code, width, height, attachMode);
		
		return ele;
	}
	
	this.createCustomTagElement = function(tag, id, code, width, height, attachMode = true) {
		var params = {};
		params.id = id;
		params.html = code;
		
		if ( width !== undefined ) {
			params.width = width;
		}
		
		if ( height !== undefined ) {
			params.height = height;
		}
		
		var ele = $('<'+tag+'/>',params);
		
		if( attachMode === true ) {
			ele.appendTo('body');
		}
		
		return ele;
	}
	
	this.createHTML2Image = function(domelement, callback) {
		html2canvas(domelement).then(function(canvas) {
			var image = new Image();
			image.src = canvas.toDataURL("image/png");
			
			image.onload = function()  {
				callback(image);
			};
		});
	}
	
	this.createHTML2Texture = function(domelement, callback) {
		this.createHTML2Image(domelement, function(image) {
			var texture = new THREE.Texture();
			texture.image = image;
			texture.needsUpdate = true;
			
			callback(texture);
		});
	}
}