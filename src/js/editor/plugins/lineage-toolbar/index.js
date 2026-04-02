import {
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToolbarGroup,
	ToolbarDropdownMenu,
	ToolbarButton,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';
import { store as blocksStore } from '@wordpress/blocks';
import { useSelect, useDispatch, select as dataSelect } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { LevelUp, LevelDown } from './icons';

const EMPTY_ARRAY = [];

const getVariationTitle = ( blockType, thisAttributes ) =>
	blockType?.variations?.filter( ( variation ) => {
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

const SelectedLineageToolbar = ( { clientId } ) => {
	const { selectBlock } = useDispatch( blockEditorStore );

	const rawInnerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks ??
			EMPTY_ARRAY,
		[ clientId ]
	);

	const parentClientId = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlockParents( clientId, true )?.[ 0 ],
		[ clientId ]
	);

	const innerBlocks = useMemo( () => {
		const { getBlockType } = dataSelect( blocksStore );

		return rawInnerBlocks.map( ( innerBlock ) => {
			const blockType = getBlockType( innerBlock.name );
			const variationTitle = getVariationTitle(
				blockType,
				innerBlock.attributes
			);

			return {
				title: variationTitle || blockType?.title || innerBlock.name,
				icon: blockType?.icon,
				clientId: innerBlock.clientId,
			};
		} );
	}, [ rawInnerBlocks ] );

	const onSelectParentBlock = useCallback( () => {
		selectBlock( parentClientId );
	}, [ parentClientId, selectBlock ] );

	const firstInnerBlockId = innerBlocks?.[ 0 ]?.clientId;
	const onSelectChildBlock = useCallback( () => {
		if ( firstInnerBlockId ) {
			selectBlock( firstInnerBlockId );
		}
	}, [ firstInnerBlockId, selectBlock ] );

	const childrenDropdownMenuControls = useMemo( () => {
		return innerBlocks.map( ( innerBlock ) => {
			return {
				title: innerBlock.title,
				icon: innerBlock.icon?.src || innerBlock.icon,
				onClick: () => selectBlock( innerBlock.clientId ),
			};
		} );
	}, [ innerBlocks, selectBlock ] );

	return (
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
	);
};

const withLineageToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId, isSelected } = props;

		return (
			<>
				{ isSelected && (
					<SelectedLineageToolbar clientId={ clientId } />
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
