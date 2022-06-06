import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { alignSelf, justifySelf, gridColumn, gridRow } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--grid-column': gridColumn || undefined,
			'--grid-row': gridRow || undefined,
		},
	} );
	blockProps[ 'data-layout' ] = classnames(
		'layers__layer',
		blockProps[ 'data-layout' ],
		{
			[ `-align-self:${ alignSelf }` ]: !! alignSelf,
			[ `-justify-self:${ justifySelf }` ]: !! justifySelf,
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
					<SelectControl
						label={ __( 'Align self', 'unitone' ) }
						options={ [
							{
								label: '',
								value: undefined,
							},
							{
								label: 'auto',
								value: 'auto',
							},
							{
								label: 'normal',
								value: 'normal',
							},
							{
								label: 'start',
								value: 'start',
							},
							{
								label: 'center',
								value: 'center',
							},
							{
								label: 'end',
								value: 'end',
							},
							{
								label: 'stretch',
								value: 'stretch',
							},
							{
								label: 'baseline',
								value: 'baseline',
							},
						] }
						value={ alignSelf }
						onChange={ ( newAttribute ) =>
							setAttributes( { alignSelf: newAttribute } )
						}
					/>

					<SelectControl
						label={ __( 'Justify self', 'unitone' ) }
						options={ [
							{
								label: '',
								value: undefined,
							},
							{
								label: 'auto',
								value: 'auto',
							},
							{
								label: 'normal',
								value: 'normal',
							},
							{
								label: 'start',
								value: 'start',
							},
							{
								label: 'center',
								value: 'center',
							},
							{
								label: 'end',
								value: 'end',
							},
							{
								label: 'stretch',
								value: 'stretch',
							},
							{
								label: 'baseline',
								value: 'baseline',
							},
						] }
						value={ justifySelf }
						onChange={ ( newAttribute ) =>
							setAttributes( { justifySelf: newAttribute } )
						}
					/>

					<TextControl
						label={ __( 'grid-column', 'unitone' ) }
						value={ gridColumn }
						onChange={ ( newAttribute ) => {
							setAttributes( { gridColumn: newAttribute } );
						} }
					/>

					<TextControl
						label={ __( 'grid-row', 'unitone' ) }
						value={ gridRow }
						onChange={ ( newAttribute ) => {
							setAttributes( { gridRow: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
