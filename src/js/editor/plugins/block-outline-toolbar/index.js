import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { seen } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const withBlockOutlineToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { setAttributes, clientId, isSelected } = props;

		const [ isPressed, setIsPressed ] = useState( false );

		const hasInnerBlocks = useSelect(
			( select ) =>
				!! select( blockEditorStore ).getBlock( clientId ).innerBlocks
					.length
		);
		const canDisplayed = hasInnerBlocks;

		return (
			<>
				{ isSelected && canDisplayed && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								label={ __( 'Show block outline', 'unitone' ) }
								icon={ seen }
								isPressed={ isPressed }
								onClick={ () => {
									const newIsPressed = ! isPressed;
									setIsPressed( newIsPressed );
									setAttributes( {
										__unstableUnitoneBlockOutline:
											newIsPressed,
									} );
								} }
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
