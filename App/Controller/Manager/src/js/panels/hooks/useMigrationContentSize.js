import { useEffect } from '@wordpress/element';

export function useMigrationContentSize( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'content-size' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedContentSize = currentSettings?.[ 'content-size' ];
			if ( ! deprecatedContentSize ) {
				return currentSettings;
			}

			return {
				...currentSettings,
				'content-size': null,
				settings: {
					...currentSettings?.settings,
					layout: {
						...currentSettings?.settings?.layout,
						contentSize: deprecatedContentSize,
					},
				},
			};
		} );
	}, [ settings?.[ 'content-size' ], setSettings ] );
}
