import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	Button,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { ChevronDown, Cross } from './mark';
import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { summary, mark, q, qLabel, qWidth, a, aLabel, aWidth } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: classnames( 'unitone-accordion', {
			[ `unitone-accordion--mark:cross` ]: 'cross' === mark,
		} ),
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

	// Check if either the block or the inner blocks are selected.
	const hasSelection = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( blockEditorStore );
			/* Sets deep to true to also find blocks inside the details content block. */
			return (
				hasSelectedInnerBlock( clientId, true ) ||
				isBlockSelected( clientId )
			);
		},
		[ clientId ]
	);

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							mark !== metadata.attributes.mark.default
						}
						isShownByDefault
						label={ __( 'Mark', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								mark: metadata.attributes.mark.default,
							} )
						}
					>
						<fieldset className="block-editor-text-transform-control">
							<div className="block-editor-text-transform-control__buttons">
								<Button
									isPressed={ 'chevron-down' === mark }
									label={ __( 'Chevron down', 'unitone' ) }
									icon={ () => (
										<ChevronDown
											width={ 16 }
											height={ 16 }
										/>
									) }
									onClick={ () =>
										setAttributes( { mark: undefined } )
									}
								/>

								<Button
									isPressed={ 'cross' === mark }
									label={ __( 'cross', 'unitone' ) }
									icon={ () => (
										<Cross width={ 16 } height={ 16 } />
									) }
									onClick={ () =>
										setAttributes( { mark: 'cross' } )
									}
								/>
							</div>
						</fieldset>
					</ToolsPanelItem>
				</ToolsPanel>

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

			<details { ...blockProps } open={ hasSelection }>
				<summary // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
					className="unitone-accordion__summary"
					onClick={ ( event ) => event.preventDefault() }
				>
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
							{ 'cross' === mark ? <Cross /> : <ChevronDown /> }
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
