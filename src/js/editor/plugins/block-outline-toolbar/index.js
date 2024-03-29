import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { seen } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

const withBlockOutlineToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, clientId } = props;
		const { __unstableUnitoneBlockOutline } = attributes;

		// Check if either the block or the inner blocks are selected.
		const hasSelection = useSelect(
			( select ) => {
				const { isBlockSelected, hasSelectedInnerBlock } =
					select( blockEditorStore );
				/* Sets deep to true to also find blocks inside the details content block. */
				return (
					hasSelectedInnerBlock( clientId, true ) ||
					isBlockSelected( clientId )
				);
			},
			[ clientId ]
		);

		const shouldHideOutline =
			! hasSelection && __unstableUnitoneBlockOutline;

		useEffect( () => {
			if ( shouldHideOutline ) {
				setAttributes( {
					__unstableUnitoneBlockOutline: undefined,
				} );
			}
		}, [ shouldHideOutline ] );

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Show block outline', 'unitone' ) }
							icon={ seen }
							isPressed={ __unstableUnitoneBlockOutline }
							onClick={ () =>
								setAttributes( {
									__unstableUnitoneBlockOutline:
										__unstableUnitoneBlockOutline
											? undefined
											: true,
								} )
							}
						/>
					</ToolbarGroup>
				</BlockControls>

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
