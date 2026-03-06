import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	RangeControl,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	normalizeForRangeControl,
	normalizeForTextControl,
	normalizeForToggleControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { itemWidth, duration, reverse, pauseOnHover, templateLock } =
		attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--animation-duration': !! duration
				? `${ duration }s`
				: undefined,
			'--unitone--item-width': itemWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'marquee-wrapper',
		blockProps[ 'data-unitone-layout' ],
		{
			'-reverse': reverse,
			'-pause-on-hover': pauseOnHover,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'marquee',
		},
		{
			orientation: 'horizontal',
			templateLock,
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

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
							itemWidth !== metadata.attributes.itemWidth.default
						}
						isShownByDefault
						label={ __( 'Each items width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								itemWidth:
									metadata.attributes.itemWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Each items width', 'unitone' ) } :
									<code>flex-basis</code>
								</>
							}
							value={ normalizeForTextControl( itemWidth ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									itemWidth:
										normalizeForTextControl( newAttribute ),
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							duration !== metadata.attributes.duration.default
						}
						isShownByDefault
						label={ __( 'Speed (s)', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								duration: metadata.attributes.duration.default,
							} )
						}
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Speed (s)', 'unitone' ) }
							value={ normalizeForRangeControl( duration ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									duration:
										normalizeForRangeControl(
											newAttribute
										),
								} );
							} }
							min={ 1 }
							max={ 100 }
							step={ 1 }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							reverse !== metadata.attributes.reverse.default
						}
						isShownByDefault
						label={ __( 'Reverse direction', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								reverse: metadata.attributes.reverse.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Reverse direction', 'unitone' ) }
							checked={ normalizeForToggleControl( reverse ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									reverse:
										normalizeForToggleControl(
											newAttribute
										),
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							pauseOnHover !==
							metadata.attributes.pauseOnHover.default
						}
						isShownByDefault
						label={ __( 'Text is also centered', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								pauseOnHover:
									metadata.attributes.pauseOnHover.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Pause on hover', 'unitone' ) }
							checked={ normalizeForToggleControl(
								pauseOnHover
							) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									pauseOnHover:
										normalizeForToggleControl(
											newAttribute
										),
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
