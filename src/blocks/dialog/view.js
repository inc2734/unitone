import { store, getElement } from '@wordpress/interactivity';

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

store( 'unitone/dialog', {
	actions: {
		open() {
			const { ref } = getElement();
			const dialog = getDialogElement( ref );

			if ( ! dialog?.showModal || dialog.open ) {
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
