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

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

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
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							alignSelf !== metadata.attributes.alignSelf.default
						}
						isShownByDefault
						label={ __( 'Align self', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								alignSelf:
									metadata.attributes.alignSelf.default,
							} )
						}
					>
						<SelectControl
							label={
								<>
									{ __( 'Align self', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>align-self</code>
								</>
							}
							options={ [
								{
									label: '',
									value: '',
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
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							justifySelf !==
							metadata.attributes.justifySelf.default
						}
						isShownByDefault
						label={ __( 'Justify self', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								justifySelf:
									metadata.attributes.justifySelf.default,
							} )
						}
					>
						<SelectControl
							label={
								<>
									{ __( 'Justify self', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>justify-self</code>
								</>
							}
							options={ [
								{
									label: '',
									value: '',
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
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							gridColumn !==
							metadata.attributes.gridColumn.default
						}
						isShownByDefault
						label={ __(
							"A grid item's size and location within a grid column",
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								gridColumn:
									metadata.attributes.gridColumn.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __(
										"A grid item's size and location within a grid column",
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>grid-column</code>
								</>
							}
							help={
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							}
							value={ gridColumn }
							onChange={ ( newAttribute ) => {
								setAttributes( { gridColumn: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							gridRow !== metadata.attributes.gridRow.default
						}
						isShownByDefault
						label={ __(
							"A grid item's size and location within the grid row",
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								gridRow: metadata.attributes.gridRow.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __(
										"A grid item's size and location within the grid row",
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>grid-row</code>
								</>
							}
							help={
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							}
							value={ gridRow }
							onChange={ ( newAttribute ) => {
								setAttributes( { gridRow: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
