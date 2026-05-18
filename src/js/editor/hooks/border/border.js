import fastDeepEqual from 'fast-deep-equal/es6';
import deepmerge from 'deepmerge';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { memo } from '@wordpress/element';

import {
	isDropShadowSupportDisabled,
	hasDropShadowValue,
	resetDropShadowFilter,
	resetDropShadow,
	getDropShadowEditLabel,
	DropShadowEdit,
	withDropShadowBlockProps,
} from './drop-shadow';

import { cleanEmptyObject } from '../utils';

export const withBorderBlockProps = withDropShadowBlockProps;

export const resetBorder = ( props ) => {
	const filters = [ [ isDropShadowSupportDisabled, resetDropShadowFilter ] ];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

function BorderPanelPure( props ) {
	const { name, clientId } = props;

	const isDropShadowDisabled = isDropShadowSupportDisabled( { name } );

	if ( isDropShadowDisabled ) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="border"
				resetAllFilter={ ( blockAttributes ) => ( {
					...blockAttributes,
					unitone: cleanEmptyObject(
						deepmerge.all( [
							{ ...blockAttributes?.unitone },
							resetDropShadowFilter(),
						] )
					),
				} ) }
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

export const BorderPanel = memo( BorderPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
