import clsx from 'clsx';

import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalBorderRadiusControl as BorderRadiusControl,
} from '@wordpress/block-editor';

import {
	ToolbarButton,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';
import { shuffle } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { columnWidth, childrenBorder, allowedBlocks, templateLock } =
		attributes;

	const { hasInnerBlocks, innerBlockClientIds } = useSelect(
		( select ) => {
			const { getBlock, getBlockOrder } = select( blockEditorStore );

			return {
				hasInnerBlocks: !! getBlock( clientId )?.innerBlocks?.length,
				innerBlockClientIds: getBlockOrder( clientId ),
			};
		},
		[ clientId ]
	);

	const { moveBlockToPosition } = useDispatch( blockEditorStore );

	const blockProps = useBlockProps( {
		style: {
			'--unitone--column-width': columnWidth || undefined,
			'--unitone--children--border-radius':
				null != childrenBorder?.radius &&
				'object' !== typeof childrenBorder?.radius
					? childrenBorder?.radius
					: undefined,
			'--unitone--children--border-top-left-radius':
				childrenBorder?.radius?.topLeft,
			'--unitone--children--border-top-right-radius':
				childrenBorder?.radius?.topRight,
			'--unitone--children--border-bottom-left-radius':
				childrenBorder?.radius?.bottomLeft,
			'--unitone--children--border-bottom-right-radius':
				childrenBorder?.radius?.bottomRight,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'masonry',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const shuffleInnerBlocks = () => {
		if ( innerBlockClientIds?.length < 2 ) return;

		const shuffled = [ ...innerBlockClientIds ];
		for ( let i = shuffled.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * ( i + 1 ) );
			[ shuffled[ i ], shuffled[ j ] ] = [ shuffled[ j ], shuffled[ i ] ];
		}

		shuffled.forEach( ( childClientId, index ) => {
			moveBlockToPosition( childClientId, clientId, clientId, index );
		} );
	};

	return (
		<>
			<BlockControls>
				<ToolbarButton
					icon={ shuffle }
					label={ __( 'Shuffle child blocks', 'unitone' ) }
					onClick={ shuffleInnerBlocks }
				/>
			</BlockControls>

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							columnWidth !==
							metadata.attributes.columnWidth.default
						}
						isShownByDefault
						label={ __( 'Column width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columnWidth:
									metadata.attributes.columnWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Column width', 'unitone' ) } :
									<code>column-width</code>
								</>
							}
							value={ columnWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( { columnWidth: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Child blocks settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							JSON.stringify( childrenBorder?.radius ) !==
							JSON.stringify(
								metadata.attributes.childrenBorder.default
									?.radius
							)
						}
						isShownByDefault
						label={ __( 'Radius' ) }
						onDeselect={ () => {
							childrenBorder.radius =
								metadata.attributes.childrenBorder.default?.radius;

							setAttributes( {
								childrenBorder: {
									...childrenBorder,
								},
							} );
						} }
					>
						<BorderRadiusControl
							values={ childrenBorder?.radius }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									childrenBorder: {
										...childrenBorder,
										radius: newAttribute,
									},
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
