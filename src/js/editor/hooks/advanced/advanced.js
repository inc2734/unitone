import fastDeepEqual from 'fast-deep-equal/es6';

import { InspectorAdvancedControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

import {
	isStyleDisabled,
	resetStyleFilter,
	CustomCSSStyleOverride,
	StyleEdit,
	withStyleBlockProps,
} from './style';

import {
	isQueryContextDisabled,
	QueryContextEdit,
	resetQueryContextFilter,
	withQueryContextBlockProps,
} from './query-context';

import {
	ContainerTypeEdit,
	isContainerTypeDisabled,
	resetContainerTypeFilter,
	withContainerTypeBlockProps,
} from './container-type';

import {
	FluidReferenceEdit,
	isFluidReferenceDisabled,
	resetFluidReferenceFilter,
	withFluidReferenceBlockProps,
} from './fluid-reference';

export { CustomCSSStyleOverride };

export const withAdvancedBlockProps = ( props ) =>
	withFluidReferenceBlockProps(
		withContainerTypeBlockProps(
			withQueryContextBlockProps( withStyleBlockProps( props ) )
		)
	);

export const resetAdvanced = ( props ) => {
	const filters = [
		[ isStyleDisabled, resetStyleFilter ],
		[ isQueryContextDisabled, resetQueryContextFilter ],
		[ isContainerTypeDisabled, resetContainerTypeFilter ],
		[ isFluidReferenceDisabled, resetFluidReferenceFilter ],
	];

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
	const isQueryContextPanelDisabled = isQueryContextDisabled( { name } );
	const isContainerTypePanelDisabled = isContainerTypeDisabled( { name } );
	const isFluidReferencePanelDisabled = isFluidReferenceDisabled( { name } );

	if (
		isStylePanelDisabled &&
		isQueryContextPanelDisabled &&
		isContainerTypePanelDisabled &&
		isFluidReferencePanelDisabled
	) {
		return null;
	}

	return (
		<InspectorAdvancedControls>
			{ ! isContainerTypePanelDisabled && (
				<ContainerTypeEdit { ...props } />
			) }

			{ ! isFluidReferencePanelDisabled && (
				<FluidReferenceEdit { ...props } />
			) }

			{ ! isQueryContextPanelDisabled && (
				<QueryContextEdit { ...props } />
			) }

			{ ! isStylePanelDisabled && <StyleEdit { ...props } /> }
		</InspectorAdvancedControls>
	);
}

export const AdvancedPanel = memo( AdvancedPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
