(function( document, proto, storage, key, pattern, /* min */ cached, style, setAttribute ) {

	// Do nothing if localStorage is not available

	if ( !storage ) return;

	// If CSS is in cache, append it to <head> in a <style> tag.

	cached = storage[ key ];
	if ( cached ) {

		style = document.createElement( 'style' );
		style.innerHTML = cached;
		document.getElementsByTagName( 'head' )[0].appendChild( style );

	}

	// The typekit will at some point create a <link> to load its CSS.
	// Override Element.proto.setAttribute to handle setting its href.

	setAttribute = proto.setAttribute;
	proto.setAttribute = function( name, url, /* min */ xhr, css ) {

		if ( url.match( pattern ) ) {

			// Get the CSS of the URL via XHR and cache it.
			// Only overwrite cache if CSS has changed.

			xhr = new XMLHttpRequest();
			xhr.open( 'GET', url, true );
			xhr.onreadystatechange = function() {

				if ( xhr.readyState === 4 ) {

					css = xhr.responseText;
					if ( css !== cached ) storage[ key ] = css;

				}

			};
			xhr.send( null );

			// Reset Element.prototype.setAttribute.
			// If the cache was empty, set the href normally.
			// Otherwise, cancel setting the href.

			proto.setAttribute = setAttribute;
			if ( cached ) return;

		}

		setAttribute.apply( this, arguments );

	};

})( document, Element.prototype, localStorage, 'tk', '//use.typekit.net' );
