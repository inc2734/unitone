import { __ } from '@wordpress/i18n';

export const onClickInsertOnly = ( {
	blocks,
	onSelectBlockPattern,
	setIsOpen,
} ) => {
	const newPattern = {
		title: __( 'Wireframe', 'unitone' ),
		blocks,
	};

	onSelectBlockPattern( newPattern, blocks );

	setIsOpen( false );
};
