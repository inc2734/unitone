import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	SelectControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import metadata from './block.json';

import { dividersResizeObserver } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName, columnMinWidth } = attributes;

	const { hasInnerBlocks, children } = useSelect(
		( select ) => {
			const block = select( 'core/block-editor' ).getBlock( clientId );
			return {
				hasInnerBlocks: !! block?.innerBlocks?.length,
				children: block?.innerBlocks,
			};
		},
		[ clientId ]
	);

	const ref = useRefEffect(
		( target ) => {
			dividersResizeObserver.unobserve( target );
			dividersResizeObserver.observe( target );
		},
		[ clientId, attributes, children.length ]
	);

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--column-min-width': columnMinWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'responsive-grid',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		allowedBlocks: [ 'unitone/responsive-grid-divided-content' ],
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

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
								{ label: '<div>', value: 'div' },
								{ label: '<ul>', value: 'ul' },
								{ label: '<ol>', value: 'ol' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>
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

			<TagName { ...innerBlocksProps } />
		</>
	);
}
