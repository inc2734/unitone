import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { height, itemWidth, noBar } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--height': height || undefined,
			'--unitone--item-width': itemWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'reel',
		blockProps[ 'data-unitone-layout' ],
		{
			'-no-bar': noBar,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<TextControl
						label={
							<>
								{ __( 'Height', 'unitone' ) } :
								<code>height</code>
							</>
						}
						value={ height }
						onChange={ ( newAttribute ) => {
							setAttributes( { height: newAttribute } );
						} }
					/>

					<TextControl
						label={
							<>
								{ __( 'Each items width', 'unitone' ) } :
								<code>width</code>
							</>
						}
						value={ itemWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( { itemWidth: newAttribute } );
						} }
					/>

					<ToggleControl
						label={ __( 'No scrollbar', 'unitone' ) }
						checked={ noBar }
						onChange={ ( newAttribute ) => {
							setAttributes( { noBar: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
