import '@inc2734/unitone-css/app';

import { getAdminThemeColors } from '@wordpress/admin-ui';
import { createRoot } from '@wordpress/element';
import { ThemeProvider } from '@wordpress/theme';

import SettingsPage from './settings-page';

const root = createRoot( document.getElementById( 'unitone-settings' ) );
window.addEventListener(
	'load',
	function () {
		const adminThemeColors = getAdminThemeColors();

		root.render(
			<ThemeProvider
				color={ { ...adminThemeColors, background: '#fcfcfc' } }
				isRoot
			>
				<SettingsPage adminThemeColors={ adminThemeColors } />
			</ThemeProvider>
		);
	},
	false
);
