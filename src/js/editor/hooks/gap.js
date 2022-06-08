import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasGapValue( props ) {
	return props.attributes?.unitone?.gap !== undefined;
}

export function resetGap( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			gap: undefined,
		} ),
	} );
}

export function useIsGapDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.gap' );
}

export function GapEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ __( 'Gap', 'unitone' ) }
			value={ unitone?.gap }
			options={ [
				{
					label: '',
					value: undefined,
				},
				{
					label: '-2',
					value: '-2',
				},
				{
					label: '-1',
					value: '-1',
				},
				{
					label: '0',
					value: '0',
				},
				{
					label: '1',
					value: '1',
				},
				{
					label: '2',
					value: '2',
				},
				{
					label: '3',
					value: '3',
				},
				{
					label: '4',
					value: '4',
				},
				{
					label: '5',
					value: '5',
				},
				{
					label: '6',
					value: '6',
				},
				{
					label: '7',
					value: '7',
				},
			] }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					gap: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveGapProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gap' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gap ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-gap:${ attributes.unitone?.gap }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-gap:${ attributes.unitone?.gap }`
	);

	return extraProps;
}

export function editGapProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.gap' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGapProp( props, settings, attributes );
	};
	return settings;
}
