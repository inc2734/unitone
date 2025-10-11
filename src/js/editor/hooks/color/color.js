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

export const withColorBlockProps = compose(
	withHoverTextColorBlockProps,
	withHoverBackgroundColorBlockProps,
	withHoverBorderColorBlockProps
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

	const attributes = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes }
	);

	return { ...props, attributes: { ...attributes } };
};

function ColorPanelPure( props ) {
	const { name, setAttributes } = props;

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

	if (
		isHoverTextColorDisabled &&
		isHoverBackgroundColorDisabled &&
		isHoverGradientDisabled &&
		isHoverBorderColorDisabled
	) {
		return null;
	}

	return (
		<>
			<InspectorControls
				group="color"
				resetAllFilter={ () => {
					setAttributes( {
						...resetHoverTextColorFilter(),
						...resetHoverBackgroundColorFilter(),
						...resetHoverGradientFilter(),
						...resetHoverBorderColorFilter(),
					} );
				} }
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
			</InspectorControls>
		</>
	);
}

export const ColorPanel = memo( ColorPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
