import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { store as blocksStore } from '@wordpress/blocks';
import {
	ToolbarGroup,
	ToolbarDropdownMenu,
	ToolbarButton,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { LevelUp, LevelDown } from './icons';

const getVariationTitle = ( blockType, thisAttributes ) =>
	blockType?.variations.filter( ( variation ) => {
		switch ( typeof variation?.isActive ) {
			case 'object':
				return variation.isActive.every(
					( targetAttribute ) =>
						thisAttributes?.[ targetAttribute ] ===
						variation.attributes?.[ targetAttribute ]
				);
			case 'function':
				return variation.isActive(
					thisAttributes,
					variation.attributes
				);
		}
		return false;
	} )?.[ 0 ]?.title;

const withLineageToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId } = props;

		const { selectBlock } = useDispatch( blockEditorStore );

		const { getBlock, getBlockParents } = useSelect( blockEditorStore );
		const { getBlockType } = useSelect( blocksStore );

		const innerBlocks = getBlock( clientId )?.innerBlocks.map(
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
		);

		const parentClientId = getBlockParents( clientId, true )?.[ 0 ];

		const onSelectParentBlock = useCallback( () => {
			selectBlock( parentClientId );
		}, [ parentClientId ] );

		const onSelectChildBlock = useCallback( () => {
			selectBlock( innerBlocks[ 0 ].clientId );
		}, [ innerBlocks?.[ 0 ]?.clientId ] );

		const childrenDropdownMenuControls = useMemo( () => {
			return innerBlocks.map( ( innerBlock ) => {
				return {
					title: innerBlock.title,
					icon: innerBlock.icon.src,
					onClick: () => selectBlock( innerBlock.clientId ),
				};
			} );
		}, [ clientId ] );

		return (
			<>
				<BlockControls group="parent">
					<ToolbarGroup className="unitone-lineage-toolbar">
						<ToolbarButton
							icon={ LevelUp }
							label={ __( 'Select parent block', 'unitone' ) }
							onClick={ onSelectParentBlock }
							disabled={ ! parentClientId }
						/>

						{ 2 > innerBlocks.length && (
							<ToolbarButton
								icon={ LevelDown }
								label={ __( 'Select child block', 'unitone' ) }
								onClick={ onSelectChildBlock }
								disabled={ 0 === innerBlocks.length }
							/>
						) }

						{ 1 < innerBlocks.length && (
							<ToolbarDropdownMenu
								icon={ LevelDown }
								label={ __( 'Select child block', 'unitone' ) }
								controls={ childrenDropdownMenuControls }
							/>
						) }
					</ToolbarGroup>
				</BlockControls>

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
