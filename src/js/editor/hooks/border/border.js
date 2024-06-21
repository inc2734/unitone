import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';

import {
	useIsDropShadowDisabled,
	hasDropShadowValue,
	resetDropShadow,
	getDropShadowEditLabel,
	DropShadowEdit,
	editDropShadowProp,
} from './drop-shadow';

export { editDropShadowProp };

export function DropShadowPanel( props ) {
	const isDropShadowDisabled = useIsDropShadowDisabled( props );

	if ( isDropShadowDisabled ) {
		return null;
	}

	return (
		<>
			<InspectorControls group="border">
				{ ! isDropShadowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDropShadowValue( props ) }
						label={ getDropShadowEditLabel( props ) }
						onDeselect={ () => resetDropShadow( props ) }
						resetAllFilter={ () => resetDropShadow( props ) }
						isShownByDefault
						panelId={ props.clientId }
					>
						<DropShadowEdit
							{ ...props }
							label={
								<>
									{ getDropShadowEditLabel( props ) }
									&nbsp;:&nbsp;
									<code>filter:drop-shadow</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}
