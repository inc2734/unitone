import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'unitone/mega-menu', {
	state: {
		get diffx() {
			const context = getContext();
			return context.diffx;
		},
		get isMenuOpen() {
			const context = getContext();

			// The menu is opened if either `click`, `hover` or `focus` is true.
			return (
				Object.values( context?.submenuOpenedBy ?? [] ).filter(
					Boolean
				).length > 0
			);
		},
		get menuOpenedBy() {
			const context = getContext();

			return context?.submenuOpenedBy ?? [];
		},
	},
	callbacks: {
		init() {
			const { ref } = getElement();

			const parent =
				ref.closest( '.site-header' ) ??
				ref.closest( '.wp-block-navigation' );

			let resizeObserver;
			const defaultView = ref?.ownerDocument?.defaultView;
			if ( defaultView.ResizeObserver ) {
				resizeObserver = new defaultView.ResizeObserver( () => {
					document.activeElement?.blur();
				} );
				resizeObserver.observe( parent );
			}
		},
	},
	actions: {
		// closeMenuOnWindowResize() {
		// 	console.log( 1 );
		// 	actions.closeMenu( 'hover' );
		// 	actions.closeMenu( 'click' );
		// 	actions.closeMenu( 'focus' );
		// },
		openMenuOnHover( event ) {
			actions.openMenu( event, 'hover' );
		},
		closeMenuOnHover() {
			actions.closeMenu( 'hover' );
		},
		openMenuOnClick( event ) {
			const context = getContext();
			const { ref } = getElement();

			context.previousFocus = ref;
			actions.openMenu( event, 'click' );
		},
		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		openMenuOnFocus( event ) {
			actions.openMenu( event, 'focus' );
		},
		toggleMenuOnClick( event ) {
			const context = getContext();
			const { ref } = getElement();

			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) ref.focus();
			const { menuOpenedBy } = state;
			if ( menuOpenedBy.click || menuOpenedBy.focus ) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			} else {
				context.previousFocus = ref;
				actions.openMenu( event, 'click' );
			}
		},
		handleMenuFocusout( event ) {
			// If focus is outside modal, and in the document, close menu
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outsite the document,
			// `window.document.activeElement` doesn't change.

			// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
			if (
				event.relatedTarget === null ||
				! event.relatedTarget.closest( '.unitone-mega-menu' )
			) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},

		openMenu( event, menuOpenedOn = 'click' ) {
			const context = getContext();

			state.menuOpenedBy[ menuOpenedOn ] = true;

			const target = event.target.closest( '.unitone-mega-menu' );
			const parent =
				event.target.closest( '.site-header' ) ??
				event.target.closest( '.wp-block-navigation' );
			context.diffx = `${
				target.getBoundingClientRect().x -
				parent.getBoundingClientRect().x
			}px`;
		},

		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();

			state.menuOpenedBy[ menuClosedOn ] = false;

			// Check if the menu is still open or not.
			if ( ! state.isMenuOpen ) {
				context.previousFocus?.focus();
				context.previousFocus = null;
				context.diffx = 0;
			}
		},
	},
} );
