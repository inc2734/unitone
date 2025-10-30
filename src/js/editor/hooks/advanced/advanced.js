import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import {
	isStyleDisabled,
	resetStyleFilter,
	StyleTag,
	StyleEdit,
	withStyleBlockProps,
} from './style';

export { StyleTag };

export const withAdvancedBlockProps = withStyleBlockProps;

export const resetAdvanced = ( props ) => {
	const filters = [ [ isStyleDisabled, resetStyleFilter ] ];

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

function AdvancedPanelPure( props ) {
	const { name } = props;

	const isStylePanelDisabled = isStyleDisabled( { name } );

	if ( isStylePanelDisabled ) {
		return null;
	}

	return (
		<InspectorAdvancedControls>
			{ ! isStylePanelDisabled && <StyleEdit { ...props } /> }
		</InspectorAdvancedControls>
	);
}

export const AdvancedPanel = memo( AdvancedPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
