import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import { cleanEmptyObject, resetUnitoneWithBlockAttributes } from '../utils';

import {
	isMarkerColorSupportDisabled,
	resetMarkerColorFilter,
	MarkerColorEdit,
	withMarkerColorBlockProps,
} from './marker-color';

export const withElementsBlockProps = withMarkerColorBlockProps;

export const resetElements = ( props ) => {
	if ( ! isMarkerColorSupportDisabled( props ) ) {
		return props;
	}

	return {
		...props,
		attributes: {
			...props.attributes,
			unitone: cleanEmptyObject( {
				...props.attributes?.unitone,
				...resetMarkerColorFilter(),
			} ),
		},
	};
};

function ElementsPanelPure( props ) {
	const { name, attributes } = props;

	if ( isMarkerColorSupportDisabled( { name } ) ) {
		return null;
	}

	return (
		<InspectorControls
			group="elements"
			resetAllFilter={ ( blockAttributes ) => ( {
				...blockAttributes,
				unitone: resetUnitoneWithBlockAttributes( {
					unitone: attributes?.unitone,
					blockAttributes,
					resetFilters: [ resetMarkerColorFilter() ],
				} ),
			} ) }
		>
			<MarkerColorEdit { ...props } />
		</InspectorControls>
	);
}

export const ElementsPanel = memo( ElementsPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
