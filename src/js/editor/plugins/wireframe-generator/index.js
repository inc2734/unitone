import {
	useCallback,
	useRef,
	useEffect,
	useMemo,
	useState,
	createPortal,
} from '@wordpress/element';

import { BlockPreview } from '@wordpress/block-editor';
import { registerPlugin } from '@wordpress/plugins';
import { Button, Modal, Popover } from '@wordpress/components';
import { Icon, desktop, tablet, mobile, help } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import icon from './icon';
import usePatternsState from '../../../../blocks/pattern-inserter/inserter/hooks/use-patterns-state';
import useInsertionPoint from '../../../../blocks/pattern-inserter/inserter/hooks/use-insertion-point';

const PluginSidebarWireFrameGenerator = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isOpenHelpPopover, setIsOpenHelpPopover ] = useState( false );
	const [ previewPatterns, setPreviewPatterns ] = useState( [] );
	const [ previewMode, setPreviewMode ] = useState( 'desktop' );

	const canvasRef = useRef( null );

	useEffect( () => {
		if ( canvasRef.current !== null ) {
			canvasRef.current.scrollTop = 0;
		}
	}, [ previewPatterns, previewMode ] );

	const WireFrameGeneratorButton = () => (
		<Button
			label={ __( 'Wireframe Generator', 'unitone' ) }
			onClick={ () => setIsOpen( ! isOpen ) }
		>
			<Icon icon={ icon } />
		</Button>
	);

	const toolbar = document.querySelector( '.editor-header__toolbar' );

	const [ destinationRootClientId, onInsertBlocks ] = useInsertionPoint( {
		shouldFocusBlock: true,
	} );

	const [ allPatterns, , onSelectBlockPattern ] = usePatternsState(
		onInsertBlocks,
		destinationRootClientId
	);

	const shownPatterns = useMemo( () => {
		return allPatterns.filter(
			( pattern ) =>
				pattern.name.startsWith( 'unitone-' ) &&
				pattern.categories.every(
					( category ) => ! category.startsWith( 'unitone-pages' )
				)
		);
	}, [ allPatterns ] );

	const heroPatterns = useMemo( () => {
		return shownPatterns.filter( ( pattern ) =>
			pattern.categories.includes( 'unitone-heros' )
		);
	}, [ shownPatterns ] );

	const pageHeaderPatterns = useMemo( () => {
		return shownPatterns.filter( ( pattern ) =>
			pattern.categories.includes( 'unitone-page-headers' )
		);
	}, [ shownPatterns ] );

	const queryPatterns = useMemo( () => {
		return shownPatterns.filter(
			( pattern ) =>
				pattern.categories.includes( 'unitone-query' ) &&
				pattern.categories.includes( 'unitone-sections' )
		);
	}, [ shownPatterns ] );

	const ctaPatterns = useMemo( () => {
		return shownPatterns.filter( ( pattern ) =>
			pattern.categories.includes( 'unitone-cta' )
		);
	}, [ shownPatterns ] );

	const sectionPatterns = useMemo( () => {
		return shownPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-query' ) &&
				pattern.categories.includes( 'unitone-sections' )
		);
	}, [ shownPatterns ] );

	const sectionNoColoredPatterns = useMemo( () => {
		return shownPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-query' ) &&
				! pattern.categories.includes( 'unitone-sections-colored' ) &&
				pattern.categories.includes( 'unitone-sections' )
		);
	}, [ shownPatterns ] );

	const sectionColoredPatterns = useMemo( () => {
		return shownPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-query' ) &&
				! pattern.categories.includes( 'unitone-cta' ) &&
				pattern.categories.includes( 'unitone-sections-colored' )
		);
	}, [ shownPatterns ] );

	const onClickGenerate = useCallback( () => {
		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );

		const shuffledSectionPatterns = [];

		// At first, display one randomly from Hero Patterns.
		const heroPattern =
			heroPatterns[ Math.floor( Math.random() * heroPatterns.length ) ];

		// If the hero pattern does not include a query, add the query pattern in a subsequent section.
		if ( ! heroPattern.categories.includes( 'unitone-query' ) ) {
			const queryPattern =
				queryPatterns[
					Math.floor( Math.random() * queryPatterns.length )
				];

			shuffledSectionPatterns.push( [
				queryPattern,
				queryPattern.categories.includes( 'unitone-sections-colored' )
					? sectionNoColoredPatterns[
							Math.floor(
								Math.random() * sectionNoColoredPatterns.length
							)
					  ]
					: sectionColoredPatterns[
							Math.floor(
								Math.random() * sectionColoredPatterns.length
							)
					  ],
			] );
		}

		const loopCount = heroPattern.categories.includes( 'unitone-query' )
			? 4
			: 3;

		for ( let i = 0; i < loopCount; i++ ) {
			shuffledSectionPatterns.push( [
				sectionNoColoredPatterns[
					Math.floor(
						Math.random() * sectionNoColoredPatterns.length
					)
				],
				sectionPatterns[
					Math.floor( Math.random() * sectionPatterns.length )
				],
			] );
		}

		// Finally, choose one randomly from ctaPatterns or shuffledSectionPatterns.
		const lastPattern =
			Math.random() < 0.5
				? ctaPatterns[
						Math.floor( Math.random() * ctaPatterns.length )
				  ]
				: shuffledSectionPatterns.flat()[
						Math.floor(
							Math.random() *
								shuffledSectionPatterns.flat().length
						)
				  ];

		setPreviewPatterns(
			[
				...[ heroPattern ],
				...shuffledSectionPatterns.flat().slice( 0, -1 ),
				...[ lastPattern ],
			].filter( Boolean )
		);
	}, [
		heroPatterns,
		sectionPatterns,
		sectionColoredPatterns,
		queryPatterns,
	] );

	const onClickGenerateForLowerLevel = useCallback( () => {
		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );

		const shuffledSectionPatterns = [];

		// At first, display one randomly from Page Header Patterns.
		const pageHeaderPattern =
			pageHeaderPatterns[
				Math.floor( Math.random() * pageHeaderPatterns.length )
			];

		const loopCount = 3;

		for ( let i = 0; i < loopCount; i++ ) {
			shuffledSectionPatterns.push( [
				sectionNoColoredPatterns[
					Math.floor(
						Math.random() * sectionNoColoredPatterns.length
					)
				],
				sectionPatterns[
					Math.floor( Math.random() * sectionPatterns.length )
				],
			] );
		}

		// Finally, choose one randomly from ctaPatterns or shuffledSectionPatterns.
		const lastPattern =
			Math.random() < 0.5
				? ctaPatterns[
						Math.floor( Math.random() * ctaPatterns.length )
				  ]
				: shuffledSectionPatterns.flat()[
						Math.floor(
							Math.random() *
								shuffledSectionPatterns.flat().length
						)
				  ];

		setPreviewPatterns(
			[
				...[ pageHeaderPattern ],
				...shuffledSectionPatterns.flat().slice( 0, -1 ),
				...[ lastPattern ],
			].filter( Boolean )
		);
	}, [ pageHeaderPatterns, sectionPatterns, sectionColoredPatterns ] );

	const cloneBlockWithNewClientId = ( block ) => {
		return wp.blocks.createBlock(
			block.name,
			block.attributes,
			block.innerBlocks?.map( cloneBlockWithNewClientId ) || []
		);
	};

	const onClickInsert = useCallback( () => {
		const newBlocks = previewPatterns
			.map( ( pattern ) =>
				pattern.blocks.map( cloneBlockWithNewClientId )
			)
			.flat();

		const newPattern = {
			title: __( 'Wireframe', 'unitone' ),
			blocks: newBlocks,
		};

		onSelectBlockPattern( newPattern, newBlocks );

		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );
		setIsOpen( false );
		setIsOpenHelpPopover( false );
	}, [ previewPatterns ] );

	return (
		<>
			{ toolbar && createPortal( <WireFrameGeneratorButton />, toolbar ) }

			{ isOpen && (
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
										onClose={ () =>
											setIsOpenHelpPopover( false )
										}
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
						setPreviewPatterns( [] );
						setPreviewMode( 'desktop' );
						setIsOpen( false );
						setIsOpenHelpPopover( false );
					} }
					isFullScreen
					className="unitone-wireframe-generator-modal"
				>
					<div
						style={ {
							display: 'flex',
							gap: 'var(--unitone--s-1)',
						} }
					>
						<Button variant="secondary" onClick={ onClickGenerate }>
							{ __( 'Generate for homepage', 'unitone' ) }
						</Button>

						<Button
							variant="secondary"
							onClick={ onClickGenerateForLowerLevel }
						>
							{ __(
								'Generate for lower-level pages',
								'unitone'
							) }
						</Button>

						{ Array.isArray( previewPatterns ) &&
							previewPatterns.length > 0 && (
								<Button
									variant="primary"
									onClick={ onClickInsert }
								>
									{ __( 'Insert wireframe', 'unitone' ) }
								</Button>
							) }
					</div>

					{ Array.isArray( previewPatterns ) &&
						previewPatterns.length > 0 && (
							<>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'center',
										gap: 'var(--unitone--s-2)',
										marginTop: 'var(--unitone--s-2)',
										marginBottom: 'var(--unitone--s-2)',
									} }
								>
									<Button
										icon={ <Icon icon={ desktop } /> }
										label={ __( 'Desktop', 'unitone' ) }
										onClick={ () =>
											setPreviewMode( 'desktop' )
										}
										isPressed={ 'desktop' === previewMode }
									/>

									<Button
										icon={ <Icon icon={ tablet } /> }
										label={ __( 'Tablet', 'unitone' ) }
										onClick={ () =>
											setPreviewMode( 'tablet' )
										}
										isPressed={ 'tablet' === previewMode }
									/>

									<Button
										icon={ <Icon icon={ mobile } /> }
										label={ __( 'Mobile', 'unitone' ) }
										onClick={ () =>
											setPreviewMode( 'mobile' )
										}
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
										{ previewPatterns.map(
											( pattern, i ) => {
												const newBlocks = [
													...pattern.blocks,
												].map( ( block ) => {
													if (
														null ==
														block.attributes
															?.unitone?.minHeight
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
																...block
																	.attributes
																	.unitone,
																minHeight:
																	newMinHeight,
															},
														},
													};
												} );

												return (
													<BlockPreview.Async
														key={ i }
													>
														<BlockPreview
															blocks={ newBlocks }
															viewportWidth={
																1334
															}
														/>
													</BlockPreview.Async>
												);
											}
										) }
									</div>
								</div>
							</>
						) }
				</Modal>
			) }
		</>
	);
};

registerPlugin( 'unitone-wireframe-generator', {
	render: PluginSidebarWireFrameGenerator,
} );
