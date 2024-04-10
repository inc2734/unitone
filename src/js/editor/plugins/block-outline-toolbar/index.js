import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useCallback } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { seen } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const withBlockOutlineToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, clientId, isSelected } = props;
		const { __unstableUnitoneBlockOutline } = attributes;

		const { hasInnerBlocks } = useSelect(
			( select ) => {
				const block = select( blockEditorStore ).getBlock( clientId );

				return {
					hasInnerBlocks: 0 < block.innerBlocks.length,
				};
			},
			[ clientId ]
		);

		useEffect( () => {
			if ( __unstableUnitoneBlockOutline ) {
				setAttributes( {
					__unstableUnitoneBlockOutline: false,
				} );
			}
		}, [ isSelected ] );

		const onClick = useCallback( () => {
			setAttributes( {
				__unstableUnitoneBlockOutline: ! __unstableUnitoneBlockOutline,
			} );
		}, [ setAttributes, __unstableUnitoneBlockOutline ] );

		return (
			<>
				{ hasInnerBlocks && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								label={ __( 'Show block outline', 'unitone' ) }
								icon={ seen }
								isPressed={ __unstableUnitoneBlockOutline }
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
