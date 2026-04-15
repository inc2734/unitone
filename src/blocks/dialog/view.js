import { store, getElement } from '@wordpress/interactivity';

const getInteractiveRoot = ( ref ) =>
	ref?.closest( '[data-wp-interactive="unitone/dialog"]' ) || null;

const getDialogElement = ( ref ) => {
	if ( ! ref ) {
		return null;
	}

	if ( 'DIALOG' === ref.tagName ) {
		return ref;
	}

	return (
		ref
			.closest( '[data-wp-interactive="unitone/dialog"]' )
			?.querySelector(
				':scope > [data-unitone-layout~="dialog-content"]'
			) || null
	);
};

const getTriggerTarget = ( trigger, variation = '' ) => {
	if ( ! trigger ) {
		return null;
	}

	if ( 'dialog-button' === variation ) {
		return (
			trigger.querySelector(
				':scope > .wp-block-buttons > .wp-block-button > button.wp-block-button__link'
			) || null
		);
	}

	if ( 'dialog-box' === variation ) {
		return (
			trigger.querySelector(
				':scope > [data-unitone-layout~="decorator"][role="button"]'
			) || null
		);
	}

	return (
		trigger.querySelector(
			'button.wp-block-button__link, [data-unitone-layout~="decorator"][role="button"]'
		) || null
	);
};

store( 'unitone/dialog', {
	actions: {
		open( event ) {
			const { ref } = getElement();
			const root = getInteractiveRoot( ref );
			const dialog = getDialogElement( ref );
			const trigger = event?.target?.closest(
				'[data-unitone-layout~="dialog-trigger"]'
			);
			const variation =
				root?.dataset?.wpContext &&
				JSON.parse( root.dataset.wpContext )?.variation;
			const triggerTarget = getTriggerTarget( trigger, variation || '' );

			if (
				! dialog?.showModal ||
				dialog.open ||
				! root?.contains( trigger ) ||
				! triggerTarget?.contains( event?.target )
			) {
				return;
			}

			dialog.showModal();
		},

		close() {
			const { ref } = getElement();
			const dialog = getDialogElement( ref );

			if ( ! dialog?.open ) {
				return;
			}

			dialog.close();
		},

		closeOnBackdropClick( event ) {
			const { ref } = getElement();
			const dialog = getDialogElement( ref );

			if ( ! dialog?.open || event?.target !== dialog ) {
				return;
			}

			dialog.close();
		},
	},
} );
