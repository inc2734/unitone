import apiFetch from '@wordpress/api-fetch';
import { getLocaleData } from '@wordpress/i18n';

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

	const response = await apiFetch( {
		path: '/unitone/v1/openai',
		method: 'POST',
		data: {
			...data,
			prompt: combinedPrompt,
		},
	} );

	const results = ( response?.choices || [] )
		.map( ( choice, index ) => {
			const text = choice?.message?.content ?? '';
			if ( 'string' !== typeof text ) {
				return null;
			}

			const trimmed = text.trim();
			if ( ! trimmed ) {
				return null;
			}

			const cleaned = trimmed.replace(
				/^(["'“”「『])(.*?)(["'“”」』])$/u,
				'$2'
			);

			return {
				id: `r${ index + 1 }`,
				text: cleaned,
			};
		} )
		.filter( Boolean );

	return { results };
};
