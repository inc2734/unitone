import clsx from 'clsx';
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
	RangeControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	GridVisualizer,
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { name, attributes, setAttributes, clientId } ) {
	const {
		cover,
		fill,
		blur,
		portrait,
		columns,
		rows,
		templateLock,
		__unstableUnitoneBlockOutline,
	} = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const defaultAttributes = useMemo( () => {
		const _object = {};
		Object.values( metadata.attributes || [] ).forEach(
			( value, index ) => {
				_object[ Object.keys( metadata.attributes )[ index ] ] =
					value.default;
			}
		);
		return cleanEmptyObject( _object );
	}, [] );

	const preComparativeAttributes = {
		...attributes,
		__unstableUnitoneSupports: undefined,
	};

	const comparativeAttributes = useMemo( () => {
		return cleanEmptyObject( preComparativeAttributes );
	}, [ JSON.stringify( preComparativeAttributes ) ] );

	const [ isShowPlaceholder, setIsShowPlaceholder ] = useState(
		! hasInnerBlocks &&
			JSON.stringify( defaultAttributes ) ===
				JSON.stringify( comparativeAttributes )
	);

	useEffect( () => {
		if (
			JSON.stringify( defaultAttributes ) ===
				JSON.stringify( attributes ) &&
			! hasInnerBlocks
		) {
			setIsShowPlaceholder( true );
		}
	}, [ comparativeAttributes, defaultAttributes, hasInnerBlocks ] );

	const styles = {
		'--unitone--blur': !! blur ? `${ blur }px` : undefined,
		'--unitone--columns':
			parseInt( columns ) !== metadata.attributes.columns.default
				? String( columns )
				: undefined,
		'--unitone--rows':
			parseInt( rows ) !== metadata.attributes.rows.default
				? String( rows )
				: undefined,
	};

	const ref = useRef();

	const blockProps = useBlockProps( {
		ref,
		style: styles,
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'layers',
		blockProps[ 'data-unitone-layout' ],
		{
			'-cover': cover,
			'-fill': fill,
			'-blur': !! blur,
			'-portrait': portrait,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
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

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
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
							__nextHasNoMarginBottom
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
							__nextHasNoMarginBottom
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
							blur !== metadata.attributes.blur.default
						}
						isShownByDefault
						label={ __(
							'Blur the background image/video',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								blur: metadata.attributes.blur.default,
							} )
						}
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Blur the background image/video',
								'unitone'
							) }
							value={ blur }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									blur: !! newAttribute
										? parseFloat( newAttribute )
										: undefined,
								} );
							} }
							initialPosition={ metadata.attributes.blur.default }
							min={ 0 }
							max={ 100 }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							portrait !== metadata.attributes.portrait.default
						}
						isShownByDefault
						label={ __( 'Switch grid lines direction', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								cover: metadata.attributes.portrait.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Switch grid lines direction',
								'unitone'
							) }
							help={ __(
								'Switch vertical and horizontal grid lines direction when portrait and mobile width.',
								'unitone'
							) }
							checked={ portrait }
							onChange={ ( newAttribute ) => {
								setAttributes( { portrait: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							columns !== metadata.attributes.columns.default
						}
						isShownByDefault
						label={ __( 'Columns count', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columns: metadata.attributes.columns.default,
							} )
						}
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Columns count', 'unitone' ) }
							value={ parseInt( columns ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									columns: !! newAttribute
										? parseInt( newAttribute )
										: undefined,
								} );
							} }
							initialPosition={
								metadata.attributes.columns.default
							}
							min={ 1 }
							max={ 24 }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							rows !== metadata.attributes.rows.default
						}
						isShownByDefault
						label={ __( 'Rows count', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								rows: metadata.attributes.rows.default,
							} )
						}
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Rows count', 'unitone' ) }
							value={ parseInt( rows ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									rows: !! newAttribute
										? parseInt( newAttribute )
										: undefined,
								} );
							} }
							initialPosition={ metadata.attributes.rows.default }
							min={ 1 }
							max={ 24 }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ isShowPlaceholder ? (
				<div { ...blockProps }>
					<Placeholder { ...{ name, onSelect } } />
				</div>
			) : (
				<>
					{ __unstableUnitoneBlockOutline && (
						<GridVisualizer ref={ ref } attributes={ attributes } />
					) }
					<div { ...innerBlocksProps } />
				</>
			) }
		</>
	);
}

function Placeholder( { name, onSelect } ) {
	const { getBlockVariations, getBlockType } = useSelect( blocksStore );

	const { blockType, variations } = useMemo(
		() => ( {
			blockType: getBlockType( name ),
			variations: getBlockVariations( name, 'block' ),
		} ),
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
