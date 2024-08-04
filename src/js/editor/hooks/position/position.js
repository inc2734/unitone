import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import {
	useIsPositionDisabled,
	PositionEdit,
	editPositionProp,
} from './position-object';

export { editPositionProp };

function PositionPanelPure( props ) {
	const isPositionDisabled = useIsPositionDisabled( { ...props } );

	if ( isPositionDisabled ) {
		return null;
	}

	return (
		<>
			{ ! isPositionDisabled && (
				<InspectorControls group="styles">
					{ ! isPositionDisabled && <PositionEdit { ...props } /> }
				</InspectorControls>
			) }
		</>
	);
}

export const PositionPanel = memo( PositionPanelPure );
