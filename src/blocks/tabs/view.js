import { store, getContext } from '@wordpress/interactivity';

const { state } = store( 'unitone/tabs', {
	state: {
		get current() {
			const context = getContext();
			return context.current;
		},

		get selected() {
			const context = getContext();
			return context.clientId === state.current;
		},
	},
	actions: {
		handleTabClick() {
			const context = getContext();
			context.current = context.clientId;
		},
	},
} );
