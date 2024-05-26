import classnames from 'classnames';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { physicalToLogical, logicalToPhysical } from '../../../helper';

const justifySelfOptions = [
	{
		value: 'start',
		icon: justifyLeft,
		label: __( 'Justify self left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify self center', 'unitone' ),
	},
	{
		value: 'end',
		icon: justifyRight,
		label: __( 'Justify self right', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: justifyStretch,
		label: __( 'Stretch to fill', 'unitone' ),
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

export function JustifySelfToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );

	return (
		<JustifyToolbar
			allowedControls={ justifySelfOptions.map( ( option ) =>
				logicalToPhysical( option.value )
			) }
			value={ logicalToPhysical( unitone?.justifySelf ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					justifySelf: physicalToLogical( newAttribute ),
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
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.justifySelf }
				onChange={ ( value ) => {
					const newUnitone = {
						...unitone,
						justifySelf: value || undefined,
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
			>
				{ justifySelfOptions.map(
					( { value, icon, label: iconLabel } ) => (
						<ToggleGroupControlOptionIcon
							key={ value }
							icon={ icon }
							label={ iconLabel }
							value={ value }
						/>
					)
				) }
			</ToggleGroupControl>
		</fieldset>
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
