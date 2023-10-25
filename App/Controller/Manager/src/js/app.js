import { createRoot } from '@wordpress/element';

import SettingsPage from './settings-page';

const root = createRoot( document.getElementById( 'unitone-settings' ) );
window.addEventListener(
	'load',
	function () {
		root.render( <SettingsPage /> );
	},
	false
);
