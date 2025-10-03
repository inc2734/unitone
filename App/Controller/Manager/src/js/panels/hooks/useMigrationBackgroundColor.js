import { useEffect } from '@wordpress/element';

export function useMigrationBackgroundColor( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'background-color' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedBackgroundColor =
				currentSettings?.[ 'background-color' ];
			if ( ! deprecatedBackgroundColor ) {
				return currentSettings;
			}

			return {
				...currentSettings,
				'background-color': null,
				styles: {
					...currentSettings?.styles,
					color: {
						...currentSettings?.styles?.color,
						background: deprecatedBackgroundColor,
					},
				},
			};
		} );
	}, [ settings?.[ 'background-color' ], setSettings ] );
}
