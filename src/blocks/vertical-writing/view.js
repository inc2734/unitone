import { verticalsResizeObserver } from '@inc2734/unitone-css/library';

document.addEventListener( 'DOMContentLoaded', () => {
	const verticals = document.querySelectorAll(
		'[data-unitone-layout~="vertical-writing"]'
	);
	verticals.forEach( ( target ) => {
		verticalsResizeObserver( target );
	} );
} );
