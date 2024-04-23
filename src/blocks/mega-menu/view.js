import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'unitone/mega-menu', {
	state: {
		get top() {
			const context = getContext();
			return context.top;
		},
		get left() {
			const context = getContext();
			return context.left;
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
		documentScroll() {
			actions.closeMenu( 'hover' );
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		windowResize() {
			actions.closeMenu( 'hover' );
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
	},
	actions: {
		openMenuOnHover() {
			actions.openMenu( 'hover' );
		},
		closeMenuOnHover() {
			actions.closeMenu( 'hover' );
		},
		openMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();

			context.previousFocus = ref;
			actions.openMenu( 'click' );
		},
		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		openMenuOnFocus() {
			actions.openMenu( 'focus' );
		},
		toggleMenuOnClick() {
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
				actions.openMenu( 'click' );
			}
		},
		handleMenuFocusout( event ) {
			if ( state.isMenuOpen ) {
				// When the focus is on the mega menu, if the focus is moved by tab to a link in the mega menu, nothing is done.
				if (
					event.relatedTarget?.closest(
						'.unitone-mega-menu__container'
					)
				) {
					return;
				}
			}

			// If focus is outside modal, and in the document, close menu
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outsite the document,
			// `window.document.activeElement` doesn't change.

			// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
			if (
				event.relatedTarget === null ||
				event.target !== window.document.activeElement
			) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},

		openMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			const { ref } = getElement();

			state.menuOpenedBy[ menuOpenedOn ] = true;

			const target = ref.closest( '.unitone-mega-menu' );

			const top =
				target.getBoundingClientRect().y +
				target.getBoundingClientRect().height;
			context.top = `${ top }px`;

			const left =
				target.getBoundingClientRect().x +
				target.getBoundingClientRect().width;
			context.left = `${ left }px`;
		},

		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();

			state.menuOpenedBy[ menuClosedOn ] = false;

			// Check if the menu is still open or not.
			if ( ! state.isMenuOpen ) {
				context.previousFocus?.focus();
				context.previousFocus = null;
				context.top = 0;
				context.left = 0;
			}
		},
	},
} );
