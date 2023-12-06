import {
	fluidFontSizeResizeObserver,
	dividersResizeObserver,
	stairsResizeObserver,
} from '@inc2734/unitone-css/library';

document.addEventListener( 'DOMContentLoaded', () => {
	const fluidFontSizeElements = document.querySelectorAll(
		'[data-unitone-layout~="-fluid-typography"]'
	);
	fluidFontSizeElements.forEach( ( target ) => {
		fluidFontSizeResizeObserver( target );
	} );

	const dividers = document.querySelectorAll(
		'[data-unitone-layout*="-divider:"]'
	);
	dividers.forEach( ( target ) => {
		dividersResizeObserver( target );
	} );

	const stairs = document.querySelectorAll(
		'[data-unitone-layout*="-stairs:"]'
	);
	stairs.forEach( ( target ) => {
		stairsResizeObserver( target );
	} );
} );
