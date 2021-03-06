import classnames from 'classnames';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes } ) {
	const { ratio, switchRatio } = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--ratio': ratio || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'frame',
		blockProps[ 'data-unitone-layout' ],
		{
			'-switch': switchRatio,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		allowedBlocks: [ 'core/image', 'core/video' ],
		renderAppender: false,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Dimensions', 'unitone' ) }
					initialOpen={ false }
				>
					<TextControl
						value={ ratio }
						onChange={ ( newAttribute ) =>
							setAttributes( { ratio: newAttribute } )
						}
					/>

					<ToggleControl
						label={ __(
							'Switch aspect ratio when portrait',
							'unitone'
						) }
						checked={ switchRatio }
						onChange={ ( newAttribute ) => {
							setAttributes( { switchRatio: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
