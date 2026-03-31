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

	const refreshers = navigations.map( ( navigation ) => {
		const submenus = navigation.querySelectorAll(
			[
				'.wp-block-navigation__container > .wp-block-page-list > .wp-block-pages-list__item > .wp-block-navigation__submenu-container',
				'.wp-block-navigation__container > .wp-block-navigation-item > :is(.wp-block-navigation__submenu-container, .unitone-mega-menu__container)',
			].join( ',' )
		);

		return () => {
			Array.from( submenus ).forEach( ( submenu ) => {
				const rect = submenu.parentElement?.getBoundingClientRect();
				if ( ! rect ) {
					return;
				}

				submenu.style.setProperty(
					'--unitone--rect-top',
					`${ rect.y }px`
				);
				submenu.style.setProperty(
					'--unitone--rect-right',
					`${ rect.x + rect.width }px`
				);
			} );
		};
	} );

	const refreshAll = () => {
		rafId = 0;
		refreshers.forEach( ( refresh ) => {
			refresh();
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
	resizeObserver.observe( document.body );

	scheduleRefreshAll();
}
