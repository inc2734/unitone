import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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

export function useIsAutoRepeatDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.autoRepeat' );
}

export function hasAutoRepeatValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.autoRepeat;

	return null != defaultValue
		? attributes?.unitone?.autoRepeat !== defaultValue
		: attributes?.unitone?.autoRepeat !== undefined;
}

export function resetAutoRepeat( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.autoRepeat;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.autoRepeat;

	if ( null != defaultValue ) {
		newUnitone.autoRepeat = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function getAutoRepeatEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.autoRepeat?.label ||
		__( 'Auto repeat', 'unitone' )
	);
}

export function AutoRepeatEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.autoRepeat;
	}, [] );

	return (
		<SelectControl
			label={ label }
			value={ unitone?.autoRepeat || '' }
			options={ autoRepeatOptions }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					autoRepeat: newValue || undefined,
				};
				if ( null == newUnitone.autoRepeat ) {
					if ( null == defaultValue ) {
						delete newUnitone.autoRepeat;
					} else {
						newUnitone.autoRepeat = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
		/>
	);
}

export function saveAutoRepeatProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.autoRepeat' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.autoRepeat ) {
		return extraProps;
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
