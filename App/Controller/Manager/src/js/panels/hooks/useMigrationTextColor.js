import { useEffect } from '@wordpress/element';

export function useMigrationTextColor( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'text-color' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedTextColor = currentSettings?.[ 'text-color' ];
			if ( ! deprecatedTextColor ) {
				return currentSettings;
			}

			return {
				...currentSettings,
				'text-color': null,
				styles: {
					...currentSettings?.styles,
					color: {
						...currentSettings?.styles?.color,
						text: deprecatedTextColor,
					},
				},
			};
		} );
	}, [ settings?.[ 'text-color' ], setSettings ] );
}
