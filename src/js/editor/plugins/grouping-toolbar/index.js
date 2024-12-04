import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { ToolbarDropdownMenu } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { switchToBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { group } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-toolbar/index.js
 */
const withGroupingToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { replaceBlocks, multiSelect } = useDispatch( blockEditorStore );

		const {
			hasContentOnlyLocking,
			shouldShowVisualToolbar,
			blockClientIds,
			showGroupButtons,
			blocks,
			possibleBlockTransformations,
		} = useSelect( ( select ) => {
			const {
				getTemplateLock,
				getSelectedBlockClientIds,
				isBlockValid,
				getBlockMode,
				getBlocksByClientId,
				getBlockTransformItems,
				getBlockRootClientId,
				__unstableGetEditorMode,
			} = select( blockEditorStore );

			const selectedBlockClientIds = getSelectedBlockClientIds();
			const isValid = selectedBlockClientIds.every( ( id ) =>
				isBlockValid( id )
			);
			const isVisual = selectedBlockClientIds.every(
				( id ) => getBlockMode( id ) === 'visual'
			);
			const _blocks = getBlocksByClientId( selectedBlockClientIds );
			const isZoomOut = __unstableGetEditorMode() === 'zoom-out';

			return {
				hasContentOnlyLocking: selectedBlockClientIds.some(
					( id ) => getTemplateLock( id ) === 'contentOnly'
				),
				shouldShowVisualToolbar: isValid && isVisual,
				blockClientIds: selectedBlockClientIds,
				blocks: _blocks,
				showGroupButtons: ! isZoomOut,
				possibleBlockTransformations: getBlockTransformItems(
					_blocks,
					getBlockRootClientId( selectedBlockClientIds[ 0 ] )
				).filter( ( transformation ) =>
					transformation.name.includes( 'unitone/' )
				),
			};
		}, [] );

		const isMultiToolbar = blockClientIds.length > 1;

		function selectForMultipleBlocks( insertedBlocks ) {
			if ( insertedBlocks.length > 1 ) {
				multiSelect(
					insertedBlocks[ 0 ].clientId,
					insertedBlocks[ insertedBlocks.length - 1 ].clientId
				);
			}
		}

		// Simple block tranformation based on the `Block Transforms` API.
		function onBlockTransform( name ) {
			const newBlocks = switchToBlockType( blocks, name );
			replaceBlocks( blockClientIds, newBlocks );
			selectForMultipleBlocks( newBlocks );
		}

		const transforms = useMemo( () => {
			return possibleBlockTransformations.map( ( transformation ) => ( {
				title: transformation.title,
				icon: transformation?.icon?.src,
				onClick: () => onBlockTransform( transformation.name ),
			} ) );
		}, [ JSON.stringify( possibleBlockTransformations ) ] );

		const canShowToolbar =
			! hasContentOnlyLocking &&
			shouldShowVisualToolbar &&
			isMultiToolbar &&
			showGroupButtons;

		// useEffect( () => {
		// 	const node = ref.current;
		// 	if ( !! node ) {
		// 		const toolbarGroupNode = node.closest(
		// 			'.components-toolbar-group'
		// 		);
		// 		const prevNode = toolbarGroupNode?.previousSibling;
		// 		const maybeCoreGroupingToolbar =
		// 			!! prevNode &&
		// 			!! prevNode.querySelector(
		// 				':scope > .components-toolbar-button'
		// 			) &&
		// 			prevNode;
		// 		if ( !! maybeCoreGroupingToolbar ) {
		// 			maybeCoreGroupingToolbar.style.display = 'none';
		// 		}
		// 	}
		// }, [ canShowToolbar ] );

		return (
			<>
				{ canShowToolbar && (
					<BlockControls group="parent">
						<div className="unitone-grouping-toolbar">
							{ 0 < transforms.length && (
								<ToolbarDropdownMenu
									icon={ group }
									label={ _x(
										'Group',
										'action: convert blocks to group'
									) }
									controls={ transforms }
								/>
							) }
						</div>
					</BlockControls>
				) }

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withGroupingToolbar' );

addFilter(
	'editor.BlockEdit',
	'unitone/with-grouping-toolbar',
	withGroupingToolbar
);
