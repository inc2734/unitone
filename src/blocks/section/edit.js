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
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { name, attributes, setAttributes, clientId } ) {
	const { tagName, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
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

	const blockProps = useBlockProps( { className: 'unitone-section' } );

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'stack',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

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

	const TagName = tagName;

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							tagName !== metadata.attributes.tagName.default
						}
						isShownByDefault
						label={ __( 'HTML element', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tagName: metadata.attributes.tagName.default,
							} )
						}
					>
						<SelectControl
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<main>', value: 'main' },
								{ label: '<section>', value: 'section' },
								{ label: '<article>', value: 'article' },
								{ label: '<aside>', value: 'aside' },
								{ label: '<div>', value: 'div' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ isShowPlaceholder ? (
				<div { ...blockProps }>
					<Placeholder { ...{ name, onSelect } } />
				</div>
			) : (
				<TagName { ...blockProps }>
					<div data-unitone-layout="gutters">
						<div data-unitone-layout="container">
							<div { ...innerBlocksProps } />
						</div>
					</div>
				</TagName>
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
