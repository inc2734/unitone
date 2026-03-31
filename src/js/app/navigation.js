export default function initNavigation() {
	const navigations = Array.from(
		document.querySelectorAll(
			'.wp-block-navigation:is(.is-style-unitone, .is-style-unitone-accordion).is-vertical'
		)
	);

	if ( ! navigations.length ) {
		return;
	}

	let rafId = 0;

	const items = navigations.flatMap( ( navigation ) =>
		Array.from(
			navigation.querySelectorAll(
				[
					'.wp-block-navigation__container > .wp-block-page-list > .wp-block-pages-list__item > .wp-block-navigation__submenu-container',
					'.wp-block-navigation__container > .wp-block-navigation-item > :is(.wp-block-navigation__submenu-container, .unitone-mega-menu__container)',
				].join( ',' )
			)
		).map( ( submenu ) => ( {
			submenu,
			anchor: submenu.parentElement,
		} ) )
	);

	if ( ! items.length ) {
		return;
	}

	const refreshItem = ( { submenu, anchor } ) => {
		if ( ! submenu?.isConnected || ! anchor?.isConnected ) {
			return;
		}

		const rect = anchor.getBoundingClientRect();
		const top = `${ rect.y }px`;
		const right = `${ rect.x + rect.width }px`;

		if ( submenu.style.getPropertyValue( '--unitone--rect-top' ) !== top ) {
			submenu.style.setProperty( '--unitone--rect-top', top );
		}

		if (
			submenu.style.getPropertyValue( '--unitone--rect-right' ) !== right
		) {
			submenu.style.setProperty( '--unitone--rect-right', right );
		}
	};

	const refreshAll = () => {
		rafId = 0;
		items.forEach( ( item ) => {
			refreshItem( item );
		} );
	};

	const scheduleRefreshAll = () => {
		if ( rafId ) {
			return;
		}

		rafId = window.requestAnimationFrame( refreshAll );
	};

	navigations.forEach( ( navigation ) => {
		navigation.addEventListener( 'wheel', scheduleRefreshAll, {
			passive: true,
		} );
	} );

	window.addEventListener( 'scroll', scheduleRefreshAll, {
		passive: true,
	} );
	window.addEventListener( 'resize', scheduleRefreshAll, {
		passive: true,
	} );

	const resizeObserver = new window.ResizeObserver( scheduleRefreshAll );
	const observedElements = new Set( navigations );

	items.forEach( ( { anchor } ) => {
		if ( anchor ) {
			observedElements.add( anchor );
		}
	} );

	observedElements.forEach( ( element ) => {
		resizeObserver.observe( element );
	} );

	scheduleRefreshAll();
}
