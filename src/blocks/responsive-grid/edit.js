import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import metadata from './block.json';

import { stairsResizeObserver } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { columnMinWidth, unitone, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const ref = useRefEffect(
		( target ) => {
			stairsResizeObserver( target );
		},
		[
			clientId,
			columnMinWidth,
			unitone?.gap,
			unitone?.stairs,
			unitone?.stairsUp,
		]
	);

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--column-min-width': columnMinWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'responsive-grid',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							columnMinWidth !==
							metadata.attributes.columnMinWidth.default
						}
						isShownByDefault
						label={ __( 'Column min width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								columnMinWidth:
									metadata.attributes.columnMinWidth.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __( 'Column min width', 'unitone' ) }
									&nbsp;:&nbsp;
									<span
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												// translators: %1$s: <code>, %2$s: </code>
												__(
													'Inside the %1$sgrid-template-columns%2$s formula',
													'unitone'
												),
												'<code>',
												'</code>'
											),
										} }
									/>
								</>
							}
							help={
								__(
									'When the column width is less than this value, it is aligned in a single column.',
									'unitone'
								) +
								' ' +
								__(
									'If "auto-repeat" is "auto-fill" the column will maintain this size." auto-fit", the column will stretch to fill the available space.',
									'unitone'
								)
							}
							value={ columnMinWidth }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									columnMinWidth: newAttribute,
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
