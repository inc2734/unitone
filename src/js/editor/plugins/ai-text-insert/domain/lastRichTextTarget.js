import { dispatch } from '@wordpress/data';

import { getActiveContentEditableRoot } from './richTextFocus';

const listeners = new Set();
let isWrapped = false;
let getEditorDocument;

const notifyListeners = ( payload ) => {
	listeners.forEach( ( listener ) => listener( payload ) );
};

const shouldRecord = ( clientId, attributes ) => {
	if ( ! clientId || 'string' !== typeof clientId ) {
		return false;
	}

	if ( ! attributes || 'object' !== typeof attributes ) {
		return false;
	}

	const keys = Object.keys( attributes );
	if ( keys.length !== 1 ) {
		return false;
	}

	const editorDocument = getEditorDocument?.();
	return !! getActiveContentEditableRoot( editorDocument );
};

const ensureWrapped = () => {
	if ( isWrapped ) {
		return;
	}

	const blockEditorDispatch = dispatch( 'core/block-editor' );
	if ( ! blockEditorDispatch?.updateBlockAttributes ) {
		return;
	}

	const originalUpdateBlockAttributes =
		blockEditorDispatch.updateBlockAttributes;
	if ( originalUpdateBlockAttributes.__unitoneObserved ) {
		isWrapped = true;
		return;
	}

	const wrapped = ( clientId, attributes, ...rest ) => {
		if ( shouldRecord( clientId, attributes ) ) {
			const attributeKey = Object.keys( attributes )[ 0 ];
			notifyListeners( {
				clientId,
				attributeKey,
				timestamp: Date.now(),
			} );
		}

		return originalUpdateBlockAttributes( clientId, attributes, ...rest );
	};

	wrapped.__unitoneObserved = true;
	wrapped.__unitoneOriginal = originalUpdateBlockAttributes;
	blockEditorDispatch.updateBlockAttributes = wrapped;
	isWrapped = true;
};

export const subscribeLastRichTextTarget = (
	listener,
	{ getEditorDocument: getEditorDocumentOption } = {}
) => {
	if ( getEditorDocumentOption ) {
		getEditorDocument = getEditorDocumentOption;
	}
	ensureWrapped();
	listeners.add( listener );

	return () => {
		listeners.delete( listener );
	};
};
