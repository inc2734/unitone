import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

import { verticalsResizeObserver } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { textOrientation, switchWritingMode, threshold } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) => {
			const block = select( blockEditorStore ).getBlock( clientId );
			return !! block?.innerBlocks?.length;
		},
		[ clientId ]
	);

	const ref = useRefEffect( ( target ) => {
		verticalsResizeObserver( target );
	}, [] );

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'vertical-writing-wrapper',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			ref,
			'data-unitone-layout': classnames( 'vertical-writing', {
				[ `-text-orientation:${ textOrientation }` ]:
					!! textOrientation,
				'-switch': switchWritingMode,
			} ),
			style: {
				'--unitone--threshold': threshold || undefined,
			},
		},
		{
			templateLock: false,
			allowedBlocks: [
				'core/heading',
				'core/paragraph',
				'core/buttons',
				'core/image',
				'core/video',
				'unitone/stack',
			],
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							textOrientation !==
							metadata.attributes.textOrientation.default
						}
						isShownByDefault
						label={ __( 'Text orientation', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								textOrientation:
									metadata.attributes.textOrientation.default,
							} )
						}
					>
						<SelectControl
							label={ __( 'Text orientation', 'unitone' ) }
							options={ [
								{ label: '', value: '' },
								{ label: 'mixed', value: 'mixed' },
								{ label: 'upright', value: 'upright' },
								{ label: 'sideways', value: 'sideways' },
							] }
							value={ textOrientation }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									textOrientation: newAttribute,
								} )
							}
						/>
					</ToolsPanelItem>

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
							label={ __( 'Threshold', 'unitone' ) }
							help={ __(
								'When this block is smaller than this width, switch writing mode.',
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
							switchWritingMode !==
							metadata.attributes.switchWritingMode.default
						}
						isShownByDefault
						label={ __(
							'Switch writing mode when portrait',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								switchWritingMode:
									metadata.attributes.switchWritingMode
										.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Switch writing mode when portrait',
								'unitone'
							) }
							checked={ switchWritingMode }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									switchWritingMode: newAttribute,
								} )
							}
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
