import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { generateText } from '../utils/openai';

const TARGET_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list-item',
	'core/button',
];

const hasIsDecorationClass = ( block ) => {
	const className = block.attributes?.className || '';
	return className.split( ' ' ).includes( 'is-decoration' );
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
	const lengthInfo = plainText
		? `/ 文字列長: ${ plainText.length }文字程度`
		: '';

	let desc;

	if ( depth === 0 ) {
		// ルート: カテゴリーのみ
		desc = `${ indent }- [${ currentIndex }] ${ block.name } / パターンのカテゴリー: ${ categoryInfo }`;
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
	const prompt = `あなたは優秀な日本語ライターです。これから提供する WordPress のワイヤーフレーム構成に基づき、各ブロックに適した日本語のテキストを生成してください。

## ゴール
- 各ブロックの種類に応じて、適切な形式（見出し、段落、リスト、ボタンテキストなど）の日本語を作成します。
- 内容は自由に考えてください。ただし、デザイン上のバランスを保つため、指定された「文字列長」に近い長さの文章を作成してください。

## ワイヤーフレームの構成について
- 各行は「インデックス、WordPress のブロックタイプ」に続き、追加情報が書かれています。
- ルートレベル（インデントなし）の行には「パターンのカテゴリー」が記載されています。これはそのブロック全体の役割を示しています。
- 子ブロック（インデントあり）の行には「文字列長: ○○文字程度」が記載されており、テキスト生成時の目安となります。
- インデックスは後のマッピングで使う識別子です。
- 1つのパターンが複数のカテゴリーを持つことがあります。その場合、すべてのカテゴリーの役割を総合的に考慮してください。

## ワイヤーフレームの構成
${ describeBlocks( previewPatterns ) }

## パターンのカテゴリーと役割
以下はパターンのカテゴリーごとの役割です。テキスト生成時は必ずこれらの説明を参考にしてください。

### banners
複数のバナーが並ぶパターンです。サービス案内や特徴などが入ります。

### columns
複数の項目が並ぶパターンです。サービス案内や特徴などが入ります。

### cta
お問い合わせや資料請求等へ誘導します。

### faq
よくある質問が記載されます。

### heros
主にファーストビューで使用されます。主にキャッチコピーが入ります。

### history
沿革が入ります。

### information
会社概要が入ります。

### interview
インタビューが入ります。

### pricing-table
価格表です。

### query
お知らせ一覧や投稿リストが入ります。

### step
手順や順序の説明が入ります。

### teams
メンバーや社員の紹介が入ります。

## テキスト生成の対象ブロック
次のブロックだけがテキスト生成の対象です：
${ TARGET_BLOCKS.join( ', ' ) }

その他のブロックは無視してください。

## 追加指示
${ customPrompt || customPromptPlaceholder }

## 出力形式
JSON 形式で出力してください。キーはインデックス（数値）で、値は生成したテキストです。

例:
{
	"0": "見出しのテキスト",
	"1": "段落のテキスト",
	...
}`;
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
