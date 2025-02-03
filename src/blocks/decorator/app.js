document.addEventListener( 'DOMContentLoaded', () => {
	const selectors = [
		'[data-unitone-layout~="decorator"][data-unitone-layout~="-has-link"]',
		'[data-unitone-layout~="decorator"]:has(> [data-unitone-layout~="decorator__inner"] > [data-unitone-layout~="decorator__link"])',
	];
	const decorators = document.querySelectorAll( selectors.join( ',' ) );

	Array.from( decorators ).forEach( ( decorator ) => {
		let down, up;
		const link = decorator.querySelector(
			':scope > [data-unitone-layout~="decorator__inner"] > [data-unitone-layout~="decorator__link"]'
		);

		if ( !! link ) {
			decorator.addEventListener( 'pointerdown', ( event ) => {
				event.stopPropagation();
				down = +new Date();
			} );

			decorator.addEventListener( 'pointerup', ( event ) => {
				event.stopPropagation();

				if ( 0 !== event.button ) {
					return false;
				}

				if (
					[ 'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA' ].includes(
						event.target?.tagName
					)
				) {
					return false;
				}

				up = +new Date();
				if ( up - down < 200 ) {
					const pressedKeys =
						event.shiftKey || event.ctrlKey || event.metaKey;
					if ( pressedKeys ) {
						const originalTarget = link.getAttribute( 'target' );
						const originalRel = link.getAttribute( 'rel' );
						link.setAttribute( 'target', '_blank' );
						link.setAttribute( 'rel', 'noopener noreferrer' );

						link.click();

						link.setAttribute( 'target', originalTarget || '' );
						link.setAttribute( 'rel', originalRel || '' );
					} else {
						link.click();
					}
				}
			} );
		}
	} );
} );

document.addEventListener( 'DOMContentLoaded', () => {
	const decorators = document.querySelectorAll(
		'[data-unitone-layout~="decorator"][data-unitone-layout~="-has-outer-block-link"]'
	);

	Array.from( decorators ).forEach( ( decorator ) => {
		const link = decorator.querySelector(
			':scope > [data-unitone-layout~="decorator__inner"] > [data-unitone-layout~="decorator__link"]'
		);

		if ( !! link ) {
			const outerLink = document.createElement( 'a' );
			outerLink.setAttribute(
				'data-unitone-layout',
				'-outer-block-link'
			);

			Array.from( link.attributes ).forEach( ( attribute ) => {
				const { nodeName, nodeValue } = attribute;
				if ( [ 'href', 'target', 'rel' ].includes( nodeName ) ) {
					outerLink.setAttribute( nodeName, nodeValue ?? '' );
				}
			} );

			Array.from( decorator.children ).forEach( ( element ) => {
				outerLink.appendChild( element );
			} );

			decorator.insertBefore( outerLink, decorator.children[ 0 ] );
		}
	} );
} );
