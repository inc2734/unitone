import { useEffect } from '@wordpress/element';

export function useMigrationWideSize( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'wide-size' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedWideSize = currentSettings?.[ 'wide-size' ];
			if ( ! deprecatedWideSize ) {
				return currentSettings;
			}

			return {
				...currentSettings,
				'wide-size': null,
				settings: {
					...currentSettings?.settings,
					layout: {
						...currentSettings?.settings?.layout,
						wideSize: deprecatedWideSize,
					},
				},
			};
		} );
	}, [ settings?.[ 'wide-size' ], setSettings ] );
}
