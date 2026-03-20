import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginBlockSettingsMenuItem } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { lockOutline, unlock } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const clearEditableOutlineClass = ( clientIds ) => {
	if ( 'undefined' === typeof document ) {
		return;
	}

	// DOM manipulation adds the `.has-editable-outline` attribute to child blocks,
	// so it needs to be removed using DOM manipulation.
	// @see https://github.com/WordPress/gutenberg/blob/d259aab6b373789a6bb94661a67805eea7d089ba/packages/block-editor/src/components/use-flash-editable-blocks/index.js
	const documents = [ document ];
	document.querySelectorAll( 'iframe' ).forEach( ( iframeElement ) => {
		try {
			if ( iframeElement.contentDocument ) {
				documents.push( iframeElement.contentDocument );
			}
		} catch {}
	} );

	clientIds.forEach( ( clientId ) => {
		documents.forEach( ( currentDocument ) => {
			currentDocument
				.querySelectorAll( `[data-block="${ clientId }"]` )
				.forEach( ( blockElement ) => {
					blockElement.classList.remove( 'has-editable-outline' );
				} );
		} );
	} );
};

function UnitoneContentOnlyLocking() {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { selectedBlock, isInPattern } = useSelect( ( select ) => {
		const clientId = select( blockEditorStore ).getSelectedBlockClientId();
		if ( ! clientId ) {
			return {};
		}

		const { getBlock, getBlockParents } = select( blockEditorStore );

		const block = getBlock( clientId );
		const parentClientIds = getBlockParents( clientId ) || [];
		const isDescendantOfPattern = parentClientIds.some(
			( parentClientId ) =>
				!! getBlock( parentClientId )?.attributes?.metadata?.patternName
		);

		return {
			selectedBlock: block,
			isInPattern:
				!! block?.attributes?.metadata?.patternName ||
				isDescendantOfPattern,
		};
	}, [] );

	const templateLock = selectedBlock?.attributes?.templateLock;
	const isLocking = 'contentOnly' === templateLock;

	if (
		! selectedBlock ||
		isInPattern ||
		( !! templateLock && ! isLocking )
	) {
		return null;
	}

	const label = ! isLocking
		? __( 'Modify content only', 'unitone' )
		: __( 'Unlock content only locking', 'unitone' );

	const icon = ! isLocking ? lockOutline : unlock;

	const onClick = () => {
		const nextTemplateLock = ! isLocking ? 'contentOnly' : undefined;

		updateBlockAttributes( selectedBlock.clientId, {
			templateLock: nextTemplateLock,
		} );

		if ( undefined === nextTemplateLock ) {
			const childClientIds =
				selectedBlock?.innerBlocks?.map(
					( innerBlock ) => innerBlock.clientId
				) || [];

			clearEditableOutlineClass( childClientIds );
		}
	};

	return (
		<PluginBlockSettingsMenuItem
			icon={ icon }
			label={ label + ' [unitone]' }
			onClick={ onClick }
			className="unitone-content-only-locking"
		/>
	);
}

registerPlugin( 'unitone-content-only-locking', {
	render: UnitoneContentOnlyLocking,
	icon: null,
} );
