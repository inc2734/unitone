import { useEffect } from '@wordpress/element';

const ACCENT_SLUG = 'unitone-accent';

export function useMigrationAccentColor( settings, setSettings ) {
	useEffect( () => {
		if ( ! settings?.[ 'accent-color' ] ) {
			return;
		}

		setSettings( ( currentSettings ) => {
			const deprecatedAccentColor = currentSettings?.[ 'accent-color' ];
			if ( ! deprecatedAccentColor ) {
				return currentSettings;
			}

			const currentThemePalette = Array.isArray( currentSettings?.settings?.color?.palette?.theme )
				? currentSettings.settings.color.palette.theme
				: [];
			let accentEntryReplaced = false;
			const nextThemePalette = currentThemePalette.map( ( entry ) => {
				if ( ! entry || entry.slug !== ACCENT_SLUG ) {
					return entry;
				}

				accentEntryReplaced = true;
				return {
					...entry,
					color: deprecatedAccentColor,
				};
			} );

			if ( ! accentEntryReplaced ) {
				nextThemePalette.push( {
					slug: ACCENT_SLUG,
					color: deprecatedAccentColor,
				} );
			}

			return {
				...currentSettings,
				'accent-color': null,
				settings: {
					...currentSettings?.settings,
					color: {
						...currentSettings?.settings?.color,
						palette: {
							...currentSettings?.settings?.color?.palette,
							theme: nextThemePalette,
						},
					},
				},
			};
		} );
	}, [ settings?.[ 'accent-color' ], setSettings ] );
}
