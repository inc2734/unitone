import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import icon from './icon';
import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/mega-menu', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );

const addToNavigation = ( settings, blockName ) => {
	if ( 'core/navigation' !== blockName ) {
		return settings;
	}

	return {
		...settings,
		allowedBlocks: [
			...( settings.allowedBlocks ?? [] ),
			'unitone/mega-menu',
		],
	};
};

addFilter(
	'blocks.registerBlockType',
	'unitone/mega-menu/add-to-navigation',
	addToNavigation
);
