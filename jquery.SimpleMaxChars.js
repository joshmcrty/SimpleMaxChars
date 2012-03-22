/**
 * SimpleMaxChars jQuery Plugin
 * http://joshmccarty.com
 *
 * Copyright (c)2012, Josh McCarty
 * License: GPL Version 2
 * http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * Tested with jQuery 1.6.2+, IE7+, Chrome 17, Firefox 8
 */

;( function( $ ) {
	$.fn.SimpleMaxChars = function( options ) {
		
		// Extend the default options
		var opts = $.extend( {}, $.fn.SimpleMaxChars.defaults, options );
		
		// Debug function
		if ( opts.debug === true ) {
			debug( this, opts );
		}
		
		// Apply the plugin to the matched elements
		return this.each( function() {
			
			var $this = $( this );
			
			// Check for existing instances of messages to avoid ID collisions on the container element
			var messageCount = $( '.' + opts.messageClass ).length;
			messageCount++;
			$this.after( '<span id="' + opts.messageClass + '-' + messageCount + '"></span>' );
			var $container = $( '#' + opts.messageClass + '-' + messageCount );
			var maxLength = opts.maxChars;
			
			// Check for maxLength property if opts.maxChars is not specified
			if ( typeof maxLength === "undefined" ) {
				
				// Use a default maxLength if the maxlenth attribute is not present or is empty
				// Check for the maxlength attribute rather than the maxLength DOM property because the DOM property is not consistent for inputs and textareas with no maxlength attribute
				if ( typeof $this.attr( 'maxlength' ) === "undefined" || $this.attr( 'maxlength' ) === "" ) {
					maxLength = opts.defaultMaxChars;
					$this.prop( 'maxLength', maxLength ); // Using .prop() sets both the property and the attribute
				}
				
				// Use the maxlength property
				else {
					maxLength = $this.prop( 'maxLength' );
					
					// IE doesn't handle the maxlength attribute and maxLength DOM property correctly, so use the attribute value instead
					if ( typeof maxLength === "undefined" ) {
						maxLength = $this.attr( 'maxlength' );
					}
				}
			}
			else {
				$this.prop( 'maxLength', maxLength ); // Using .prop() sets both the property and the attribute
			}
			
			// Calculate the remaining characters immediately in case the field is pre-populated
			var fieldValue = $this.val();
			var fieldLength = fieldValue.length;
			var message = $.fn.SimpleMaxChars.message( fieldLength, opts, maxLength );
			$container.html( message );
			
			// Recalculate on keyup (does not recalculate when holding a key down, only when a key is released)
			$this.keyup( function() {
				fieldValue = $this.val();
				fieldLength = fieldValue.length;
				message = $.fn.SimpleMaxChars.message( fieldLength, opts, maxLength );
				$container.html( message );
			});
		});
		
	};
	
	// Private function to display debugging information
	function debug( $obj, opts ) {
		
		// Alert the user if no items are found
		if ( $obj.length === 0 ) {
			alert( 'No matching form fields were found.' );
		}
	}
	
	// Public function that creates a message to display remaining characters
	// Can be overwritten with your own message function if you want. Example: $.fn.SimpleMaxChars.message = function( chars, opts, maxLength ) { doMyStuff; return myStuff; } );
	$.fn.SimpleMaxChars.message = function( chars, opts, maxLength ) {
		
		var remainingChars = maxLength - chars;
		var lineBreak = "";
		var html = "";
		var messageClass = opts.messageClass;
		if ( opts.lineBreak === true ) {
			lineBreak = '<br />';
		}
		if ( remainingChars < opts.warningLimit ) {
			messageClass += " " + opts.warningClass;
		}
		html = lineBreak + '<span class="' + messageClass + '">' + remainingChars + ' characters remaining.</span>';
		return html;
	};

	// Default plugin options
	// Can be overwritten with new defaults. Example: $.fn.SimpleMaxChars.defaults.warningClass = 'invalid';
	$.fn.SimpleMaxChars.defaults = {
		maxChars: undefined,
		defaultMaxChars: 255,
		warningLimit: 20,
		messageClass: 'simple-maxchars-message',
		warningClass: 'warning',
		lineBreak: false,
		debug: false
	};

})( jQuery );