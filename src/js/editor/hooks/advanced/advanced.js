import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import {
	useIsStyleDisabled,
	resetStyleFilter,
	StyleTag,
	StyleEdit,
	useStyleBlockProps,
} from './style';

export { StyleTag };

export const useAdvancedBlockProps = useStyleBlockProps;

export const useResetAdvanced = ( props ) => {
	const filters = [ [ useIsStyleDisabled, resetStyleFilter ] ];

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
