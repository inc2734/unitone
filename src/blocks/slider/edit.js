import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function ( { clientId } ) {
	const [ translateX, setTranslateX ] = useState( 0 );

	const ref = useRef();

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'slider',
		blockProps[ 'data-unitone-layout' ],
		{}
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'slider__track',
			style: {
				transform: `translateX(${ translateX }px)`,
			},
			ref,
		},
		{
			templateLock: false,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }></PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
				<div data-unitone-layout="slider__arrows">
					<button
						data-unitone-layout="slider__arrow slider__arrow--prev"
						onClick={ () => {
							if ( 0 < ref.current?.children?.length ) {
								const gap = window
									.getComputedStyle( ref.current )
									.getPropertyValue( 'gap' );
								const width =
									ref.current.children[ 0 ].offsetWidth;

								setTranslateX(
									translateX - parseInt( gap ) - width
								);
							}
						} }
					>
						←
					</button>
					<button
						data-unitone-layout="slider__arrow slider__arrow--next"
						onClick={ () => {
							if ( 0 < ref.current?.children?.length ) {
								const gap = window
									.getComputedStyle( ref.current )
									.getPropertyValue( 'gap' );
								const width =
									ref.current.children[ 0 ].offsetWidth;

								setTranslateX(
									translateX + parseInt( gap ) + width
								);
							}
						} }
					>
						→
					</button>
				</div>
			</div>
		</>
	);
}
