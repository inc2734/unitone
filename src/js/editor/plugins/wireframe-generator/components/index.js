import {
	Button,
	Modal,
	Popover,
	ToggleControl,
	TextareaControl,
	Spinner,
} from '@wordpress/components';

import { useEntityProp } from '@wordpress/core-data';
import { BlockPreview } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { Icon, desktop, tablet, mobile, help } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import icon from '../icon';

export const WireFrameGeneratorButton = ( { isOpen, setIsOpen } ) => (
	<Button
		label={ __( 'Wireframe Generator', 'unitone' ) }
		onClick={ () => setIsOpen( ! isOpen ) }
	>
		<Icon icon={ icon } />
	</Button>
);

const WireframeGeneratorModalPure = ( {
	isOpenHelpPopover,
	setIsOpen,
	setIsOpenHelpPopover,
	isGeneratingHomepage,
	isGeneratingLowerLevel,
	isLoading,
	previewPatterns,
	previewMode,
	setPreviewMode,
	onClickGenerate,
	onClickGenerateForLowerLevel,
	onClickInsert,
	usingChatGPT,
	setUsingChatGPT,
	customPromptPlaceholder,
	customPrompt,
	setCustomPrompt,
	canvasRef,
} ) => {
	const [ apiKey ] = useEntityProp(
		'root',
		'site',
		'unitone_openai_api_key'
	);

	return (
		<Modal
			title={
				<>
					{ __( 'Wireframe Generator', 'unitone' ) }
					<Button
						icon={ help }
						label={ __( 'Help' ) }
						onClick={ () =>
							setIsOpenHelpPopover( ! isOpenHelpPopover )
						}
					>
						{ isOpenHelpPopover && (
							<Popover
								className="unitone-wireframe-generator-help-popover"
								onClose={ () => setIsOpenHelpPopover( false ) }
							>
								<div
									className="unitone-wireframe-generator-help-popover__content"
									tabIndex="0"
									style={ {
										padding: '8px',
										minWidth: '260px',
									} }
								>
									<p>
										{ __(
											'Generates a wireframe using the unitone patterns. When inserted, images are replaced with dummy images.',
											'unitone'
										) }
									</p>
								</div>
							</Popover>
						) }
					</Button>
				</>
			}
			onRequestClose={ () => {
				setIsOpen( false );
				setIsOpenHelpPopover( false );
			} }
			isFullScreen
			className="unitone-wireframe-generator-modal"
		>
			<div className="unitone-wireframe-generator-settings">
				<div className="unitone-wireframe-generator-settings__sub">
					<div
						style={ {
							display: 'grid',
							gap: 'var(--unitone--s1)',
							justifyItems: 'stretch',
						} }
					>
						<div className="unitone-wireframe-generator-settings__generate-buttons">
							<Button
								variant="secondary"
								onClick={ onClickGenerate }
								disabled={ isGeneratingHomepage }
							>
								{ isGeneratingHomepage ? (
									<>
										<Spinner />
										{ __( 'Now generating…', 'unitone' ) }
									</>
								) : (
									__( 'Generate for homepage', 'unitone' )
								) }
							</Button>

							<Button
								variant="secondary"
								onClick={ onClickGenerateForLowerLevel }
								disabled={ isGeneratingLowerLevel }
							>
								{ isGeneratingLowerLevel ? (
									<>
										<Spinner />
										{ __( 'Now generating…', 'unitone' ) }
									</>
								) : (
									__(
										'Generate for lower-level pages',
										'unitone'
									)
								) }
							</Button>
						</div>

						<hr />

						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Generate text to be reflected in the wireframe with ChatGPT',
								'unitone'
							) }
							checked={ usingChatGPT }
							disabled={
								! apiKey ||
								! Array.isArray( previewPatterns ) ||
								1 > previewPatterns.length
							}
							onChange={ () => {
								setUsingChatGPT( ! usingChatGPT );
								setCustomPrompt( '' );
							} }
							help={
								! apiKey &&
								__(
									'To use this function, you must set an OpenAI API key on the unitone setup',
									'unitone'
								)
							}
						/>

						<hr />

						{ usingChatGPT && (
							<>
								<div>
									<p
										style={ {
											marginTop: 0,
											backgroundColor: '#fff9e6',
											border: '1px solid #fff3cd',
											padding: '.75em',
										} }
									>
										{ __(
											'The wireframe generator will send the generated wireframe information to ChatGPT. Enter any instructions you have so that the wireframe reflects your intended text. Note that the function is supported only for Japanese.',
											'unitone'
										) }
									</p>

									<div style={ { width: '100%' } }>
										<TextareaControl
											__nextHasNoMarginBottom
											label={ __(
												'The text you want to generate',
												'unitone'
											) }
											placeholder={ `例: ${ customPromptPlaceholder }` }
											value={ customPrompt }
											onChange={ ( value ) =>
												setCustomPrompt( value.trim() )
											}
										/>
									</div>
								</div>

								<hr />
							</>
						) }

						<Button
							variant="primary"
							onClick={ onClickInsert }
							disabled={
								! Array.isArray( previewPatterns ) ||
								1 > previewPatterns.length ||
								isLoading
							}
						>
							{ ( () => {
								let label = __( 'Insert wireframe', 'unitone' );
								if ( isLoading ) {
									label = (
										<>
											<Spinner />
											{ __(
												'Now inserting…',
												'unitone'
											) }
										</>
									);
								} else if ( usingChatGPT ) {
									label = __(
										'Reflect the generated text in the wireframe and insert',
										'unitone'
									);
								}
								return label;
							} )() }
						</Button>
					</div>
				</div>

				<div className="unitone-wireframe-generator-settings__main">
					<div className="unitone-wireframe-generator-preview-switcher">
						<Button
							icon={ <Icon icon={ desktop } /> }
							label={ __( 'Desktop', 'unitone' ) }
							onClick={ () => setPreviewMode( 'desktop' ) }
							isPressed={ 'desktop' === previewMode }
						/>

						<Button
							icon={ <Icon icon={ tablet } /> }
							label={ __( 'Tablet', 'unitone' ) }
							onClick={ () => setPreviewMode( 'tablet' ) }
							isPressed={ 'tablet' === previewMode }
						/>

						<Button
							icon={ <Icon icon={ mobile } /> }
							label={ __( 'Mobile', 'unitone' ) }
							onClick={ () => setPreviewMode( 'mobile' ) }
							isPressed={ 'mobile' === previewMode }
						/>
					</div>

					<div
						className="unitone-wireframe-generator-preview-canvas"
						ref={ canvasRef }
					>
						<div
							className={ `unitone-wireframe-generator-preview unitone-wireframe-generator-preview--${ previewMode }` }
						>
							{ previewPatterns.map( ( pattern, i ) => {
								const newBlocks = [ ...pattern.blocks ].map(
									( block ) => {
										if (
											null ==
											block.attributes?.unitone?.minHeight
										) {
											return block;
										}

										const newMinHeight =
											block.attributes.unitone.minHeight.replace(
												/([\d]+)[sld]?vh/,
												'840px * $1 / 100'
											);
										return {
											...block,
											attributes: {
												...block.attributes,
												unitone: {
													...block.attributes.unitone,
													minHeight: newMinHeight,
												},
											},
										};
									}
								);

								return (
									<BlockPreview.Async key={ i }>
										<BlockPreview
											blocks={ newBlocks }
											viewportWidth={ 1334 }
										/>
									</BlockPreview.Async>
								);
							} ) }
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export const WireframeGeneratorModal = memo( WireframeGeneratorModalPure );
