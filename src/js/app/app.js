import '../../../node_modules/@inc2734/unitone-css/src/app';

const setHeightForVertical = ( target ) => {
	target.style.height = '';
	const targetRect = target.getBoundingClientRect();

	const childrenEnds = [];
	[].slice.call( target.children ).forEach( ( child ) => {
		const childRect = child.getBoundingClientRect();
		childrenEnds.push( childRect.top + childRect.height );
	} );

	const end = Math.max( ...childrenEnds );
	target.style.height = `${ end - targetRect.top }px`;
};

export const verticalsResizeObserver = new ResizeObserver( ( entries ) => {
	for ( const entry of entries ) {
		setHeightForVertical( entry.target );
	}
} );

const verticals = document.querySelectorAll(
	'[data-unitone-layout~="vertical-writing"]'
);
verticals.forEach( ( target ) => {
	verticalsResizeObserver.observe( target );
} );
