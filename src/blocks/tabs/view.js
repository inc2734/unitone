import { store, getContext, getElement } from '@wordpress/interactivity';

const activateTab = ( ref, tabId ) => {
	if ( ! tabId ) {
		return false;
	}

	const tab = ref.ownerDocument?.getElementById( tabId );
	if (
		! tab ||
		! ref.contains( tab ) ||
		tab.getAttribute( 'role' ) !== 'tab'
	) {
		return false;
	}

	const targetPanelId = tab.getAttribute( 'aria-controls' );
	if ( ! targetPanelId ) {
		return false;
	}

	const context = getContext();
	context.current = targetPanelId;

	try {
		tab.focus( { preventScroll: true } );
	} catch ( e ) {
		tab.focus();
	}

	return true;
};

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
		handleDocumentClick( event ) {
			const { ref } = getElement();
			const link = event?.target?.closest?.( 'a[href]' );
			if ( ! ref || ! link ) {
				return;
			}

			let url;
			try {
				url = new URL(
					link.getAttribute( 'href' ),
					ref.ownerDocument.baseURI
				);
			} catch ( e ) {
				return;
			}

			const location = ref.ownerDocument?.defaultView?.location;
			if (
				! location ||
				url.origin !== location.origin ||
				url.pathname !== location.pathname ||
				url.search !== location.search
			) {
				return;
			}

			let tabId = url.hash?.slice( 1 ) ?? '';
			try {
				tabId = decodeURIComponent( tabId );
			} catch ( e ) {}

			activateTab( ref, tabId );
		},
	},
	callbacks: {
		syncFromHash() {
			const { ref } = getElement();
			if ( ! ref ) {
				return;
			}

			const hash = ref.ownerDocument?.defaultView?.location?.hash ?? '';
			if ( ! hash?.startsWith( '#' ) ) {
				return;
			}

			let tabId = hash.slice( 1 );
			try {
				tabId = decodeURIComponent( tabId );
			} catch ( e ) {}

			if ( ! tabId ) {
				return;
			}

			activateTab( ref, tabId );
		},
	},
} );
