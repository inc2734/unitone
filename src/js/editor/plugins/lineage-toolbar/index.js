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

		const { innerBlocks, parents } = useSelect(
			( select ) => {
				const { getBlock, getBlockParents } =
					select( blockEditorStore );
				const { getBlockType } = select( blocksStore );

				const currentBlockType = getBlockType( props.name );

				return {
					innerBlocks: getBlock( clientId )?.innerBlocks.map(
						( innerBlock ) => {
							const blockType = getBlockType( innerBlock.name );
							return {
								title: blockType.title,
								icon: blockType.icon,
								clientId: innerBlock.clientId,
							};
						}
					),
					parents: [
						...getBlockParents( clientId ).map(
							( parentClientId ) => {
								const parentBlock = getBlock( parentClientId );
								const parentBlockType = getBlockType(
									parentBlock.name
								);
								return {
									title: parentBlockType.title,
									icon: parentBlockType.icon,
									clientId: parentClientId,
								};
							}
						),
						{
							title: `${ currentBlockType.title } (${ __(
								'Currently Selected',
								'unitone'
							) })`,
							icon: currentBlockType.icon,
							clientId,
						},
					],
				};
			},
			[ clientId ]
		);

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarDropdownMenu
							icon={ LevelUp }
							label={ __(
								'Select a block of ancestors',
								'unitone'
							) }
							controls={ parents.map( ( innerBlock ) => {
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
							label={ __( 'Select a child block', 'unitone' ) }
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
