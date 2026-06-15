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

import {
	isOpacitySupportDisabled,
	resetOpacityFilter,
	OpacityEdit,
	withOpacityBlockProps,
} from './opacity';

import { cleanEmptyObject, resetUnitoneWithBlockAttributes } from '../utils';

export const withColorBlockProps = compose(
	withOpacityBlockProps,
	withMarkerColorBlockProps,
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
		[ isOpacitySupportDisabled, resetOpacityFilter ],
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
	const isOpacityDisabled = isOpacitySupportDisabled( { name } );

	if (
		isHoverTextColorDisabled &&
		isHoverBackgroundColorDisabled &&
		isHoverGradientDisabled &&
		isHoverBorderColorDisabled &&
		isMarkerColorDisabled &&
		isOpacityDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="color"
				resetAllFilter={ ( blockAttributes ) => ( {
					...blockAttributes,
					...resetHoverTextColorFilter(),
					...resetHoverBackgroundColorFilter(),
					...resetHoverGradientFilter(),
					...resetHoverBorderColorFilter(),
					unitone: resetUnitoneWithBlockAttributes( {
						unitone: attributes?.unitone,
						blockAttributes,
						resetFilters: [
							resetMarkerColorFilter(),
							resetOpacityFilter(),
						],
					} ),
				} ) }
			>
				{ ! isHoverTextColorDisabled && (
					<HoverTextColorEdit { ...props } />
				) }

				{ ( ! isHoverBackgroundColorDisabled ||
					! isHoverGradientDisabled ) && (
					<HoverBackgroundColorEdit { ...props } />
				) }

				{ ! isHoverBorderColorDisabled && (
					<HoverBorderColorEdit { ...props } />
				) }

				{ ! isMarkerColorDisabled && <MarkerColorEdit { ...props } /> }

				{ ! isOpacityDisabled && (
					<div className="unitone-opacity-control">
						<OpacityEdit { ...props } />
					</div>
				) }
			</InspectorControls>
		</>
	);
}

export const ColorPanel = memo( ColorPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
