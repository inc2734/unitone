import classnames from 'classnames';

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasGuttersValue( props ) {
	return props.attributes?.unitone?.gutters !== undefined;
}

export function resetGutters( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			gutters: undefined,
		} ),
	} );
}

export function useIsGuttersDisabled( { name: blockName } = {} ) {
	return ! getBlockSupport( blockName, 'unitone.gutters' );
}

export function GuttersEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SelectControl
			label={ __( 'Gutters', 'unitone' ) }
			value={ unitone?.gutters }
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
					gutters: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveGuttersProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gutters' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gutters ) {
		return extraProps;
	}

	extraProps[ 'data-layout' ] = classnames(
		extraProps[ 'data-layout' ],
		`-gutters:${ attributes.unitone?.gutters }`
	);

	return extraProps;
}

export function editGuttersProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.gutters' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGuttersProp( props, settings, attributes );
	};

	return settings;
}
