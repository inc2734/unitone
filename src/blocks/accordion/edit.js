import {
	InspectorControls,
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { summary, q, qLabel, qWidth, a, aLabel, aWidth } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-accordion',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-accordion__detail',
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
				<ToolsPanel label={ __( 'Question', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () => q !== metadata.attributes.q.default }
						isShownByDefault
						label={ __( 'Using label of the question', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								q: metadata.attributes.q.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Using label of the question',
								'unitone'
							) }
							checked={ q }
							onChange={ ( newAttribute ) => {
								setAttributes( { q: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ q && (
						<ToolsPanelItem
							hasValue={ () =>
								qWidth !== metadata.attributes.qWidth.default
							}
							isShownByDefault
							label={ __( 'Width', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									qWidth: metadata.attributes.qWidth.default,
								} )
							}
						>
							<TextControl
								label={
									<>
										{ __( 'Width', 'unitone' ) }
										&nbsp;:&nbsp;
										<code>flex-basis</code>
									</>
								}
								value={ qWidth }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										qWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>

				<ToolsPanel label={ __( 'Answer', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () => a !== metadata.attributes.a.default }
						isShownByDefault
						label={ __( 'Using labe of the answer', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								a: metadata.attributes.a.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Using labe of the answer',
								'unitone'
							) }
							checked={ a }
							onChange={ ( newAttribute ) => {
								setAttributes( { a: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ a && (
						<ToolsPanelItem
							hasValue={ () =>
								aWidth !== metadata.attributes.aWidth.default
							}
							isShownByDefault
							label={ __( 'Width', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									aWidth: metadata.attributes.aWidth.default,
								} )
							}
						>
							<TextControl
								label={
									<>
										{ __( 'Width', 'unitone' ) }
										&nbsp;:&nbsp;
										<code>flex-basis</code>
									</>
								}
								value={ aWidth }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										aWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<details { ...blockProps }>
				<summary className="unitone-accordion__summary">
					<span
						className="unitone-accordion__summary-inner"
						data-unitone-layout="with-sidebar -sidebar:right"
					>
						<span
							className="unitone-accordion__summary-content"
							data-unitone-layout="with-sidebar -sidebar:left"
							style={ {
								'--unitone--sidebar-width': qWidth || undefined,
							} }
						>
							{ q && (
								<span className="unitone-accordion__q">
									<span className="unitone-accordion__q-text">
										<RichText
											value={ qLabel }
											onChange={ ( newAttribute ) => {
												setAttributes( {
													qLabel: newAttribute,
												} );
											} }
											placeholder={ __( 'Q', 'unitone' ) }
										/>
									</span>
								</span>
							) }

							<span className="unitone-accordion__summary-text">
								<RichText
									value={ summary }
									onChange={ ( newAttribute ) => {
										setAttributes( {
											summary: newAttribute,
										} );
									} }
									placeholder={ __(
										'Enter summary here',
										'unitone'
									) }
								/>
							</span>
						</span>

						<span className="unitone-accordion__icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24.71 13.06"
							>
								<polyline
									points="24.35 .35 12.35 12.35 .35 .35"
									fill="none"
									stroke="currentColor"
									strokeWidth="2px"
									strokeLinecap="round"
								/>
							</svg>
						</span>
					</span>
				</summary>

				<div
					className="unitone-accordion__content"
					data-unitone-layout="with-sidebar -sidebar:left"
					style={ {
						'--unitone--sidebar-width': aWidth || undefined,
					} }
				>
					{ a && (
						<div className="unitone-accordion__a">
							<span className="unitone-accordion__a-text">
								<RichText
									value={ aLabel }
									onChange={ ( newAttribute ) => {
										setAttributes( {
											aLabel: newAttribute,
										} );
									} }
									placeholder={ __( 'A', 'unitone' ) }
								/>
							</span>
						</div>
					) }

					<div { ...innerBlocksProps } />
				</div>
			</details>
		</>
	);
}
