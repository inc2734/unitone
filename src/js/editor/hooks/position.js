import { InspectorControls } from '@wordpress/block-editor';

import {
	useIsPositionDisabled,
	PositionEdit,
	savePositionProp,
	editPositionProp,
} from './position-object';

export { savePositionProp, editPositionProp };

export function PositionPanel( props ) {
	const isPositionDisabled = useIsPositionDisabled( props );

	if ( isPositionDisabled ) {
		return null;
	}

	return (
		<>
			{ ! isPositionDisabled && (
				<InspectorControls>
					{ ! isPositionDisabled && <PositionEdit { ...props } /> }
				</InspectorControls>
			) }
		</>
	);
}
