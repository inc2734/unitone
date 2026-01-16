export const getActiveContentEditableRoot = ( editorDocument ) => {
	const activeElement = editorDocument?.activeElement;
	if ( activeElement ) {
		if ( 'true' === activeElement.getAttribute( 'contenteditable' ) ) {
			return activeElement;
		}

		const activeAncestor = activeElement.closest?.(
			'[contenteditable="true"]'
		);
		if ( activeAncestor ) {
			return activeAncestor;
		}
	}

	const getSelection = editorDocument?.defaultView?.getSelection;
	if ( ! getSelection ) {
		return null;
	}

	const selection = getSelection.call( editorDocument.defaultView );
	if ( ! selection || selection.rangeCount === 0 ) {
		return null;
	}

	const range = selection.getRangeAt( 0 );
	const container =
		range.commonAncestorContainer?.nodeType === 3
			? range.commonAncestorContainer.parentNode
			: range.commonAncestorContainer;
	return container?.closest?.( '[contenteditable="true"]' ) || null;
};

const hasSelectionInContentEditable = ( editorDocument ) => {
	const getSelection = editorDocument?.defaultView?.getSelection;
	if ( ! getSelection ) {
		return false;
	}

	const selection = getSelection.call( editorDocument.defaultView );
	if ( ! selection || selection.rangeCount === 0 ) {
		return false;
	}

	const range = selection.getRangeAt( 0 );
	const container =
		range.commonAncestorContainer?.nodeType === 3
			? range.commonAncestorContainer.parentNode
			: range.commonAncestorContainer;
	const contentEditableRoot = container?.closest?.(
		'[contenteditable="true"]'
	);
	return !! contentEditableRoot;
};

export const canInsertToRichText = ( selectedClientId, editorDocument ) => {
	return (
		!! selectedClientId && hasSelectionInContentEditable( editorDocument )
	);
};
