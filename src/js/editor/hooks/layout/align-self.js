import classnames from 'classnames';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const alignSelfOptions = [
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

export function hasAlignSelfValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.alignSelf?.default
			? attributes?.__unstableUnitoneSupports?.alignSelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.alignSelf;

	return null != defaultValue
		? attributes?.unitone?.alignSelf !== defaultValue
		: attributes?.unitone?.alignSelf !== undefined;
}

export function resetAlignSelf( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.alignSelf;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.alignSelf?.default
			? attributes?.__unstableUnitoneSupports?.alignSelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.alignSelf;

	if ( null != defaultValue ) {
		newUnitone.alignSelf = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsAlignSelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.alignSelf' ) &&
		! __unstableUnitoneSupports?.alignSelf
	);
}

export function AlignSelfEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );
	if ( null != __unstableUnitoneSupports?.alignSelf?.default ) {
		defaultValue = __unstableUnitoneSupports?.alignSelf?.default;
	}

	return (
		<SelectControl
			label={ label }
			options={ alignSelfOptions }
			value={ unitone?.alignSelf }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignSelf: newAttribute || undefined,
				};
				if ( null == newUnitone.alignSelf ) {
					if ( null == defaultValue ) {
						delete newUnitone.alignSelf;
					} else {
						newUnitone.alignSelf = '';
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

export function saveAlignSelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.alignSelf' ) &&
		! attributes?.__unstableUnitoneSupports?.alignSelf
	) {
		delete attributes?.unitone?.alignSelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.alignSelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-align-self:${ attributes.unitone?.alignSelf }`
	);

	return extraProps;
}

export function editAlignSelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAlignSelfProp( props, settings, attributes );
	};

	return settings;
}
