export const withMinDelay = async ( promise, ms = 1000 ) => {
	const start = Date.now();
	const result = await promise;
	const elapsed = Date.now() - start;
	if ( elapsed < ms ) {
		await new Promise( ( resolve ) => setTimeout( resolve, ms - elapsed ) );
	}
	return result;
};
