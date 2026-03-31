import {
	dividersResizeObserver,
	stairsResizeObserver,
	result1emPxForFireFoxObserver,
	marqueeResizeObserver,
} from '@inc2734/unitone-css/library';

export default function initLayouts() {
	document
		.querySelectorAll( '[data-unitone-layout*="-divider:"]' )
		.forEach( ( target ) => {
			dividersResizeObserver( target );
		} );

	document
		.querySelectorAll( '[data-unitone-layout*="-stairs:"]' )
		.forEach( ( target ) => {
			stairsResizeObserver( target );
		} );

	const isFirefox = !! window
		.getComputedStyle( document.documentElement )
		.getPropertyValue( '--unitone--is-firefox' )
		.trim();

	if ( isFirefox ) {
		document
			.querySelectorAll(
				'[style*="font-size:"], [data-unitone-layout~="-fluid-typography"]'
			)
			.forEach( ( target ) => {
				result1emPxForFireFoxObserver( target );
			} );
	}

	document
		.querySelectorAll( '[data-unitone-layout~="marquee-wrapper"]' )
		.forEach( ( target ) => {
			marqueeResizeObserver( target );
		} );
}
