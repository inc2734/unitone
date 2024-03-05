import classnames from 'classnames';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const justifySelfOptions = [
	{
		label: '',
		value: '',
	},
	{
		label: 'auto',
		value: 'auto',
	},
	{
		label: 'normal',
		value: 'normal',
	},
	{
		label: 'start',
		value: 'start',
	},
	{
		label: 'center',
		value: 'center',
	},
	{
		label: 'end',
		value: 'end',
	},
	{
		label: 'stretch',
		value: 'stretch',
	},
	{
		label: 'baseline',
		value: 'baseline',
	},
];

export function hasJustifySelfValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.justifySelf?.default
			? attributes?.__unstableUnitoneSupports?.justifySelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.justifySelf;

	return null != defaultValue
		? attributes?.unitone?.justifySelf !== defaultValue
		: attributes?.unitone?.justifySelf !== undefined;
}

export function resetJustifySelf( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.justifySelf;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.justifySelf?.default
			? attributes?.__unstableUnitoneSupports?.justifySelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.justifySelf;

	if ( null != defaultValue ) {
		newUnitone.justifySelf = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsJustifySelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function getJustifySelfEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.justifySelf?.label ||
		__( 'Justify self', 'unitone' )
	);
}

export function JustifySelfEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );
	if ( null != __unstableUnitoneSupports?.justifySelf?.default ) {
		defaultValue = __unstableUnitoneSupports?.justifySelf?.default;
	}

	return (
		<SelectControl
			label={ label }
			options={ justifySelfOptions }
			value={ unitone?.justifySelf }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					justifySelf: newAttribute || undefined,
				};
				if ( null == newUnitone.justifySelf ) {
					if ( null == defaultValue ) {
						delete newUnitone.justifySelf;
					} else {
						newUnitone.justifySelf = '';
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

export function saveJustifySelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.justifySelf' ) &&
		! attributes?.__unstableUnitoneSupports?.justifySelf
	) {
		delete attributes?.unitone?.justifySelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.justifySelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-justify-self:${ attributes.unitone?.justifySelf }`
	);

	return extraProps;
}

export function editJustifySelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveJustifySelfProp( props, settings, attributes );
	};

	return settings;
}
