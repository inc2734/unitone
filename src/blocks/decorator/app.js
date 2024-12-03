document.addEventListener( 'DOMContentLoaded', () => {
	const selectors = [
		'[data-unitone-layout~="decorator"][data-unitone-layout~="-has-link"]',
		'[data-unitone-layout~="decorator"]:has(> [data-unitone-layout~="decorator__inner"] > [data-unitone-layout~="decorator__link"])',
	];
	const decorators = document.querySelectorAll( selectors.join( ',' ) );

	[].slice.call( decorators ).forEach( ( decorator ) => {
		let down, up;
		const link = decorator.querySelector(
			':scope > [data-unitone-layout~="decorator__inner"] > [data-unitone-layout~="decorator__link"]'
		);

		if ( !! link ) {
			decorator.addEventListener( 'mousedown', ( event ) => {
				event.stopPropagation();
				down = +new Date();
			} );

			decorator.addEventListener( 'mouseup', ( event ) => {
				event.stopPropagation();

				if (
					[ 'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA' ].includes(
						event.target?.tagName
					)
				) {
					return false;
				}

				up = +new Date();
				if ( up - down < 200 ) {
					link.click();
				}
			} );
		}
	} );
} );
