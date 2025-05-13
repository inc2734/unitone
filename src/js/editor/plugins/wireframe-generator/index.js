import { useCallback, createPortal } from '@wordpress/element';

import { createBlock } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

import {
	WireFrameGeneratorButton,
	WireframeGeneratorModal,
} from './components';

import { useWireFrameGenerator } from './hooks';
import { onClickInsertOnly, onClickInsertAndReplace } from './inserter';

const PluginSidebarWireFrameGenerator = () => {
	const {
		isOpen,
		setIsOpen,
		isOpenHelpPopover,
		setIsOpenHelpPopover,
		previewPatterns,
		setPreviewPatterns,
		isGeneratingHomepage,
		setIsGeneratingHomepage,
		isGeneratingLowerLevel,
		setIsGeneratingLowerLevel,
		previewMode,
		setPreviewMode,
		usingChatGPT,
		setUsingChatGPT,
		customPromptPlaceholder,
		customPrompt,
		setCustomPrompt,
		isLoading,
		setIsLoading,
		canvasRef,
		onSelectBlockPattern,
		heroPatterns,
		pageHeaderPatterns,
		queryPatterns,
		faqPatterns,
		ctaPatterns,
		sectionPatterns,
		sectionPatternsForHomepage,
		sectionNoColoredPatterns,
		sectionNoColoredPatternsForHomepage,
		// sectionColoredPatterns,
		sectionColoredPatternsForHomepage,
	} = useWireFrameGenerator();

	const toolbar = document.querySelector( '.editor-header__toolbar' );

	const selectUniqueByCategory = ( patterns, count ) => {
		const allowedDuplicateCategories = [
			'unitone-columns',
			'unitone-banners',
			'unitone-sections',
			'unitone-sections-colored',
		];

		const selected = [];
		const usedCategories = new Set();

		const shuffled = [ ...patterns ].sort( () => 0.5 - Math.random() );

		for ( const pattern of shuffled ) {
			const patternCategories = pattern.categories || [];

			const allowsDuplication = patternCategories.every( ( c ) =>
				allowedDuplicateCategories.includes( c )
			);

			if ( ! allowsDuplication ) {
				const alreadyUsed = patternCategories.some( ( c ) =>
					usedCategories.has( c )
				);
				if ( alreadyUsed ) {
					continue;
				}
			}

			selected.push( pattern );

			if ( ! allowsDuplication ) {
				patternCategories.forEach( ( c ) => usedCategories.add( c ) );
			}

			if ( selected.length >= count ) {
				break;
			}
		}

		return selected;
	};

	/**
	 * Generate for Homepage.
	 */
	const onClickGenerate = useCallback( () => {
		setIsGeneratingHomepage( true );
		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );

		setTimeout( () => {
			const shuffledSectionPatterns = [];

			// At first, display one randomly from Hero Patterns.
			const heroPattern =
				heroPatterns[
					Math.floor( Math.random() * heroPatterns.length )
				];

			// If the hero pattern does not include a query, add the query pattern in a subsequent section.
			if ( ! heroPattern.categories.includes( 'unitone-query' ) ) {
				const queryPattern =
					queryPatterns[
						Math.floor( Math.random() * queryPatterns.length )
					];

				const fallbackSection = queryPattern.categories.includes(
					'unitone-sections-colored'
				)
					? sectionNoColoredPatternsForHomepage[
							Math.floor(
								Math.random() *
									sectionNoColoredPatternsForHomepage.length
							)
					  ]
					: sectionColoredPatternsForHomepage[
							Math.floor(
								Math.random() *
									sectionColoredPatternsForHomepage.length
							)
					  ];

				shuffledSectionPatterns.push(
					...[ queryPattern, fallbackSection ]
				);
			}

			const loopCount = heroPattern.categories.includes( 'unitone-query' )
				? 3
				: 2;

			const sectionCandidates = selectUniqueByCategory(
				sectionPatternsForHomepage,
				loopCount
			);

			for ( let i = 0; i < loopCount; i++ ) {
				shuffledSectionPatterns.push(
					...[
						sectionNoColoredPatternsForHomepage[
							Math.floor(
								Math.random() *
									sectionNoColoredPatternsForHomepage.length
							)
						],
						sectionCandidates[ i ],
					]
				);
			}

			if ( Math.random() < 0.5 ) {
				shuffledSectionPatterns.splice(
					Math.floor(
						Math.random() * shuffledSectionPatterns.length
					),
					-1
				);

				shuffledSectionPatterns.push(
					faqPatterns[
						Math.floor( Math.random() * faqPatterns.length )
					]
				);
			}

			if ( Math.random() < 0.5 ) {
				shuffledSectionPatterns.splice(
					Math.floor(
						Math.random() * shuffledSectionPatterns.length
					),
					-1
				);

				shuffledSectionPatterns.push(
					ctaPatterns[
						Math.floor( Math.random() * ctaPatterns.length )
					]
				);
			}

			setPreviewPatterns(
				[ heroPattern, ...shuffledSectionPatterns ].filter( Boolean )
			);

			setIsGeneratingHomepage( false );
		}, 2000 );
	}, [
		heroPatterns,
		faqPatterns,
		ctaPatterns,
		queryPatterns,
		sectionPatternsForHomepage,
		sectionNoColoredPatternsForHomepage,
		sectionColoredPatternsForHomepage,
	] );

	/**
	 * Generate for lower level pages.
	 */
	const onClickGenerateForLowerLevel = useCallback( () => {
		setIsGeneratingLowerLevel( true );
		setPreviewPatterns( [] );
		setPreviewMode( 'desktop' );

		setTimeout( () => {
			const shuffledSectionPatterns = [];

			// At first, display one randomly from Page Header Patterns.
			const pageHeaderPattern =
				pageHeaderPatterns[
					Math.floor( Math.random() * pageHeaderPatterns.length )
				];

			const loopCount = 3;

			const sectionCandidates = selectUniqueByCategory(
				sectionPatterns,
				loopCount
			);

			for ( let i = 0; i < sectionCandidates.length; i++ ) {
				shuffledSectionPatterns.push(
					...[
						sectionNoColoredPatterns[
							Math.floor(
								Math.random() * sectionNoColoredPatterns.length
							)
						],
						sectionCandidates[ i ],
					]
				);
			}

			if ( Math.random() < 0.5 ) {
				shuffledSectionPatterns.splice(
					Math.floor(
						Math.random() * shuffledSectionPatterns.length
					),
					1
				);

				shuffledSectionPatterns.push(
					ctaPatterns[
						Math.floor( Math.random() * ctaPatterns.length )
					]
				);
			}

			setPreviewPatterns(
				[ pageHeaderPattern, ...shuffledSectionPatterns ].filter(
					Boolean
				)
			);

			setIsGeneratingLowerLevel( false );
		}, 2000 );
	}, [
		pageHeaderPatterns,
		sectionPatterns,
		sectionNoColoredPatterns,
		ctaPatterns,
	] );

	const onClickInsert = useCallback( async () => {
		const cloneBlockWithNewClientId = ( block ) => {
			return createBlock(
				block.name,
				block.attributes,
				block.innerBlocks?.map( cloneBlockWithNewClientId ) || []
			);
		};

		const newBlocks = previewPatterns
			.map( ( pattern ) =>
				pattern.blocks.map( cloneBlockWithNewClientId )
			)
			.flat();

		const allBlocks = [ ...newBlocks ];

		if ( ! usingChatGPT ) {
			onClickInsertOnly( {
				blocks: allBlocks,
				onSelectBlockPattern,
				setIsOpen,
			} );
		} else {
			onClickInsertAndReplace( {
				blocks: allBlocks,
				previewPatterns,
				setIsLoading,
				onSelectBlockPattern,
				setIsOpen,
				customPromptPlaceholder,
				customPrompt,
			} );
		}
	}, [ previewPatterns, onSelectBlockPattern, customPrompt ] );

	return (
		<>
			{ toolbar &&
				createPortal(
					<WireFrameGeneratorButton { ...{ isOpen, setIsOpen } } />,
					toolbar
				) }

			{ isOpen && (
				<WireframeGeneratorModal
					{ ...{
						isOpenHelpPopover,
						setIsOpen,
						setIsOpenHelpPopover,
						isGeneratingHomepage,
						isGeneratingLowerLevel,
						isLoading,
						previewPatterns,
						setPreviewPatterns,
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
					} }
				/>
			) }
		</>
	);
};

registerPlugin( 'unitone-wireframe-generator', {
	render: PluginSidebarWireFrameGenerator,
} );
