import { store, getElement } from '@wordpress/interactivity';

store( 'unitone/accordion', {
	actions: {
		toggle: () => {
			const { ref } = getElement();
			const selection = ref?.ownerDocument?.defaultView?.getSelection();
			if ( ! selection?.isCollapsed ) {
				selection.removeAllRanges();
			}
		},
	},
} );
