import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';

import {
	useIsDropShadowDisabled,
	hasDropShadowValue,
	resetDropShadowFilter,
	resetDropShadow,
	getDropShadowEditLabel,
	DropShadowEdit,
	useDropShadowBlockProps,
} from './drop-shadow';

import { cleanEmptyObject } from '../utils';

export { useDropShadowBlockProps };

function DropShadowPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

	const isDropShadowDisabled = useIsDropShadowDisabled( { name } );

	if ( isDropShadowDisabled ) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="border"
				resetAllFilter={ () => {
					setAttributes( {
						unitone: cleanEmptyObject(
							Object.assign(
								{ ...attributes?.unitone },
								resetDropShadowFilter()
							)
						),
					} );
				} }
			>
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
