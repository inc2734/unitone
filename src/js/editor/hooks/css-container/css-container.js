import fastDeepEqual from 'fast-deep-equal/es6';

import {
	PanelBody,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	isContainerTypeDisabled,
	resetContainerTypeFilter,
	ContainerTypeEdit,
	withContainerTypeBlockProps,
} from './container-type';

import {
	isResponsiveContextDisabled,
	resetResponsiveContextFilter,
	ResponsiveContextEdit,
	withResponsiveContextBlockProps,
} from './responsive-context';

import {
	isQueryContextDisabled,
	resetQueryContextFilter,
	QueryContextEdit,
	withQueryContextBlockProps,
} from './query-context';

import {
	isFluidReferenceDisabled,
	resetFluidReferenceFilter,
	FluidReferenceEdit,
	withFluidReferenceBlockProps,
} from './fluid-reference';

const controls = [
	{
		key: 'containerType',
		isDisabled: isContainerTypeDisabled,
		resetFilter: resetContainerTypeFilter,
		Edit: ContainerTypeEdit,
	},
	{
		key: 'responsiveContext',
		isDisabled: isResponsiveContextDisabled,
		resetFilter: resetResponsiveContextFilter,
		Edit: ResponsiveContextEdit,
	},
	{
		key: 'queryContext',
		isDisabled: isQueryContextDisabled,
		resetFilter: resetQueryContextFilter,
		Edit: QueryContextEdit,
	},
	{
		key: 'fluidReference',
		isDisabled: isFluidReferenceDisabled,
		resetFilter: resetFluidReferenceFilter,
		Edit: FluidReferenceEdit,
	},
];

export const withCSSContainerBlockProps = compose(
	withContainerTypeBlockProps,
	withResponsiveContextBlockProps,
	withQueryContextBlockProps,
	withFluidReferenceBlockProps
);

export const resetCSSContainer = ( props ) => {
	const unitone = controls.reduce(
		( accumulator, { isDisabled, resetFilter } ) =>
			isDisabled( props )
				? { ...accumulator, ...resetFilter() }
				: accumulator,
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

function CSSContainerPanelPure( props ) {
	const { attributes } = props;
	const supportedControls = controls.filter(
		( { isDisabled } ) => ! isDisabled( props )
	);
	const visibleControls = supportedControls.filter(
		( { key } ) =>
			// Show the deprecated control only when a saved value exists.
			'fluidReference' !== key ||
			null != attributes?.unitone?.fluidReference
	);

	if ( ! visibleControls.length ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody
				className="unitone-css-container-panel"
				title={ __( 'CSS container', 'unitone' ) }
				initialOpen={ false }
			>
				<VStack spacing={ 4 }>
					{ visibleControls.map( ( { key, Edit } ) => (
						<Edit key={ key } { ...props } />
					) ) }
				</VStack>
			</PanelBody>
		</InspectorControls>
	);
}

export const CSSContainerPanel = memo(
	CSSContainerPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
