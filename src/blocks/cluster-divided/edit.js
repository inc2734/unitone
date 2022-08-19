import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { divider } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'cluster',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-divider:${ divider }` ]: !! divider,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		allowedBlocks: [ 'unitone/cluster-divided-content' ],
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<SelectControl
						label={ __( 'Divider', 'unitone' ) }
						options={ [
							{
								label: __( 'Stripe', 'unitone' ),
								value: 'stripe',
							},
							{
								label: __( 'Slash', 'unitone' ),
								value: 'slash',
							},
							{
								label: __( 'Bordered', 'unitone' ),
								value: 'bordered',
							},
						] }
						value={ divider }
						onChange={ ( newAttribute ) =>
							setAttributes( { divider: newAttribute } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
