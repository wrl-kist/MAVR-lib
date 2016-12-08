MAVR.VirtualObject = function() {
	MAVR.WebizedThing.call( this );
	
	this.type = 'VirtualObject';
	var property;
	
	this.applyTransform = function(object, transform) {
		if( transform !== undefined ){
			if( transform.position !== undefined ) {
				object.position.x = transform.position.x;
				object.position.y = transform.position.y;
				object.position.z = transform.position.z;
			}
			
			if( transform.rotation !== undefined ) {
				object.rotation.x = transform.rotation.x;
				object.rotation.y = transform.rotation.y;
				object.rotation.z = transform.rotation.z;
			}
			
			if( transform.scale !== undefined ){
				object.scale.x = transform.scale.x;
				object.scale.y = transform.scale.y;
				object.scale.z = transform.scale.z;
			}		
		}
		
		return object;
	};
	
	this.getProperty = function() {
		return property;
	}
	
	this.setProperty = function(value) {
		property = value;
	}
	
	this.setupAnimate = function(object, animateOpts) {
		if ( animateOpts !== undefined ) {
			for( var i = 0 ; i < animateOpts.length ; i++ ) {
				(function() {
					var animateOpt = animateOpts[i];
					var animateObj = object;
					var tweenVal = { value: animateObj[animateOpt["transform"]][animateOpt["axis"]] };
					var toVal = {value: animateOpt["to"]};
					var repeatVal = (animateOpt["repeat"] !== "Infinity") ? animateOpt["repeat"] : Infinity;
					var easing = (animateOpt["easing"] !== undefined ) ? eval(animateOpt["easing"]) : TWEEN.Easing.Linear.None;
					
					var tweenAni = new TWEEN.Tween(tweenVal).to(toVal, animateOpt["duration"]).repeat(repeatVal).easing(easing).onUpdate(function() {
						animateObj[animateOpt["transform"]][animateOpt["axis"]] = tweenVal.value;
						
						//console.log(tweenVal.value);
					});
					
					tweenAni.start();
				})();
			}
		}
	}	
}

MAVR.VirtualObject.prototype = Object.create( MAVR.VirtualObject.prototype );
MAVR.VirtualObject.prototype.constructor = MAVR.WebizedThing;