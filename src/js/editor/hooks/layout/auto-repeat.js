import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

const autoRepeatOptions = [
	{
		label: '',
		value: '',
	},
	{
		label: __( 'auto-fill', 'unitone' ),
		value: 'auto-fill',
	},
	{
		label: __( 'auto-fit', 'unitone' ),
		value: 'auto-fit',
	},
];

export function useIsAutoRepeatDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.autoRepeat;

	return (
		defaultValue !== unitone?.autoRepeat &&
		undefined !== unitone?.autoRepeat
	);
}

export function resetAutoRepeatFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			autoRepeat: undefined,
		},
	};
}

export function resetAutoRepeat( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAutoRepeatFilter( { unitone } )?.unitone
		),
	} );
}

export function getAutoRepeatEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.autoRepeat?.label ||
		__( 'Auto repeat', 'unitone' )
	);
}

export function AutoRepeatEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.autoRepeat;
	}, [] );

	return (
		<SelectControl
			label={ label }
			value={ unitone?.autoRepeat ?? defaultValue ?? '' }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					autoRepeat: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveAutoRepeatProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.autoRepeat;

	if ( ! hasBlockSupport( blockType, 'unitone.autoRepeat' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.autoRepeat ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				autoRepeat: defaultValue,
			},
		};
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-auto-repeat:${ attributes.unitone?.autoRepeat }`
	);

	return extraProps;
}

export function useAutoRepeatBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveAutoRepeatProp( wrapperProps, name, attributes ),
		},
	};
}
