import { useRef, useEffect, useMemo, useState } from '@wordpress/element';

import usePatternsState from '../../../../../blocks/pattern-inserter/inserter/hooks/use-patterns-state';
import useInsertionPoint from '../../../../../blocks/pattern-inserter/inserter/hooks/use-insertion-point';

export const useWireFrameGenerator = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isOpenHelpPopover, setIsOpenHelpPopover ] = useState( false );
	const [ previewPatterns, setPreviewPatterns ] = useState( [] );
	const [ isGeneratingHomepage, setIsGeneratingHomepage ] = useState( false );
	const [ isGeneratingLowerLevel, setIsGeneratingLowerLevel ] =
		useState( false );
	const [ previewMode, setPreviewMode ] = useState( 'desktop' );
	const [ usingChatGPT, setUsingChatGPT ] = useState( false );
	const [ customPromptPlaceholder ] = useState(
		'トップページを想定。職種は web 制作会社。会社の所在地は東京都渋谷区。キャッチコピーは「課題解決のその先に、体験価値を。」'
	);
	const [ customPrompt, setCustomPrompt ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );

	const canvasRef = useRef( null );

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

	const faqPatterns = useMemo( () => {
		return shownPatterns.filter( ( pattern ) =>
			pattern.categories.includes( 'unitone-faq' )
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
				! pattern.categories.includes( 'unitone-faq' ) &&
				! pattern.categories.includes( 'unitone-cta' ) &&
				pattern.categories.includes( 'unitone-sections' )
		);
	}, [ shownPatterns ] );

	const sectionPatternsForHomepage = useMemo( () => {
		return sectionPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-for-lower-level-pages' )
		);
	}, [ sectionPatterns ] );

	const sectionNoColoredPatterns = useMemo( () => {
		return sectionPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-sections-colored' )
		);
	}, [ sectionPatterns ] );

	const sectionNoColoredPatternsForHomepage = useMemo( () => {
		return sectionNoColoredPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-for-lower-level-pages' )
		);
	}, [ sectionNoColoredPatterns ] );

	const sectionColoredPatterns = useMemo( () => {
		return sectionPatterns.filter( ( pattern ) =>
			pattern.categories.includes( 'unitone-sections-colored' )
		);
	}, [ sectionPatterns ] );

	const sectionColoredPatternsForHomepage = useMemo( () => {
		return sectionColoredPatterns.filter(
			( pattern ) =>
				! pattern.categories.includes( 'unitone-for-lower-level-pages' )
		);
	}, [ sectionColoredPatterns ] );

	useEffect( () => {
		if ( canvasRef.current !== null ) {
			canvasRef.current.scrollTop = 0;
		}
	}, [ previewPatterns, previewMode ] );

	return {
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
		sectionColoredPatterns,
		sectionColoredPatternsForHomepage,
	};
};
