/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */
import classnames from 'classnames';

import { hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasPaddingValue( props ) {
	return props.attributes?.unitone?.padding !== undefined;
}

export function resetPadding( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			padding: undefined,
		} ),
	} );
}

export function useIsPaddingDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.padding' );
}

export function PaddingEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ __( 'Padding', 'unitone' ) }
			value={ unitone?.padding }
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
					padding: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function savePaddingProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.padding' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.padding ) {
		return extraProps;
	}

	extraProps[ 'data-layout' ] = classnames(
		extraProps[ 'data-layout' ],
		`-padding:${ attributes.unitone?.padding }`
	);

	return extraProps;
}

export function editPaddingProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.padding' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return savePaddingProp( props, settings, attributes );
	};
	return settings;
}
