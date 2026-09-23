export default function initNavigationPointer() {
	document.addEventListener(
		'mousedown',
		( event ) => {
			if (
				event.button !== 0 ||
				! ( event.target instanceof window.Element )
			) {
				return;
			}

			const button = event.target.closest(
				'.wp-block-navigation-submenu__toggle[data-wp-on--click="actions.toggleMenuOnClick"]'
			);
			if (
				button?.closest( '.is-menu-open' ) &&
				button
					.closest( '.wp-block-navigation' )
					?.classList.contains( 'is-style-unitone-accordion' )
			) {
				// Focusout would collapse an earlier submenu and move this button before click.
				// Core focuses the button in its click handler, after the click target is fixed.
				event.preventDefault();
			}
		},
		true
	);
}
