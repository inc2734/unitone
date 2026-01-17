const splitParagraphs = ( text ) => {
	if ( ! text ) {
		return [];
	}

	return text
		.split( /\n{2,}/ )
		.map( ( paragraph ) => paragraph.trim() )
		.filter( Boolean );
};

export default splitParagraphs;
