import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

import { dividersResizeObserver } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName, templateLock } = attributes;

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
			dividersResizeObserver( target );
		},
		[ clientId, attributes, children.length ]
	);

	const blockProps = useBlockProps( { ref } );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'cluster',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock,
		allowedBlocks: [ 'unitone/cluster-divided-content' ],
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
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
