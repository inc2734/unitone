import {
	fluidFontSizeResizeObserver,
	dividersResizeObserver,
} from '@inc2734/unitone-css/library';

document.addEventListener( 'DOMContentLoaded', () => {
	const fluidFontSizeElements = document.querySelectorAll(
		'[data-unitone-layout~="-fluid-typography"]'
	);
	fluidFontSizeElements.forEach( ( target ) => {
		fluidFontSizeResizeObserver.observe( target );
	} );

	const dividers = document.querySelectorAll(
		'[data-unitone-layout*="-divider:"]'
	);
	dividers.forEach( ( target ) => {
		dividersResizeObserver.observe( target );
	} );
} );
