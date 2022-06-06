import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	useIsHeaderPositionDisabled,
	HeaderPositionEdit,
} from './header-position';

export function HeaderPanel( props ) {
	const isHeaderPositionDisabled = useIsHeaderPositionDisabled( props );
	if ( isHeaderPositionDisabled ) {
		return null;
	}

	return (
		<>
			{ ! isHeaderPositionDisabled && (
				<InspectorControls>
					<PanelBody title={ __( 'General', 'unitone' ) }>
						{ ! isHeaderPositionDisabled && (
							<HeaderPositionEdit { ...props } />
						) }
					</PanelBody>
				</InspectorControls>
			) }
		</>
	);
}
