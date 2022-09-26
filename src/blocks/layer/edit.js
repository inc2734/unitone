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
			'--unitone--grid-column': gridColumn || undefined,
			'--unitone--grid-row': gridRow || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'layers__layer',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-align-self:${ alignSelf }` ]: !! alignSelf,
			[ `-justify-self:${ justifySelf }` ]: !! justifySelf,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<SelectControl
						label={
							<>
								{ __( 'Align self', 'unitone' ) } :
								<code>align-self</code>
							</>
						}
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
						label={
							<>
								{ __( 'Justify self', 'unitone' ) } :
								<code>justify-self</code>
							</>
						}
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
						label={
							<>
								{ __(
									"A grid item's size and location within a grid column",
									'unitone'
								) }
								: <code>grid-column</code>
							</>
						}
						value={ gridColumn }
						onChange={ ( newAttribute ) => {
							setAttributes( { gridColumn: newAttribute } );
						} }
					/>

					<TextControl
						label={
							<>
								{ __(
									"A grid item's size and location within the grid row",
									'unitone'
								) }
								: <code>grid-row</code>
							</>
						}
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
