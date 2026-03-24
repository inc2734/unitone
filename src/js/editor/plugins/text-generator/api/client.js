import apiFetch from '@wordpress/api-fetch';
import { getLocaleData } from '@wordpress/i18n';

const sanitizeText = ( text ) => {
	const trimmed = text.trim();
	if ( ! trimmed ) {
		return '';
	}

	return trimmed.replace( /^(["'“”「『])(.*?)(["'“”」』])$/u, '$2' );
};

const normalizeLegacyOpenAIResults = ( response ) => {
	if ( Array.isArray( response?.results ) && 0 < response.results.length ) {
		return response.results
			.map( ( result, index ) => {
				const text = result?.text ?? '';
				if ( 'string' !== typeof text ) {
					return null;
				}

				const cleaned = sanitizeText( text );
				if ( ! cleaned ) {
					return null;
				}

				return {
					id: result?.id || `r${ index + 1 }`,
					text: cleaned,
				};
			} )
			.filter( Boolean );
	}

	if ( Array.isArray( response?.choices ) && 0 < response.choices.length ) {
		return response.choices
			.map( ( choice, index ) => {
				const text = choice?.message?.content ?? '';
				if ( 'string' !== typeof text ) {
					return null;
				}

				const cleaned = sanitizeText( text );
				if ( ! cleaned ) {
					return null;
				}

				return {
					id: `r${ index + 1 }`,
					text: cleaned,
				};
			} )
			.filter( Boolean );
	}

	return [];
};

const isWpAiConfiguredForTextGeneration = async () => {
	try {
		const response = await apiFetch( {
			path: '/unitone/v1/ai-connectors-status',
		} );
		return response;
	} catch ( e ) {
		return false;
	}
};

const generateTextByWordPressAI = async ( prompt ) => {
	const response = await apiFetch( {
		path: '/unitone/v1/ai-generate',
		method: 'POST',
		data: {
			prompt,
		},
	} );

	const text = response?.results?.[ 0 ]?.text || '';
	const cleaned = sanitizeText( text );
	if ( ! cleaned ) {
		throw new Error( 'WordPress AI returned an empty response.' );
	}

	return {
		results: [
			{
				id: 'r1',
				text: cleaned,
			},
		],
	};
};

const generateTextByLegacyOpenAI = async ( prompt, data ) => {
	const response = await apiFetch( {
		path: '/unitone/v1/openai',
		method: 'POST',
		data: {
			...data,
			prompt,
		},
	} );

	return {
		results: normalizeLegacyOpenAIResults( response ),
		meta: {
			source: 'legacy-openai',
			isFallback: true,
			isDeprecated: true,
		},
	};
};

export const generateText = async ( { prompt, n } ) => {
	const localeData = getLocaleData();
	const language =
		localeData?.[ '' ]?.lang || document?.documentElement?.lang || 'en';
	const data = {
		prompt,
	};

	if ( Number.isInteger( n ) ) {
		data.n = n;
	}

	const instructionLines = [
		'Return only the requested content.',
		'Do not include greetings, explanations, headings, markdown, or separators.',
		'Unless it is a line in a sentence or requires emphasis, do not include quotation marks unless necessary.',
		'Output plain text only.',
		`This language locale is ${ language }. Please respond accordingly.`,
		'If the user does not explicitly ask for multiple items or a list, return a single item without list formatting.',
		'If the user asks for multiple items, output each item as its own paragraph.',
		'If there are line breaks, they will all be output as separate paragraphs.',
	];

	const combinedPrompt = `${ prompt }\n\nInstructions:\n${ instructionLines
		.map( ( line ) => `- ${ line }` )
		.join( '\n' ) }`;

	if ( await isWpAiConfiguredForTextGeneration() ) {
		return await generateTextByWordPressAI( combinedPrompt );
	}

	return await generateTextByLegacyOpenAI( combinedPrompt, data );
};
