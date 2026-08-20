import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

const asNonNegativeNumber = ( value ) => {
	if ( '' === value || null == value ) {
		return undefined;
	}

	const number = Number( value );
	return Number.isFinite( number ) ? Math.max( 0, number ) : undefined;
};

export default function ( { attributes, clientId, setAttributes } ) {
	const { autoplayDelay, templateLock, width } = attributes;

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetSlideSettings = () =>
		setAttributes( {
			width: metadata.attributes.width.default,
			autoplayDelay: metadata.attributes.autoplayDelay.default,
		} );

	const hasInnerBlocks = useSelect(
		( select ) =>
			0 <
			( select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length || 0 ),
		[ clientId ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-swiper__slide swiper-slide',
		style: {
			'--unitone--slide-width': width || undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					resetAll={ resetSlideSettings }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							metadata.attributes.width.default !== width
						}
						isShownByDefault
						label={ __( 'Slide width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								width: metadata.attributes.width.default,
							} )
						}
					>
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Slide width', 'unitone' ) }
							help={ __(
								'This applies when "Slides per view" is set to "auto".',
								'unitone'
							) }
							value={ width }
							placeholder="100%"
							onChange={ ( value ) =>
								setAttributes( {
									width:
										value ||
										metadata.attributes.width.default,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							metadata.attributes.autoplayDelay.default !==
							autoplayDelay
						}
						isShownByDefault
						label={ __(
							'Autoplay delay override (ms)',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								autoplayDelay:
									metadata.attributes.autoplayDelay.default,
							} )
						}
					>
						<TextControl
							__nextHasNoMarginBottom
							type="number"
							label={ __(
								'Autoplay delay override (ms)',
								'unitone'
							) }
							value={ autoplayDelay || '' }
							min={ 0 }
							onChange={ ( value ) =>
								setAttributes( {
									autoplayDelay:
										asNonNegativeNumber( value ) ??
										metadata.attributes.autoplayDelay
											.default,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
