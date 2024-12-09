import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo, useCallback } from '@wordpress/element';

import {
	useIsDropShadowDisabled,
	hasDropShadowValue,
	resetDropShadowFilter,
	resetDropShadow,
	getDropShadowEditLabel,
	DropShadowEdit,
	useDropShadowBlockProps,
} from './drop-shadow';

export { useDropShadowBlockProps };

function DropShadowPanelPure( props ) {
	const { name, clientId } = props;

	const resetAllFilter = useCallback( ( _attributes ) => {
		_attributes = resetDropShadowFilter( _attributes );

		return _attributes;
	}, [] );

	const isDropShadowDisabled = useIsDropShadowDisabled( { name } );

	if ( isDropShadowDisabled ) {
		return null;
	}

	return (
		<>
			<InspectorControls group="border" resetAllFilter={ resetAllFilter }>
				{ ! isDropShadowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDropShadowValue( { ...props } ) }
						label={ getDropShadowEditLabel( { ...props } ) }
						onDeselect={ () => resetDropShadow( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<DropShadowEdit
							{ ...props }
							label={ getDropShadowEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }
			</InspectorControls>
		</>
	);
}

export const DropShadowPanel = memo(
	DropShadowPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
