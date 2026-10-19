export function copyRootAttributes( element, attributes ) {
	if ( element.hasAttribute( 'class' ) ) {
		attributes.className = element.getAttribute( 'class' );
	}
	if ( element.id ) {
		attributes.anchor = element.id;
	}
}
