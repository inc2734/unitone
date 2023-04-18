import classnames from 'classnames';
import { get } from 'lodash';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	__experimentalBlockVariationPicker as BlockVariationPicker,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { name, attributes, setAttributes, clientId } ) {
	const { cover, fill, portrait } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const defaultAttributes = {};
	Object.values( metadata.attributes || [] ).forEach( ( value, index ) => {
		defaultAttributes[ Object.keys( metadata.attributes )[ index ] ] =
			value.default;
	} );

	const [ isShowPlaceholder, setIsShowPlaceholder ] = useState(
		! hasInnerBlocks &&
			JSON.stringify( defaultAttributes ) === JSON.stringify( attributes )
	);

	useEffect( () => {
		if (
			JSON.stringify( defaultAttributes ) ===
				JSON.stringify( attributes ) &&
			! hasInnerBlocks
		) {
			setIsShowPlaceholder( true );
		}
	}, [ attributes, defaultAttributes, hasInnerBlocks ] );

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'layers',
		blockProps[ 'data-unitone-layout' ],
		{
			'-cover': cover,
			'-fill': fill,
			'-portrait': portrait,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const onSelect = ( nextVariation ) => {
		setIsShowPlaceholder( false );

		if ( nextVariation.attributes ) {
			setAttributes( nextVariation.attributes );
		}

		if ( nextVariation.innerBlocks ) {
			replaceInnerBlocks(
				clientId,
				createBlocksFromInnerBlocksTemplate(
					nextVariation.innerBlocks
				),
				true
			);
		}
	};

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							cover !== metadata.attributes.cover.default
						}
						isShownByDefault
						label={ __(
							'Use background image/video (Cover)',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								cover: metadata.attributes.cover.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Use background image/video (Cover)',
								'unitone'
							) }
							help={
								__(
									'Treat the first child block as a background image/video.',
									'unitone'
								) +
								__(
									'The background image/video is enlarged according or reduces to the amount of content.',
									'unitone'
								)
							}
							checked={ cover }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									cover: newAttribute,
									fill: fill && ! newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							fill !== metadata.attributes.fill.default
						}
						isShownByDefault
						label={ __(
							'Use background image/video (Fill)',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								fill: metadata.attributes.fill.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Use background image/video (Fill)',
								'unitone'
							) }
							help={
								__(
									'Treat the first child block as a background image/video.',
									'unitone'
								) +
								__(
									'The background image/video is enlarged according to the amount of content.',
									'unitone'
								)
							}
							checked={ fill }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									fill: newAttribute,
									cover: cover && ! newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							portrait !== metadata.attributes.portrait.default
						}
						isShownByDefault
						label={ __( 'Enable portrait mode', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								cover: metadata.attributes.portrait.default,
							} )
						}
					>
						<ToggleControl
							label={ __( 'Enable portrait mode', 'unitone' ) }
							help={ __(
								'If enabled, the number of vertical and horizontal grid lines is switched when the viewport is portrait.',
								'unitone'
							) }
							checked={ portrait }
							onChange={ ( newAttribute ) => {
								setAttributes( { portrait: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ isShowPlaceholder ? (
				<div { ...blockProps }>
					<Placeholder { ...{ name, onSelect } } />
				</div>
			) : (
				<div { ...innerBlocksProps } />
			) }
		</>
	);
}

function Placeholder( { name, onSelect } ) {
	const { blockType, variations } = useSelect(
		( select ) => {
			const { getBlockVariations, getBlockType } = select( blocksStore );

			return {
				blockType: getBlockType( name ),
				variations: getBlockVariations( name, 'block' ),
			};
		},
		[ name ]
	);

	return (
		<BlockVariationPicker
			icon={ get( blockType, [ 'icon', 'src' ] ) }
			label={ get( blockType, [ 'title' ] ) }
			variations={ variations }
			onSelect={ onSelect }
			allowSkip
		/>
	);
}
