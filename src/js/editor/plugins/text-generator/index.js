import {
	Button,
	Flex,
	FlexItem,
	Notice,
	PanelBody,
	SelectControl,
	Spinner,
	TextareaControl,
} from '@wordpress/components';

import {
	createInterpolateElement,
	useCallback,
	useMemo,
	useState,
} from '@wordpress/element';

import { useDispatch } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { copy as copyIcon } from '@wordpress/icons';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

import { generateText } from './api/client';
import { ai as icon } from './icons';
import splitParagraphs from './domain/splitParagraphs';

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

	const { createNotice, removeNotice } = useDispatch( 'core/notices' );

	const setupUrl = useMemo( () => {
		const adminBase = window?.ajaxurl
			? window.ajaxurl.replace( /admin-ajax\.php$/, '' )
			: '/wp-admin/';
		return `${ adminBase }themes.php?page=unitone`;
	}, [] );

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

	const showCopyNotice = useCallback( () => {
		const noticeId = `unitone-ai-copy-${ Date.now() }`;

		createNotice( 'success', __( 'Copied.', 'unitone' ), {
			type: 'snackbar',
			id: noticeId,
			isDismissible: true,
		} );

		setTimeout( () => removeNotice( noticeId ), 1000 );
	}, [ createNotice, removeNotice ] );

	return (
		<>
			<PluginSidebarMoreMenuItem target="unitone-text-generator">
				{ __( 'Text Generator', 'unitone' ) }
			</PluginSidebarMoreMenuItem>

			<PluginSidebar
				name="unitone-text-generator"
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
															'1fr auto',
														gap: '1rem',
														alignItems: 'start',
													} }
												>
													<div>{ chunk }</div>

													<Flex
														gap={ 1 }
														align="center"
														justify="start"
													>
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

registerPlugin( 'unitone-text-generator', {
	icon,
	render: AIGenerateSidebar,
} );
