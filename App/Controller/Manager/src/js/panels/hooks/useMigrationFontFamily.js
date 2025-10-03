import { useEffect } from '@wordpress/element';

export function useMigrationFontFamily( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'font-family' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedFontFamily = currentSettings?.[ 'font-family' ];
			if ( ! deprecatedFontFamily ) {
				return currentSettings;
			}

			return {
				...currentSettings,
				'font-family': null,
				styles: {
					...currentSettings?.styles,
					typography: {
						...currentSettings?.styles?.typography,
						fontFamily: deprecatedFontFamily,
					},
				},
			};
		} );
	}, [ settings?.[ 'font-family' ], setSettings ] );
}
