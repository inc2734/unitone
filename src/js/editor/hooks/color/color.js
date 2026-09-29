import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorControls } from '@wordpress/block-editor';
import { __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
	isOpacitySupportDisabled,
	resetOpacityFilter,
	OpacityEdit,
	withOpacityBlockProps,
} from './opacity';

import { cleanEmptyObject, resetUnitoneWithBlockAttributes } from '../utils';

export const withColorBlockProps = compose(
	withOpacityBlockProps,
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
	const unitoneFilters = [ [ isOpacitySupportDisabled, resetOpacityFilter ] ];

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
	const { name, attributes, clientId, setAttributes } = props;

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
	const isOpacityDisabled = isOpacitySupportDisabled( { name } );
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
	const shouldShowColor = shouldShowHoverColor || ! isOpacityDisabled;

	if ( ! shouldShowColor ) {
		return null;
	}

	return (
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
					resetFilters: [ resetOpacityFilter() ],
				} ),
			} ) }
		>
			{ ! isOpacityDisabled && (
				<ToolsPanelItem
					className="unitone-opacity-control"
					hasValue={ () => null != attributes?.unitone?.opacity }
					label={ __( 'Opacity', 'unitone' ) }
					onDeselect={ () =>
						setAttributes( {
							unitone: cleanEmptyObject( {
								...attributes?.unitone,
								...resetOpacityFilter(),
							} ),
						} )
					}
					isShownByDefault
					panelId={ clientId }
				>
					<OpacityEdit { ...props } />
				</ToolsPanelItem>
			) }

			{ shouldShowHoverTextColor && <HoverTextColorEdit { ...props } /> }

			{ shouldShowHoverBackground && (
				<HoverBackgroundColorEdit { ...props } />
			) }

			{ shouldShowHoverBorderColor && (
				<HoverBorderColorEdit { ...props } />
			) }
		</InspectorControls>
	);
}

export const ColorPanel = memo( ColorPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
