const runWhenReady = ( callback ) => {
	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', callback, {
			once: true,
		} );
		return;
	}

	callback();
};

const createLoader = ( importer ) => {
	let promise;

	return () => {
		if ( ! promise ) {
			promise = importer().then( ( module ) => module.default?.() );
		}

		return promise;
	};
};

const loadLayouts = createLoader( () => import( './layouts' ) );

const loadNavigation = createLoader( () => import( './navigation' ) );

const loadEffects = createLoader( () => import( './scroll-animation' ) );

const loadQuery = createLoader( () => import( './block-link' ) );

const initializeFeatures = () => {
	const isFirefox = !! window
		.getComputedStyle( document.documentElement )
		.getPropertyValue( '--unitone--is-firefox' )
		.trim();

	const shouldLoadLayouts =
		!! document.querySelector(
			[
				'[data-unitone-layout*="-divider:"]',
				'[data-unitone-layout*="-stairs:"]',
				'[data-unitone-layout~="marquee-wrapper"]',
				'[data-unitone-layout~="-fluid-typography"]',
			].join( ',' )
		) ||
		( isFirefox && !! document.querySelector( '[style*="font-size:"]' ) );

	if ( shouldLoadLayouts ) {
		loadLayouts();
	}

	if (
		document.querySelector(
			'.wp-block-navigation:is(.is-style-unitone, .is-style-unitone-accordion).is-vertical'
		)
	) {
		loadNavigation();
	}

	if (
		document.querySelector(
			'[data-unitone-parallax], [data-unitone-scroll-animation]'
		)
	) {
		loadEffects();
	}

	if (
		document.querySelector(
			[
				'.wp-block-query[data-unitone-layout~="-block-link"] .wp-block-post',
				'.wp-block-query[class*="is-style-block-link"] .wp-block-post',
			].join( ',' )
		)
	) {
		loadQuery();
	}
};

const initializePageState = () => {
	let previousScrollState = null;
	let scrollRafId = 0;

	const updateScrollState = () => {
		scrollRafId = 0;

		const isScrolled = window.scrollY > 0;
		if ( isScrolled === previousScrollState ) {
			return;
		}

		previousScrollState = isScrolled;

		document.body.classList.remove(
			'unitone-page-scrolled:true',
			'unitone-page-scrolled:false'
		);
		document.body.classList.add(
			isScrolled
				? 'unitone-page-scrolled:true'
				: 'unitone-page-scrolled:false'
		);
	};

	const scheduleUpdateScrollState = () => {
		if ( scrollRafId ) {
			return;
		}

		scrollRafId = window.requestAnimationFrame( updateScrollState );
	};

	updateScrollState();

	window.addEventListener( 'scroll', scheduleUpdateScrollState, {
		passive: true,
	} );
	window.addEventListener( 'resize', scheduleUpdateScrollState, {
		passive: true,
	} );

	window.addEventListener(
		'load',
		() => {
			document.body.classList.remove( 'unitone-page-loaded:false' );
			document.body.classList.add( 'unitone-page-loaded:true' );
		},
		{ once: true }
	);
};

runWhenReady( () => {
	initializeFeatures();
	initializePageState();
} );
