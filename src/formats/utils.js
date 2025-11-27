export function getStyleProperties( text ) {
	const pairs = ( text || '' )
		.replace( /;?\s*$/, '' )
		.split( ';' )
		.map( ( style ) => {
			const [ key, ...valueParts ] = style.split( ':' );
			const value = valueParts.join( ':' );

			return [ key.trim(), value.trim() ];
		} )
		.filter( ( style ) => null != style[ 0 ] && null != style[ 1 ] );

	return Object.fromEntries( pairs );
}

export function getStyleAttribute( styleProperties ) {
	const styleKeys = Object.keys( styleProperties );
	const styleValues = Object.values( styleProperties );
	return styleValues
		.map( ( styleValue, i ) => {
			return null != styleValue && '' !== styleValue
				? [ styleKeys[ i ], styleValue ].join( ':' )
				: undefined;
		} )
		.filter( Boolean )
		.join( ';' );
}
