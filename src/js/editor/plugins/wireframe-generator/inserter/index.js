import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { generateText } from '../utils/openai';
import { promptTemplate } from '../utils/promptTemplate';

const TARGET_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list-item',
	'core/button',
];

const hasIsDecorationClass = ( block ) => {
	const className = block.attributes?.className || '';
	return className.split( ' ' ).includes( 'unitone-is-decoration' );
};

const injectGeneratedText = async (
	blocks,
	textMap,
	indexTracker = { index: 0 }
) => {
	return await Promise.all(
		blocks.map( async ( block ) => {
			const currentIndex = indexTracker.index++;
			let updatedBlock = block;

			const isTargetBlock = TARGET_BLOCKS.includes( block.name );
			const shouldReplace =
				isTargetBlock && ! hasIsDecorationClass( block );

			if ( shouldReplace && textMap[ currentIndex ] ) {
				updatedBlock = createBlock(
					block.name,
					{
						...block.attributes,
						content: textMap[ currentIndex ],
					},
					block.innerBlocks?.length > 0
						? await injectGeneratedText(
								block.innerBlocks,
								textMap,
								indexTracker
						  )
						: []
				);
			} else if ( block.innerBlocks?.length > 0 ) {
				updatedBlock = createBlock(
					block.name,
					block.attributes,
					await injectGeneratedText(
						block.innerBlocks,
						textMap,
						indexTracker
					)
				);
			}

			return updatedBlock;
		} )
	);
};

const describeBlocks = ( patterns, indexTracker = { index: 0 } ) => {
	return patterns
		.map( ( pattern ) => {
			const categoryInfo = pattern.categories?.length
				? pattern.categories.join( ', ' ).replace( 'unitone-' )
				: '';

			return pattern.blocks
				.map( ( block ) => {
					return describeBlockRecursive(
						block,
						0,
						indexTracker,
						categoryInfo
					);
				} )
				.join( '\n' );
		} )
		.join( '\n' );
};

const describeBlockRecursive = (
	block,
	depth,
	indexTracker,
	categoryInfo = ''
) => {
	const indent = ' '.repeat( depth * 2 );
	const currentIndex = indexTracker.index++;

	const content = block.attributes?.content ?? block.attributes?.text ?? '';
	const plainText = content.replace( /<[^>]*>/g, '' ).trim();
	const lengthInfo = plainText ? `/ L ≈ ${ plainText.length } chars` : '';

	let desc;

	if ( depth === 0 ) {
		// ルート: カテゴリーのみ
		desc = `${ indent }- [${ currentIndex }] ${ block.name } / Categories: ${ categoryInfo }`;
	} else {
		// 子ブロック: 文字列長のみ
		desc =
			`${ indent }- [${ currentIndex }] ${ block.name } ${ lengthInfo }`.trimEnd();
	}

	if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
		desc += `\n${ block.innerBlocks
			.map( ( child ) =>
				describeBlockRecursive( child, depth + 1, indexTracker )
			)
			.join( '\n' ) }`;
	}

	return desc;
};

export const onClickInsertOnly = ( {
	blocks,
	onSelectBlockPattern,
	setIsOpen,
} ) => {
	const newPattern = {
		title: __( 'Wireframe', 'unitone' ),
		blocks,
	};

	onSelectBlockPattern( newPattern, blocks );

	setIsOpen( false );
};

export const onClickInsertAndReplace = async ( {
	blocks,
	previewPatterns,
	setIsLoading,
	onSelectBlockPattern,
	setIsOpen,
	customPromptPlaceholder,
	customPrompt,
} ) => {
	const prompt = promptTemplate( {
		targetBlocks: TARGET_BLOCKS,
		customPrompt: customPrompt || customPromptPlaceholder,
		describedBlocks: describeBlocks( previewPatterns ),
	} );

	setIsLoading( true );

	try {
		const result = await generateText( prompt );
		let cleanedResult = result.trim();
		const match = cleanedResult.match( /```(?:json)?\s*([\s\S]*?)```/i );
		if ( match ) {
			cleanedResult = match[ 1 ].trim();
		}

		const json = JSON.parse( cleanedResult );

		const enhancedBlocks = await injectGeneratedText( blocks, json );

		const newPattern = {
			title: __( 'Wireframe', 'unitone' ),
			blocks: enhancedBlocks,
		};

		onSelectBlockPattern( newPattern, enhancedBlocks );

		setIsOpen( false );
	} catch ( error ) {
		console.error( error ); // eslint-disable-line no-console
		alert( __( 'An error occurred during text generation.', 'unitone' ) ); // eslint-disable-line no-alert
	} finally {
		setIsLoading( false );
	}
};
