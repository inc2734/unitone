export function scrollBlockIntoView( clientId, ownerDocument ) {
	const id = `block-${ clientId }`;
	let element = ownerDocument.getElementById( id );

	// The popover lives outside the editor canvas in iframe-based editors.
	if ( ! element ) {
		for ( const frame of ownerDocument.querySelectorAll(
			'iframe[name="editor-canvas"]'
		) ) {
			element = frame.contentDocument?.getElementById( id );
			if ( element ) {
				break;
			}
		}
	}

	element?.scrollIntoView( {
		block: 'nearest',
		inline: 'nearest',
		behavior: 'instant',
	} );
}
