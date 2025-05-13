import apiFetch from '@wordpress/api-fetch';

export const generateText = async ( prompt ) => {
	const response = await apiFetch( {
		path: '/unitone/v1/openai',
		method: 'POST',
		data: { prompt },
	} );

	return response.choices?.[ 0 ]?.message?.content ?? '';
};
