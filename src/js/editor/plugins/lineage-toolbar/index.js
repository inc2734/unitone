import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { store as blocksStore } from '@wordpress/blocks';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { LevelUp, LevelDown } from './icons';

const withLineageToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId } = props;

		const { selectBlock } = useDispatch( blockEditorStore );

		const { innerBlocks, parents, current } = useSelect(
			( select ) => {
				const { getBlock, getBlockParents } =
					select( blockEditorStore );
				const { getBlockType } = select( blocksStore );
				const getVariationTitle = ( blockType, thisAttributes ) =>
					blockType?.variations.filter( ( variation ) => {
						switch ( typeof variation?.isActive ) {
							case 'object':
								return variation.isActive.every(
									( targetAttribute ) =>
										thisAttributes?.[ targetAttribute ] ===
										variation.attributes?.[
											targetAttribute
										]
								);
							case 'function':
								return variation.isActive(
									thisAttributes,
									variation.attributes
								);
						}
						return false;
					} )?.[ 0 ]?.title;

				return {
					innerBlocks: getBlock( clientId )?.innerBlocks.map(
						( innerBlock ) => {
							const blockType = getBlockType( innerBlock.name );
							const variationTitle = getVariationTitle(
								blockType,
								innerBlock.attributes
							);
							return {
								title: variationTitle || blockType.title,
								icon: blockType.icon,
								clientId: innerBlock.clientId,
							};
						}
					),
					parents: getBlockParents( clientId ).map(
						( parentClientId ) => {
							const parentBlock = getBlock( parentClientId );
							const parentBlockType = getBlockType(
								parentBlock.name
							);
							const variationTitle = getVariationTitle(
								parentBlockType,
								parentBlock.attributes
							);
							return {
								title: variationTitle || parentBlockType.title,
								icon: parentBlockType.icon,
								clientId: parentClientId,
							};
						}
					),
					current: ( () => {
						const currentBlockType = getBlockType( props.name );
						const variationTitle = getVariationTitle(
							currentBlockType,
							props.attributes
						);
						return {
							title: `${
								variationTitle || currentBlockType.title
							} (${ __( 'Currently Selected', 'unitone' ) })`,
							icon: currentBlockType.icon,
							clientId,
						};
					} )(),
				};
			},
			[ clientId ]
		);

		return (
			<>
				{ ( 0 < parents.length || 0 < innerBlocks.length ) && (
					<BlockControls>
						<ToolbarGroup>
							<ToolbarDropdownMenu
								icon={ LevelUp }
								label={ __(
									'Select a block of ancestors',
									'unitone'
								) }
								controls={ ( 0 < parents.length
									? [ ...parents, current ]
									: []
								).map( ( innerBlock ) => {
									return {
										title: innerBlock.title,
										icon: innerBlock.icon.src,
										onClick: () =>
											selectBlock( innerBlock.clientId ),
									};
								} ) }
							/>

							<ToolbarDropdownMenu
								icon={ LevelDown }
								label={ __(
									'Select a child block',
									'unitone'
								) }
								controls={ innerBlocks.map( ( innerBlock ) => {
									return {
										title: innerBlock.title,
										icon: innerBlock.icon.src,
										onClick: () =>
											selectBlock( innerBlock.clientId ),
									};
								} ) }
							/>
						</ToolbarGroup>
					</BlockControls>
				) }

				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withLineageToolbar' );

addFilter(
	'editor.BlockEdit',
	'unitone/with-lineage-toolbar',
	withLineageToolbar
);
