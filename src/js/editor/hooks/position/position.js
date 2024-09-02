import { InspectorControls } from '@wordpress/block-editor';

import {
	useIsPositionDisabled,
	PositionEdit,
	usePositionBlockProps,
} from './position-object';

export { usePositionBlockProps };

export function PositionPanel( props ) {
	const isPositionDisabled = useIsPositionDisabled( props );

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
