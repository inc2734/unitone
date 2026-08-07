import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';

import {
	isHoverTextColorSupportDisabled,
	resetHoverTextColorFilter,
	HoverTextColorEdit,
	withHoverTextColorBlockProps,
} from './hover-text-color';

import {
	isHoverBackgroundColorSupportDisabled,
	isHoverGradientSupportDisabled,
	resetHoverBackgroundColorFilter,
	resetHoverGradientFilter,
	HoverBackgroundColorEdit,
	withHoverBackgroundColorBlockProps,
} from './hover-background-color';

import {
	isHoverBorderColorSupportDisabled,
	resetHoverBorderColorFilter,
	HoverBorderColorEdit,
	withHoverBorderColorBlockProps,
} from './hover-border-color';

import {
	isMarkerColorSupportDisabled,
	resetMarkerColorFilter,
	MarkerColorEdit,
	withMarkerColorBlockProps,
} from './marker-color';

import { cleanEmptyObject, resetUnitoneWithBlockAttributes } from '../utils';

export const withColorBlockProps = compose(
	withHoverTextColorBlockProps,
	withHoverBackgroundColorBlockProps,
	withHoverBorderColorBlockProps,
	withMarkerColorBlockProps
);

export const resetColor = ( props ) => {
	const filters = [
		[ isHoverTextColorSupportDisabled, resetHoverTextColorFilter ],
		[
			isHoverBackgroundColorSupportDisabled,
			resetHoverBackgroundColorFilter,
		],
		[ isHoverGradientSupportDisabled, resetHoverGradientFilter ],
		[ isHoverBorderColorSupportDisabled, resetHoverBorderColorFilter ],
	];
	const unitoneFilters = [
		[ isMarkerColorSupportDisabled, resetMarkerColorFilter ],
	];

	const attributes = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes }
	);

	const unitone = unitoneFilters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return {
		...props,
		attributes: {
			...attributes,
			unitone: cleanEmptyObject( unitone ),
		},
	};
};

function ColorPanelPure( props ) {
	const { name, attributes } = props;

	const {
		hoverTextColor,
		customHoverTextColor,
		hoverBackgroundColor,
		customHoverBackgroundColor,
		hoverGradient,
		customHoverGradient,
		hoverBorderColor,
		customHoverBorderColor,
	} = attributes;

	const isHoverTextColorDisabled = isHoverTextColorSupportDisabled( {
		name,
	} );
	const isHoverBackgroundColorDisabled =
		isHoverBackgroundColorSupportDisabled( {
			name,
		} );
	const isHoverGradientDisabled = isHoverGradientSupportDisabled( { name } );
	const isHoverBorderColorDisabled = isHoverBorderColorSupportDisabled( {
		name,
	} );
	const isMarkerColorDisabled = isMarkerColorSupportDisabled( { name } );
	const shouldHideUnsetHoverColor = 'core/button' === name;

	const shouldShowHoverTextColor =
		! isHoverTextColorDisabled &&
		( ! shouldHideUnsetHoverColor ||
			!! hoverTextColor ||
			!! customHoverTextColor );

	const shouldShowHoverBackground =
		( ! isHoverBackgroundColorDisabled &&
			( ! shouldHideUnsetHoverColor ||
				!! hoverBackgroundColor ||
				!! customHoverBackgroundColor ) ) ||
		( ! isHoverGradientDisabled &&
			( ! shouldHideUnsetHoverColor ||
				!! hoverGradient ||
				!! customHoverGradient ) );

	const shouldShowHoverBorderColor =
		! isHoverBorderColorDisabled &&
		( ! shouldHideUnsetHoverColor ||
			!! hoverBorderColor ||
			!! customHoverBorderColor );

	const shouldShowHoverColor =
		shouldShowHoverTextColor ||
		shouldShowHoverBackground ||
		shouldShowHoverBorderColor;

	if ( ! shouldShowHoverColor && isMarkerColorDisabled ) {
		return null;
	}

	return (
		<>
			{ shouldShowHoverColor && (
				<InspectorControls
					group="color"
					resetAllFilter={ ( blockAttributes ) => ( {
						...blockAttributes,
						...resetHoverTextColorFilter(),
						...resetHoverBackgroundColorFilter(),
						...resetHoverGradientFilter(),
						...resetHoverBorderColorFilter(),
					} ) }
				>
					{ shouldShowHoverTextColor && (
						<HoverTextColorEdit { ...props } />
					) }

					{ shouldShowHoverBackground && (
						<HoverBackgroundColorEdit { ...props } />
					) }

					{ shouldShowHoverBorderColor && (
						<HoverBorderColorEdit { ...props } />
					) }
				</InspectorControls>
			) }

			{ ! isMarkerColorDisabled && (
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
			) }
		</>
	);
}

export const ColorPanel = memo( ColorPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
