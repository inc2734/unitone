import {
	store,
	getContext,
	getElement,
	withScope,
} from '@wordpress/interactivity';

const { state, actions } = store( 'unitone/mega-menu', {
	state: {
		get top() {
			const context = getContext();
			return `${ context.rect.top }px`;
		},
		get left() {
			const context = getContext();
			return `${ context.rect.left }px`;
		},
		get right() {
			const context = getContext();
			return `${ context.rect.left + context.rect.width }px`;
		},
		get diff() {
			const context = getContext();
			return `${ context.megaMenuRect.diff }px`;
		},
		get isMenuOpen() {
			// The menu is opened if either `click`, `hover` or `focus` is true.
			return (
				Object.values( this.menuOpenedBy ).filter( Boolean ).length > 0
			);
		},
		get menuOpenedBy() {
			const context = getContext();
			return context?.submenuOpenedBy ?? ( context.submenuOpenedBy = {} );
		},

		hoverTimeout: null,
	},
	actions: {
		clearHoverTimeout() {
			if ( state.hoverTimeout ) {
				clearTimeout( state.hoverTimeout );
				state.hoverTimeout = null;
			}
		},
		setHoverTimeout( callback, delay ) {
			actions.clearHoverTimeout();
			state.hoverTimeout = setTimeout( withScope( callback ), delay );
		},
		openMenuOnHover() {
			actions.clearHoverTimeout();

			actions.setHoverTimeout( () => {
				const { menuOpenedBy } = state;

				if ( ! menuOpenedBy.click ) {
					actions.openMenu( 'hover' );
				}
			}, 300 );
		},
		closeMenuOnHover() {
			actions.setHoverTimeout( () => {
				actions.closeMenu( 'hover' );
			}, 300 );
		},
		openMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();

			actions.clearHoverTimeout();

			context.previousFocus = ref;
			actions.openMenu( 'click' );
		},
		closeMenuOnClick() {
			actions.clearHoverTimeout();
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		openMenuOnFocus() {
			actions.clearHoverTimeout();
			actions.openMenu( 'focus' );
		},
		toggleMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();

			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) {
				ref.focus();
			}

			const { menuOpenedBy } = state;

			if ( menuOpenedBy.click || menuOpenedBy.focus ) {
				actions.clearHoverTimeout();
				actions.closeMenu( 'click' );
				actions.closeMenu( 'hover' );
				actions.closeMenu( 'focus' );
			} else {
				actions.clearHoverTimeout();
				context.previousFocus = ref;
				actions.openMenu( 'click' );
			}
		},
		handleMenuKeydown( event ) {
			if ( state.menuOpenedBy.click && event?.key === 'Escape' ) {
				actions.clearHoverTimeout();
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},
		handleMenuFocusout( event ) {
			const { modal } = getContext();
			// If focus is outside modal, and in the document, close menu
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outsite the document,
			// `window.document.activeElement` doesn't change.

			// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
			if (
				event.relatedTarget === null ||
				( ! modal?.contains( event.relatedTarget ) &&
					event.target !== window.document.activeElement )
			) {
				actions.clearHoverTimeout();
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			}
		},
		openMenu( menuOpenedOn = 'click' ) {
			const context = getContext();
			const { ref } = getElement();

			state.menuOpenedBy[ menuOpenedOn ] = true;

			const target = ref.closest( '.unitone-mega-menu' );
			const rect = target.getBoundingClientRect();
			context.rect = {
				top: rect.y,
				left: rect.x,
				width: rect.width,
			};

			const documentElement = target.ownerDocument.documentElement;
			context.viewport = {
				width: documentElement.clientWidth,
				height: documentElement.clientHeight,
			};

			const megaMenu = target.querySelector(
				'.unitone-mega-menu__container'
			);
			const megaMenuRect = megaMenu.getBoundingClientRect();

			let diff = 0;

			if (
				context.viewport.width <
				megaMenuRect.left + megaMenuRect.width
			) {
				diff =
					context.viewport.width -
					( megaMenuRect.left + megaMenuRect.width );
			} else if ( 0 > megaMenuRect.left ) {
				diff = megaMenuRect.left * -1;
			}

			context.megaMenuRect = {
				left: megaMenuRect.x,
				width: megaMenuRect.width,
				diff,
			};
		},
		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();

			state.menuOpenedBy[ menuClosedOn ] = false;

			// Check if the menu is still open or not.
			if ( ! state.isMenuOpen ) {
				if (
					context.modal?.contains( window.document.activeElement )
				) {
					context.previousFocus?.focus();
				}
				context.modal = null;
				context.previousFocus = null;
				context.rect = {
					top: 0,
					left: 0,
					width: 0,
				};
				context.megaMenuRect = {
					left: 0,
					width: 0,
					diff: 0,
				};
				context.viewport = {
					width: 0,
					height: 0,
				};
			}
		},
	},
	callbacks: {
		initMenu() {
			const context = getContext();
			const { ref } = getElement();
			if ( state.isMenuOpen ) {
				const focusableSelectors = [
					'a[href]',
					'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
					'select:not([disabled]):not([aria-hidden])',
					'textarea:not([disabled]):not([aria-hidden])',
					'button:not([disabled]):not([aria-hidden])',
					'[contenteditable]',
					'[tabindex]:not([tabindex^="-"])',
				];
				const focusableElements = ref.querySelectorAll(
					focusableSelectors.join( ',' )
				);
				context.modal = ref;
				context.firstFocusableElement = focusableElements[ 0 ];
				context.lastFocusableElement =
					focusableElements[ focusableElements.length - 1 ];
			}
		},
		windowResize() {
			actions.clearHoverTimeout();
			actions.closeMenu( 'hover' );
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
	},
} );
