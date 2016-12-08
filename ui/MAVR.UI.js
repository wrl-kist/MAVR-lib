
MAVR.UI = {};

MAVR.UI.Element = function ( dom ) {

	this.dom = dom;

};

MAVR.UI.Element.prototype = {

	add: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof MAVR.UI.Element ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'MAVR.UI.Element:', argument, 'is not an instance of MAVR.UI.Element.' );

			}

		}

		return this;

	},

	remove: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof MAVR.UI.Element ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'MAVR.UI.Element:', argument, 'is not an instance of MAVR.UI.Element.' );

			}

		}

		return this;

	},

	clear: function () {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	},

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

};

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	MAVR.UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	MAVR.UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );


// Panel

MAVR.UI.Panel = function () {

	MAVR.UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'panel panel-default';

	this.dom = dom;

	return this;

};

MAVR.UI.ButtonGroup = function () {
    MAVR.UI.Element.call( this );
    
    var div = document.createElement('div');
    div.className = 'btn-group';
    div.setAttribute('role' , 'group');
	
    this.dom = div;
    
    return this;
};
MAVR.UI.ButtonGroup.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.ButtonGroup.prototype.constructor = MAVR.UI.ButtonGroup;

MAVR.UI.Dropdown_toggle = function () {
	MAVR.UI.Element.call( this );
		
	var button = document.createElement('button');
	button.className = 'btn btn-default dropdown-toggle';
	
	
	button.setAttribute('data-toggle', 'dropdown');
	button.setAttribute('aria-haspopup', true);
	button.setAttribute('aria-expanded', true);
	
	this.dom = button;
	
	return this;
};

MAVR.UI.Dropdown_toggle.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Dropdown_toggle.prototype.constructor = MAVR.UI.Dropdown_toggle;

MAVR.UI.Dropdown_toggle.prototype.setTextContent = function ( value ) {
		var arrow = '<span class="caret"></span>';
		
		this.dom.innerHTML = value + " " + arrow;
		
		return this;
};

MAVR.UI.Dropdown_menu = function () {
	MAVR.UI.Element.call( this );
	
	var ul = document.createElement('ul');
	ul.className = 'dropdown-menu';
	
	this.dom = ul;
	
	return this;
	
};

MAVR.UI.Dropdown_menu.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Dropdown_menu.prototype.constructor = MAVR.UI.Dropdown_menu;

MAVR.UI.Row = function () {
	MAVR.UI.Element.call( this );
	
	var li = document.createElement('li');
	li.className='list-group-item';
	this.anchor = document.createElement('a');
	this.anchor.setAttribute('href', '#');
	li.appendChild(this.anchor);
	
	this.dom = li;
	
	return this;
	
};

MAVR.UI.Row.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Row.prototype.constructor = MAVR.UI.Row;

MAVR.UI.Row.prototype.setText = function (name) {
	
		this.anchor.innerHTML = name;
		return this;
};



MAVR.UI.Panel.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Panel.prototype.constructor = MAVR.UI.Panel;

// Text

MAVR.UI.Text = function ( text ) {

	MAVR.UI.Element.call( this );

	var dom = document.createElement( 'span' );
	dom.className = 'Text';
	dom.style.cursor = 'default';
	dom.style.display = 'inline-block';
	dom.style.verticalAlign = 'middle';

	this.dom = dom;
	this.setValue( text );

	return this;

};

MAVR.UI.Text.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Text.prototype.constructor = MAVR.UI.Text;

MAVR.UI.Text.prototype.getValue = function () {

	return this.dom.textContent;

};

MAVR.UI.Text.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.textContent = value;

	}

	return this;

};


// Input

MAVR.UI.Input = function ( text ) {

	MAVR.UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Input';
	dom.style.padding = '2px';
	dom.style.border = '1px solid transparent';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.dom = dom;
	this.setValue( text );

	return this;

};

MAVR.UI.Input.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Input.prototype.constructor = MAVR.UI.Input;

MAVR.UI.Input.prototype.getValue = function () {

	return this.dom.value;

};

MAVR.UI.Input.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

// Checkbox

MAVR.UI.Checkbox = function ( boolean ) {

	MAVR.UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Checkbox';
	dom.type = 'checkbox';

	this.dom = dom;
	this.setValue( boolean );

	return this;

};

MAVR.UI.Checkbox.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Checkbox.prototype.constructor = MAVR.UI.Checkbox;

MAVR.UI.Checkbox.prototype.getValue = function () {

	return this.dom.checked;

};

MAVR.UI.Checkbox.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.checked = value;

	}

	return this;

};

// Number

MAVR.UI.Number = function ( number ) {

	MAVR.UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 13 ) dom.blur();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.precision = 2;
	this.step = 1;

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) );

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		var value = 0;

		try {

			value = eval( dom.value );

		} catch ( error ) {

			console.error( error.message );

		}

		scope.setValue( value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

MAVR.UI.Number.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Number.prototype.constructor = MAVR.UI.Number;

MAVR.UI.Number.prototype.getValue = function () {

	return this.value;

};

MAVR.UI.Number.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseFloat( value );

		if ( value < this.min ) value = this.min;
		if ( value > this.max ) value = this.max;

		this.value = value;
		this.dom.value = value.toFixed( this.precision );

	}

	return this;

};

MAVR.UI.Number.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};

MAVR.UI.Number.prototype.setPrecision = function ( precision ) {

	this.precision = precision;

	return this;

};

// Break

MAVR.UI.Break = function () {

	MAVR.UI.Element.call( this );

	var dom = document.createElement( 'br' );
	dom.className = 'Break';

	this.dom = dom;

	return this;

};

MAVR.UI.Break.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Break.prototype.constructor = MAVR.UI.Break;


// HorizontalRule

MAVR.UI.HorizontalRule = function () {

	MAVR.UI.Element.call( this );

	var dom = document.createElement( 'hr' );
	dom.className = 'HorizontalRule';

	this.dom = dom;

	return this;

};

MAVR.UI.HorizontalRule.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.HorizontalRule.prototype.constructor = MAVR.UI.HorizontalRule;


// Button

MAVR.UI.Button = function ( value ) {

	MAVR.UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'button' );
	dom.className = 'btn btn-default';

	this.dom = dom;
	this.dom.textContent = value;

	return this;

};

MAVR.UI.Button.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Button.prototype.constructor = MAVR.UI.Button;

MAVR.UI.Button.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};

// Span

MAVR.UI.Span = function () {

	MAVR.UI.Element.call( this );

	this.dom = document.createElement( 'span' );

	return this;

};

MAVR.UI.Span.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Span.prototype.constructor = MAVR.UI.Span;

MAVR.UI.THREE = {};

MAVR.UI.THREE.Boolean = function ( boolean, text ) {

	MAVR.UI.Span.call( this );

	this.setMarginRight( '10px' );

	this.checkbox = new MAVR.UI.Checkbox( boolean );
	this.text = new MAVR.UI.Text( text ).setMarginLeft( '3px' );

	this.add( this.checkbox );
	this.add( this.text );

};

MAVR.UI.THREE.Boolean.prototype = Object.create( MAVR.UI.Span.prototype );
MAVR.UI.THREE.Boolean.prototype.constructor = MAVR.UI.THREE.Boolean;

MAVR.UI.THREE.Boolean.prototype.getValue = function () {

	return this.checkbox.getValue();

};

MAVR.UI.THREE.Boolean.prototype.setValue = function ( value ) {

	return this.checkbox.setValue( value );

};

// Bootstrap ToggleSwitch

MAVR.UI.ToggleSwitch = function () {
	
	MAVR.UI.Element.call(this);
  
	var input = document.createElement('input');
	input.type = 'checkbox';
	input.className = 'switch';
	input.setAttribute('checked', true);
	
	this.dom = input;
  
  return this;
  
};

MAVR.UI.ToggleSwitch.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.ToggleSwitch.prototype.constructor = MAVR.UI.ToggleSwitch;

MAVR.UI.ToggleSwitch.prototype.getDom = function () {
	
	return $(this.dom);
	
};

MAVR.UI.Tab = function () {
	
	MAVR.UI.Element.call(this);
    
    var ul = document.createElement('ul');
    ul.className="nav nav-tabs";
 	
 	this.dom = ul;
    
    return this;
    
};

MAVR.UI.Tab.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.Tab.prototype.constructor = MAVR.UI.Tab;
MAVR.UI.Tab.prototype.event = function () {
	$(this.dom).ready(function(){
    	$(".nav-tabs a").click(function(){
	        $(this).tab('show');
	    });
	});
};

MAVR.UI.TabMenu = function (src) {
	
	MAVR.UI.Element.call(this);
    
    this.li = document.createElement('li');
    this.anchor = document.createElement('a');
    this.anchor.setAttribute('href', src);
    this.li.appendChild( this.anchor );
    
 	this.dom = this.li;
    
    return this;
    
};

MAVR.UI.TabMenu.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.TabMenu.prototype.constructor = MAVR.UI.TabMenu;

MAVR.UI.TabMenu.prototype.setText = function ( name ) {
	
	this.anchor.innerHTML = name;
	return this;
  
};

MAVR.UI.TabMenu.prototype.select = function () {
	this.li.className = 'active';
};

MAVR.UI.TabContent = function() {
	MAVR.UI.Element.call(this);
  
	var dom = document.createElement('div');
	dom.className = 'tab-content';
	
	this.dom = dom;
  
	return this;
};

MAVR.UI.TabContent.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.TabContent.prototype.constructor = MAVR.UI.TabContent;

MAVR.UI.TabPanel = function (){
	
	MAVR.UI.Element.call(this);
  
	var dom = document.createElement('div');
	dom.className = 'tab-pane';
	
	this.dom = dom;
  
	return this;
};

MAVR.UI.TabPanel.prototype = Object.create( MAVR.UI.Element.prototype );
MAVR.UI.TabPanel.prototype.constructor = MAVR.UI.TabPanel;

MAVR.UI.TabPanel.prototype.select = function () {
	this.dom.className = "tab-pane in active";
};