import {
	Button,
	Flex,
	FlexItem,
	Notice,
	PanelBody,
	Popover,
	SelectControl,
	Spinner,
	TextareaControl,
} from '@wordpress/components';

import {
	createInterpolateElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from '@wordpress/element';

import { store as blockEditorStore } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { copy as copyIcon, plusCircle } from '@wordpress/icons';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

import { canInsertToRichText } from './domain/richTextFocus';

import {
	insertRichText,
	isRichTextData,
	isRichTextValue,
} from './domain/insertRichText';

import { generateText } from './api/client';
import { subscribeLastRichTextTarget } from './domain/lastRichTextTarget';
import { insertParagraphBlocks } from './domain/insertBlocks';
import { ai as icon } from './icons';

import splitParagraphs from './domain/splitParagraphs';

const RESULTS_EXPIRY_MS = 60000;

const resolveRichTextAttributeKey = ( block ) => {
	if ( ! block ) {
		return null;
	}

	const blockType = getBlockType( block.name );
	if ( ! blockType?.attributes ) {
		return null;
	}

	const richTextKeys = Object.entries( blockType.attributes ).filter(
		( [ , attribute ] ) => attribute?.source === 'rich-text'
	);

	if ( richTextKeys.length !== 1 ) {
		return null;
	}

	return richTextKeys[ 0 ][ 0 ];
};

const copyTextToClipboard = async ( text ) => {
	if ( window.navigator.clipboard?.writeText ) {
		await window.navigator.clipboard.writeText( text );
		return;
	}

	const textarea = document.createElement( 'textarea' );
	textarea.value = text;
	textarea.setAttribute( 'readonly', '' );
	textarea.style.position = 'absolute';
	textarea.style.left = '-9999px';
	document.body.appendChild( textarea );
	textarea.select();
	document.execCommand( 'copy' );
	document.body.removeChild( textarea );
};

const AIGenerateSidebar = () => {
	const [ prompt, setPrompt ] = useState( '' );
	const [ tone, setTone ] = useState( 'default' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ results, setResults ] = useState( [] );
	const [ activePopover, setActivePopover ] = useState( null );
	const [ canInsertToRichTextState, setCanInsertToRichTextState ] =
		useState( false );
	const [ lastRichTextTarget, setLastRichTextTarget ] = useState( null );

	const setupUrl = useMemo( () => {
		const adminBase = window?.ajaxurl
			? window.ajaxurl.replace( /admin-ajax\.php$/, '' )
			: '/wp-admin/';
		return `${ adminBase }themes.php?page=unitone`;
	}, [] );

	const selectedClientId = useSelect( ( select ) => {
		return select( blockEditorStore ).getSelectedBlockClientId();
	}, [] );

	const selectionStart = useSelect( ( select ) => {
		return select( blockEditorStore ).getSelectionStart?.();
	}, [] );

	const selectedBlock = useSelect(
		( select ) => {
			if ( ! selectedClientId ) {
				return null;
			}

			return select( blockEditorStore ).getBlock( selectedClientId );
		},
		[ selectedClientId ]
	);

	const {
		getBlock,
		getBlockIndex,
		getBlockRootClientId,
		getBlocks,
		canInsertBlockType,
		getDefaultBlockName,
		getSettings,
	} = useSelect( ( select ) => select( blockEditorStore ), [] );

	const { insertBlocks, removeBlocks, updateBlockAttributes } =
		useDispatch( blockEditorStore );
	const { createNotice, removeNotice } = useDispatch( 'core/notices' );

	const resolveEditorDocument = useCallback( () => {
		const settingsDocument =
			getSettings?.().__experimentalBlockEditorDocument;
		if ( settingsDocument ) {
			return settingsDocument;
		}

		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe?.contentDocument ) {
			return iframe.contentDocument;
		}

		return document;
	}, [ getSettings ] );

	const updateCanInsertToRichText = useCallback( () => {
		const hasSelectionStart =
			!! selectionStart?.clientId && !! selectionStart?.attributeKey;
		const editorDocument = resolveEditorDocument();

		setCanInsertToRichTextState(
			hasSelectionStart ||
				canInsertToRichText( selectedClientId, editorDocument )
		);
	}, [
		selectedClientId,
		selectionStart,
		selectedBlock,
		resolveEditorDocument,
	] );

	useEffect( () => {
		updateCanInsertToRichText();
	}, [ updateCanInsertToRichText ] );

	useEffect( () => {
		return subscribeLastRichTextTarget( setLastRichTextTarget, {
			getEditorDocument: resolveEditorDocument,
		} );
	}, [ resolveEditorDocument ] );

	useEffect( () => {
		const handleSelectionChange = () => updateCanInsertToRichText();
		const documents = new Set( [ document, resolveEditorDocument() ] );

		documents.forEach( ( editorDocument ) => {
			editorDocument.addEventListener(
				'selectionchange',
				handleSelectionChange
			);
			editorDocument.addEventListener( 'focusin', handleSelectionChange );
			editorDocument.addEventListener(
				'focusout',
				handleSelectionChange
			);
		} );

		return () => {
			documents.forEach( ( editorDocument ) => {
				editorDocument.removeEventListener(
					'selectionchange',
					handleSelectionChange
				);
				editorDocument.removeEventListener(
					'focusin',
					handleSelectionChange
				);
				editorDocument.removeEventListener(
					'focusout',
					handleSelectionChange
				);
			} );
		};
	}, [ resolveEditorDocument, updateCanInsertToRichText ] );

	useEffect( () => {
		if ( ! selectionStart?.clientId || ! selectionStart?.attributeKey ) {
			return;
		}

		setLastRichTextTarget( {
			clientId: selectionStart.clientId,
			attributeKey: selectionStart.attributeKey,
			timestamp: Date.now(),
		} );
	}, [ selectionStart ] );

	useEffect( () => {
		if ( ! lastRichTextTarget ) {
			return undefined;
		}

		const elapsed = Date.now() - lastRichTextTarget.timestamp;
		const remaining = RESULTS_EXPIRY_MS - elapsed;
		if ( remaining <= 0 ) {
			setLastRichTextTarget( null );
			return undefined;
		}

		const timeoutId = setTimeout( () => {
			setLastRichTextTarget( null );
		}, remaining );

		return () => clearTimeout( timeoutId );
	}, [ lastRichTextTarget ] );

	const canUseLastRichTextTarget = useMemo( () => {
		if ( ! lastRichTextTarget ) {
			return false;
		}

		return Date.now() - lastRichTextTarget.timestamp <= RESULTS_EXPIRY_MS;
	}, [ lastRichTextTarget ] );

	useEffect( () => {
		if ( ! canInsertToRichTextState ) {
			return;
		}

		if ( canUseLastRichTextTarget ) {
			return;
		}

		if ( ! selectedBlock || ! selectedClientId ) {
			return;
		}

		const attributeKey = resolveRichTextAttributeKey( selectedBlock );
		if ( ! attributeKey ) {
			return;
		}

		const value = selectedBlock.attributes?.[ attributeKey ];
		if (
			'string' !== typeof value &&
			! isRichTextValue( value ) &&
			! isRichTextData( value )
		) {
			return;
		}

		setLastRichTextTarget( {
			clientId: selectedClientId,
			attributeKey,
			timestamp: Date.now(),
		} );
	}, [
		canInsertToRichTextState,
		canUseLastRichTextTarget,
		selectedBlock,
		selectedClientId,
	] );

	const selectionTarget =
		selectionStart?.clientId && selectionStart?.attributeKey
			? selectionStart
			: null;
	const effectiveRichTextTarget = selectionTarget || lastRichTextTarget;
	const canInsertBlocks =
		!! selectedClientId || !! selectionTarget || canInsertToRichTextState;

	const lastTargetBlock = effectiveRichTextTarget
		? getBlock( effectiveRichTextTarget.clientId )
		: null;
	const lastTargetValue =
		lastTargetBlock?.attributes?.[ effectiveRichTextTarget?.attributeKey ];

	const canInsertRichText =
		( canInsertToRichTextState || !! selectionTarget ) &&
		!! lastTargetBlock &&
		( 'string' === typeof lastTargetValue ||
			isRichTextValue( lastTargetValue ) ||
			isRichTextData( lastTargetValue ) );

	const onClickGenerate = async () => {
		const trimmedPrompt = prompt.trim();
		if ( ! trimmedPrompt ) {
			setError( __( 'Please enter a prompt.', 'unitone' ) );
			return;
		}

		const extraLines = [];

		if ( tone && 'default' !== tone ) {
			extraLines.push( `Tone: ${ tone }` );
		}

		const combinedPrompt = extraLines.length
			? `${ trimmedPrompt }\n\nAdditional instructions:\n${ extraLines
					.map( ( line ) => `- ${ line }` )
					.join( '\n' ) }`
			: trimmedPrompt;

		setIsLoading( true );
		setError( null );

		try {
			const response = await generateText( {
				prompt: combinedPrompt,
			} );
			setResults( response?.results ?? [] );
		} catch ( fetchError ) {
			const errorMessage =
				fetchError?.data?.message ||
				fetchError?.message ||
				__( 'Failed to generate. Please try again.', 'unitone' );
			setError( errorMessage );
		}

		setIsLoading( false );
	};

	const onInsertRichText = ( text ) => {
		if ( ! effectiveRichTextTarget ) {
			return;
		}

		insertRichText( {
			text,
			lastRichTextTarget: effectiveRichTextTarget,
			getBlock,
			updateBlockAttributes,
		} );
	};

	const onInsertBlocks = ( text, options = {} ) => {
		const { allowInlineInsert = true } = options;
		const shouldUseRichTextTarget =
			canInsertToRichTextState || !! selectionTarget;

		const targetClientId = shouldUseRichTextTarget
			? effectiveRichTextTarget?.clientId
			: selectedClientId;

		const targetBlock = targetClientId ? getBlock( targetClientId ) : null;

		if (
			allowInlineInsert &&
			shouldUseRichTextTarget &&
			targetBlock?.name === 'core/paragraph'
		) {
			const targetValue =
				targetBlock.attributes?.[
					effectiveRichTextTarget?.attributeKey
				];
			const isEmptyString =
				'string' === typeof targetValue &&
				targetValue.trim().length === 0;
			const isEmptyRichText =
				( isRichTextValue( targetValue ) ||
					isRichTextData( targetValue ) ) &&
				targetValue.text.length === 0;

			if ( isEmptyString || isEmptyRichText ) {
				onInsertRichText( text );
				return;
			}
		}

		insertParagraphBlocks( {
			text,
			selectedBlock: targetBlock,
			selectedClientId: targetClientId,
			canInsertBlockType,
			getDefaultBlockName,
			getBlockIndex,
			getBlockRootClientId,
			getBlocks,
			insertBlocks,
			removeBlocks,
		} );
	};

	const togglePopover = ( id, anchor ) => {
		if ( activePopover?.id === id ) {
			closePopover();
			return;
		}

		setActivePopover( { id, anchor } );
	};

	const closePopover = () => setActivePopover( null );
	const showCopyNotice = useCallback( () => {
		const noticeId = `unitone-ai-copy-${ Date.now() }`;

		createNotice( 'success', __( 'Copied.', 'unitone' ), {
			type: 'snackbar',
			id: noticeId,
			isDismissible: true,
		} );

		setTimeout( () => removeNotice( noticeId ), 1000 );
	}, [ createNotice, removeNotice ] );

	useEffect( () => {
		if ( ! activePopover?.anchor ) {
			return undefined;
		}

		const handleMouseDown = ( event ) => {
			const target = event.target;
			if ( ! target ) {
				return;
			}

			if ( activePopover.anchor.contains( target ) ) {
				return;
			}

			const popoverNode = document.querySelector(
				'.unitone-ai-text-insert-popover'
			);
			if ( popoverNode?.contains( target ) ) {
				return;
			}

			closePopover();
		};

		document.addEventListener( 'mousedown', handleMouseDown );

		return () =>
			document.removeEventListener( 'mousedown', handleMouseDown );
	}, [ activePopover ] );

	return (
		<>
			<PluginSidebarMoreMenuItem target="unitone-ai-text-insert">
				{ __( 'Text Generator', 'unitone' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="unitone-ai-text-insert"
				title={ __( 'Text Generator', 'unitone' ) }
			>
				<PanelBody>
					<div style={ { display: 'grid', gap: '1rem' } }>
						<div>
							{ createInterpolateElement(
								__(
									'To use this feature, you must set an OpenAI API key. Configure it from the <link>unitone setup screen</link>.',
									'unitone'
								),
								{
									link: (
										<a
											href={ setupUrl }
											target="_blank"
											rel="noopener noreferrer"
											aria-label={ __(
												'unitone setup screen',
												'unitone'
											) }
										/>
									),
								}
							) }
						</div>

						<TextareaControl
							__nextHasNoMarginBottom
							label={ __( 'Prompt', 'unitone' ) }
							placeholder={ __(
								'Example: Generate customer testimonials for a web design agency.',
								'unitone'
							) }
							value={ prompt }
							onChange={ setPrompt }
							rows={ 6 }
						/>

						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Tone (optional)', 'unitone' ) }
							value={ tone }
							onChange={ setTone }
							options={ [
								{
									label: __( 'Default', 'unitone' ),
									value: 'default',
								},
								{
									label: __( 'Polite', 'unitone' ),
									value: 'polite',
								},
								{
									label: __( 'Casual', 'unitone' ),
									value: 'casual',
								},
								{
									label: __( 'Formal', 'unitone' ),
									value: 'formal',
								},
								{
									label: __( 'Friendly', 'unitone' ),
									value: 'friendly',
								},
								{
									label: __( 'Logical', 'unitone' ),
									value: 'logical',
								},
								{
									label: __( 'High energy', 'unitone' ),
									value: 'high-energy',
								},
							] }
						/>

						<div>
							<Button
								variant="primary"
								onClick={ onClickGenerate }
								disabled={ isLoading }
							>
								{ __( 'Generate', 'unitone' ) }
							</Button>
						</div>

						{ isLoading && <Spinner /> }

						{ error && (
							<Notice status="error" isDismissible={ false }>
								{ error }
							</Notice>
						) }
					</div>
				</PanelBody>

				{ results.length > 0 && (
					<PanelBody title={ __( 'Results', 'unitone' ) }>
						<div style={ { display: 'grid', gap: '1rem' } }>
							{ results.map( ( result ) => {
								const paragraphs = splitParagraphs(
									result.text
								);
								const chunks =
									paragraphs.length > 0
										? paragraphs
										: [ result.text ];

								return (
									<div
										key={ result.id }
										style={ {
											display: 'grid',
											gap: '1rem',
										} }
									>
										{ chunks.map( ( chunk, index ) => {
											const chunkId = `${ result.id }-${ index }`;

											return (
												<div
													key={ chunkId }
													style={ {
														display: 'grid',
														gridTemplateColumns:
															'1fr 40px',
														alignItems: 'center',
													} }
												>
													<div
														style={ {
															marginBottom:
																'.5rem',
														} }
													>
														{ chunk }
													</div>

													<Flex
														gap={ 1 }
														align="center"
														justify="start"
													>
														<FlexItem>
															<Button
																icon={
																	plusCircle
																}
																size="small"
																iconSize={ 18 }
																label={ __(
																	'Insert',
																	'unitone'
																) }
																onClick={ (
																	event
																) =>
																	togglePopover(
																		chunkId,
																		event.currentTarget
																	)
																}
															/>
														</FlexItem>

														<FlexItem>
															<Button
																icon={
																	copyIcon
																}
																size="small"
																iconSize={ 18 }
																label={ __(
																	'Copy',
																	'unitone'
																) }
																onClick={ async (
																	event
																) => {
																	event.preventDefault();
																	await copyTextToClipboard(
																		chunk
																	);
																	showCopyNotice();
																} }
															/>
														</FlexItem>
													</Flex>

													{ activePopover?.id ===
														chunkId &&
														activePopover?.anchor && (
															<Popover
																className="unitone-ai-text-insert-popover"
																anchor={
																	activePopover.anchor
																}
																placement="bottom-start"
																offset={ 8 }
																onClose={
																	closePopover
																}
															>
																<div
																	style={ {
																		display:
																			'flex',
																		flexDirection:
																			'column',
																		gap: '1rem',
																		padding:
																			'1rem',
																	} }
																>
																	<Button
																		variant="secondary"
																		disabled={
																			! canInsertRichText
																		}
																		onMouseDown={ (
																			event
																		) => {
																			event.preventDefault();
																			onInsertRichText(
																				chunk
																			);
																			closePopover();
																		} }
																	>
																		{ __(
																			'Insert at cursor',
																			'unitone'
																		) }
																	</Button>

																	<Button
																		variant="secondary"
																		disabled={
																			! canInsertBlocks
																		}
																		onClick={ () => {
																			if (
																				! canInsertBlocks
																			) {
																				return;
																			}
																			onInsertBlocks(
																				chunk
																			);
																			closePopover();
																		} }
																	>
																		{ __(
																			'Insert as paragraph',
																			'unitone'
																		) }
																	</Button>
																</div>
															</Popover>
														) }
												</div>
											);
										} ) }
									</div>
								);
							} ) }
							{ ( () => {
								const allChunks = results.flatMap(
									( result ) => {
										const paragraphs = splitParagraphs(
											result.text
										);
										return paragraphs.length > 0
											? paragraphs
											: [ result.text ];
									}
								);
								const allText = allChunks.join( '\n\n' );
								const hasMultipleParagraphs =
									allChunks.length > 1;

								return (
									<div>
										<Flex
											gap={ 1 }
											align="center"
											justify="start"
										>
											<FlexItem>
												<Button
													variant="secondary"
													onClick={ ( event ) =>
														togglePopover(
															'all',
															event.currentTarget
														)
													}
												>
													{ __(
														'Insert all',
														'unitone'
													) }
												</Button>
											</FlexItem>

											<FlexItem>
												<Button
													variant="tertiary"
													onClick={ async (
														event
													) => {
														event.preventDefault();
														await copyTextToClipboard(
															allText
														);
														showCopyNotice();
													} }
												>
													{ __(
														'Copy all',
														'unitone'
													) }
												</Button>
											</FlexItem>
										</Flex>

										{ activePopover?.id === 'all' &&
											activePopover?.anchor && (
												<Popover
													className="unitone-ai-text-insert-popover"
													anchor={
														activePopover.anchor
													}
													placement="bottom-start"
													offset={ 8 }
													onClose={ closePopover }
												>
													<div
														style={ {
															display: 'flex',
															flexDirection:
																'column',
															gap: '1rem',
															padding: '1rem',
														} }
													>
														<Button
															variant="secondary"
															disabled={
																! canInsertRichText
															}
															onMouseDown={ (
																event
															) => {
																event.preventDefault();
																if (
																	hasMultipleParagraphs &&
																	canInsertBlocks
																) {
																	onInsertBlocks(
																		allText,
																		{
																			allowInlineInsert: false,
																		}
																	);
																} else {
																	onInsertRichText(
																		allText
																	);
																}
																closePopover();
															} }
														>
															{ __(
																'Insert at cursor',
																'unitone'
															) }
														</Button>
														<Button
															variant="secondary"
															disabled={
																! canInsertBlocks
															}
															onClick={ () => {
																if (
																	! canInsertBlocks
																) {
																	return;
																}
																onInsertBlocks(
																	allText,
																	{
																		allowInlineInsert: false,
																	}
																);
																closePopover();
															} }
														>
															{ __(
																'Insert as paragraph',
																'unitone'
															) }
														</Button>
													</div>
												</Popover>
											) }
									</div>
								);
							} )() }
						</div>
					</PanelBody>
				) }
			</PluginSidebar>
		</>
	);
};

registerPlugin( 'unitone-ai-text-insert', {
	icon,
	render: AIGenerateSidebar,
} );
