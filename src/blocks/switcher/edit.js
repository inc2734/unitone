import clsx from 'clsx';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useRef, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

import {
	stairsResizeObserver,
	setStairsStep,
} from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { revert, threshold, templateLock } = attributes;

	const innerBlocksLength = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);
	const hasInnerBlocks = !! innerBlocksLength;

	const ref = useRef( null );

	useEffect( () => {
		const target = ref.current;

		const observer = stairsResizeObserver( target );

		return () => {
			if ( !! target ) {
				observer.unobserve( target );
			}
		};
	}, [] );

	useEffect( () => {
		setStairsStep( ref.current );
	}, [ innerBlocksLength, attributes?.unitone?.alignItems ] );

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--threshold': threshold || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'switcher',
		blockProps[ 'data-unitone-layout' ],
		{
			'-revert': revert,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

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
							threshold !== metadata.attributes.threshold.default
						}
						isShownByDefault
						label={ __( 'Threshold', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								threshold:
									metadata.attributes.threshold.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Threshold', 'unitone' ) }
									&nbsp;:&nbsp;
									<span
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												// translators: %1$s: <code>, %2$s: </code>
												__(
													'Inside the %1$sflex-basis%2$s formula',
													'unitone'
												),
												'<code>',
												'</code>'
											),
										} }
									/>
								</>
							}
							help={ __(
								'When this block is smaller than this width, the contents are arranged in a single column.',
								'unitone'
							) }
							value={ threshold }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									threshold: newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							revert !== metadata.attributes.revert.default
						}
						isShownByDefault
						label={ __( 'Revert', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								revert: metadata.attributes.revert.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Revert', 'unitone' ) }
							help={ __(
								'In single-column display, by default, the elements on the left side of the two-column display are displayed on top, but when enabled, the elements on the right side of the two-column display are displayed on top.',
								'unitone'
							) }
							checked={ revert }
							onChange={ ( newAttribute ) => {
								setAttributes( { revert: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
