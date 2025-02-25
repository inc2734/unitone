import {
	BlockPreview,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	useCallback,
	useRef,
	useEffect,
	useMemo,
	useState,
	createPortal,
} from '@wordpress/element';

import { registerPlugin } from '@wordpress/plugins';
import { Button, Modal } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { Icon, bellUnread, desktop, tablet, mobile } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import usePatternsState from '../../../../blocks/pattern-inserter/inserter/hooks/use-patterns-state';

const PluginSidebarExample = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ previewPatterns, setPreviewPatterns ] = useState( [] );
	const [ previewMode, setPreviewMode ] = useState( 'desktop' );

	const canvasRef = useRef( null );

	useEffect( () => {
		if ( canvasRef.current !== null ) {
			canvasRef.current.scrollTop = 0;
		}
	}, [ previewPatterns ] );

	const WireFrameGeneratorButton = () => (
		<Button onClick={ () => setIsOpen( ! isOpen ) }>
			<Icon icon={ bellUnread } />
		</Button>
	);

	const toolbar = document.querySelector( '.editor-header__toolbar' );

	const { destinationRootClientId } = useSelect( ( select ) => {
		const { getSelectedBlockClientId, getBlockRootClientId } =
			select( blockEditorStore );
		const selectedBlockClientId = getSelectedBlockClientId();
		return selectedBlockClientId
			? getBlockRootClientId( selectedBlockClientId )
			: 0;
	} );

	const [ allPatterns ] = usePatternsState(
		() => {},
		destinationRootClientId
	);

	const { insertBlocks } = useDispatch( blockEditorStore );

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
				! pattern.categories.includes( 'unitone-cta' ) &&
				pattern.categories.includes( 'unitone-sections' )
		);
	}, [ shownPatterns ] );

	const sectionNoColoredPatterns = useMemo( () => {
		return shownPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-query' ) &&
				! pattern.categories.includes( 'unitone-cta' ) &&
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

		const heroPattern =
			heroPatterns[ Math.floor( Math.random() * heroPatterns.length ) ];

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
			? 3
			: 2;

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

		setPreviewPatterns( [
			...[ heroPattern ],
			...shuffledSectionPatterns.flat().slice( 0, -1 ),
			...[
				ctaPatterns[ Math.floor( Math.random() * ctaPatterns.length ) ],
			],
		] );
	}, [ sectionPatterns, sectionColoredPatterns, queryPatterns ] );

	const onClickInsert = useCallback( () => {
		insertBlocks(
			previewPatterns.map( ( pattern ) => pattern.blocks ).flat()
		);

		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );
		setIsOpen( false );
	}, [ previewPatterns ] );

	return (
		<>
			{ toolbar && createPortal( <WireFrameGeneratorButton />, toolbar ) }

			{ isOpen && (
				<Modal
					title={ __( 'Wireframe Generator', 'unitone' ) }
					onRequestClose={ () => {
						setPreviewPatterns( [] );
						setPreviewMode( 'desktop' );
						setIsOpen( false );
					} }
					isFullScreen
					className="unitone-wireframe-generator-modal"
				>
					<div>
						<Button variant="primary" onClick={ onClickGenerate }>
							{ __( 'Generate wireframe', 'unitone' ) }
						</Button>
					</div>

					{ Array.isArray( previewPatterns ) &&
						previewPatterns.length > 0 && (
							<>
								<div
									style={ {
										display: 'flex',
										justifyContent: 'center',
										gap: 'var(--unitone--s-2)',
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
											( pattern, i ) => (
												<BlockPreview
													key={ i }
													blocks={ pattern.blocks }
													viewportWidth={ 1334 }
													additionalStyles={
														pattern.content.match(
															/"minHeight":"min\([\d]+?[sdl]?vh/
														)
															? [
																	{
																		css: 'body { aspect-ratio: 16 / 9; }',
																	},
															  ]
															: undefined
													}
												/>
											)
										) }
									</div>
								</div>

								<div
									style={ {
										marginTop: 'var(--unitone--s-2)',
										display: 'flex',
										justifyContent: 'end',
									} }
								>
									<Button
										variant="primary"
										onClick={ onClickInsert }
									>
										{ __( 'Insert wireframe', 'unitone' ) }
									</Button>
								</div>
							</>
						) }
				</Modal>
			) }
		</>
	);
};

registerPlugin( 'unitone-wireframe-generator', {
	render: PluginSidebarExample,
} );
