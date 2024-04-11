import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { seen } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const withBlockOutlineToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId, isSelected } = props;

		const { canDisplayed, targetClientId, targetBlockAttributes } =
			useSelect(
				( select ) => {
					if ( ! isSelected ) {
						return {};
					}

					const data = select( blockEditorStore );
					const block = data.getBlock( clientId );
					const hasInnerBlocks = 0 < block.innerBlocks.length;
					const rootClientId = data.getBlockParents(
						clientId,
						false
					)?.[ 0 ];
					const _targetClientId = rootClientId || clientId;

					return {
						canDisplayed: hasInnerBlocks || rootClientId,
						targetClientId: _targetClientId,
						targetBlockAttributes:
							data.getBlockAttributes( _targetClientId ),
					};
				},
				[ clientId, isSelected ]
			);

		const { updateBlockAttributes } = useDispatch( blockEditorStore );

		const onClick = useCallback( () => {
			updateBlockAttributes( targetClientId, {
				__unstableUnitoneBlockOutline:
					! targetBlockAttributes?.__unstableUnitoneBlockOutline,
			} );
		}, [
			updateBlockAttributes,
			targetClientId,
			targetBlockAttributes?.__unstableUnitoneBlockOutline,
		] );

		return (
			<>
				{ canDisplayed && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								label={ __( 'Show block outline', 'unitone' ) }
								icon={ seen }
								isPressed={
									targetBlockAttributes?.__unstableUnitoneBlockOutline
								}
								onClick={ onClick }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withBlockOutlineToolbar' );

addFilter(
	'editor.BlockEdit',
	'unitone/with-block-outline-toolbar',
	withBlockOutlineToolbar
);

const withBlockOutlineData = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, wrapperProps } = props;
		const { __unstableUnitoneBlockOutline } = attributes;

		return (
			<BlockListBlock
				{ ...props }
				wrapperProps={ {
					...wrapperProps,
					'data-unitone-block-outline':
						__unstableUnitoneBlockOutline || undefined,
				} }
			/>
		);
	};
}, 'withBlockOutlineData' );

addFilter(
	'editor.BlockListBlock',
	'unitone/with-block-outline-data',
	withBlockOutlineData
);
