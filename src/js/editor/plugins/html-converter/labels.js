export const normalizeText = ( text ) => text.replace( /\s+/g, ' ' ).trim();

export const shortenText = ( text, length = 40 ) => {
	const characters = Intl.Segmenter
		? Array.from(
				new Intl.Segmenter( undefined, {
					granularity: 'grapheme',
				} ).segment( text ),
				( item ) => item.segment
		  )
		: Array.from( text );

	return characters.length > length
		? characters.slice( 0, length ).join( '' ) + '…'
		: text;
};

export const getImageFilename = ( url ) => {
	const pathname = url.split( /[?#]/ )[ 0 ];
	if ( /^(?:data|blob):/i.test( pathname ) ) {
		return '';
	}

	const filename = pathname.split( '/' ).pop();

	try {
		return decodeURIComponent( filename );
	} catch {
		return filename;
	}
};
