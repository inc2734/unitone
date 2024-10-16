import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import {
	useIsStyleDisabled,
	StyleTag,
	StyleEdit,
	useStyleBlockProps,
} from './style';

export { useStyleBlockProps, StyleTag };

function AdvancedPanelPure( { clientId, name, unitone, setAttributes } ) {
	const props = {
		clientId,
		name,
		unitone,
		setAttributes,
	};

	const isStyleDisabled = useIsStyleDisabled( { name } );

	if ( isStyleDisabled ) {
		return null;
	}

	return (
		<InspectorAdvancedControls>
			{ ! isStyleDisabled && <StyleEdit { ...props } /> }
		</InspectorAdvancedControls>
	);
}

export const AdvancedPanel = memo( AdvancedPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
