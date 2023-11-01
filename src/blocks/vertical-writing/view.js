import { verticalsResizeObserve } from '../../../node_modules/@inc2734/unitone-css/src/app';

document.addEventListener( 'DOMContentLoaded', () => {
	const verticals = document.querySelectorAll(
		'[data-unitone-layout~="vertical-writing"]'
	);
	verticals.forEach( ( target ) => {
		verticalsResizeObserve( target );
	} );
} );
