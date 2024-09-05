import classnames from 'classnames';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

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
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { cleanEmptyObject, useDeviceType } from '../utils';
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

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.justifySelf.responsive' ) ||
		__unstableUnitoneSupports?.justifySelf?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.justifySelf;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );

	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: defaultValue;
}

export function hasJustifySelfValue( {
	name,
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.justifySelf ) &&
		undefined !== unitone?.justifySelf
	);
}

export function resetJustifySelfFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			justifySelf: undefined,
		},
	};
}

export function resetJustifySelf( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifySelfFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifySelfDisabled( {
	name,
	__unstableUnitoneSupports,
} ) {
	return (
		! hasBlockSupport( name, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function JustifySelfToolbar( {
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	let defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	const onChangeJustifySelf = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: physicalToLogical( newValue || undefined ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: physicalToLogical( newValue || undefined ),
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: physicalToLogical( newValue || undefined ),
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: physicalToLogical( newValue || undefined ),
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	let value = unitone?.justifySelf;
	let onChange = onChangeJustifySelf;
	if ( isResponsive ) {
		const fallbackValue = typeof value === 'string' ? value : undefined;
		if ( 'desktop' === deviceType ) {
			value = value?.lg || fallbackValue;
			defaultValue = defaultValue?.lg;
			onChange = onChangeJustifySelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md || value?.lg || fallbackValue;
			defaultValue = defaultValue?.md || defaultValue?.lg;
			onChange = onChangeJustifySelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm || value?.md || value?.lg || fallbackValue;
			defaultValue =
				defaultValue?.sm || defaultValue?.md || defaultValue?.lg;
			onChange = onChangeJustifySelfSm;
		}
	}

	return (
		<JustifyToolbar
			allowedControls={ justifySelfOptions.map( ( option ) =>
				logicalToPhysical( option.value )
			) }
			value={ logicalToPhysical( value ?? defaultValue ) }
			onChange={ onChange }
		/>
	);
}

export function getJustifySelfEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.justifySelf?.label ||
		__( 'Justify self', 'unitone' )
	);
}

export function JustifySelfEdit( {
	label,
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const fallbackValue =
		typeof unitone?.justifySelf === 'string'
			? unitone?.justifySelf
			: undefined;

	const onChangeJustifySelf = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: newValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: newValue || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: newValue || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.lg || fallbackValue ) ??
							defaultValue?.lg
						}
						onChange={ onChangeJustifySelfLg }
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
			) }
			tabletControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.md ||
								unitone?.justifySelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.md || defaultValue?.lg )
						}
						onChange={ onChangeJustifySelfMd }
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
			) }
			mobileControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.sm ||
								unitone?.justifySelf?.md ||
								unitone?.justifySelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.sm ||
								defaultValue?.md ||
								defaultValue?.lg )
						}
						onChange={ onChangeJustifySelfSm }
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
			) }
		/>
	) : (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.justifySelf }
				onChange={ onChangeJustifySelf }
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
	if ( ! hasBlockSupport( blockType, 'unitone.justifySelf' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.justifySelf ) {
			return extraProps;
		}
	}

	const defaultValue = getDefaultValue( {
		name: blockType,
		__unstableUnitoneSupports: attributes?.__unstableUnitoneSupports,
	} );

	if ( null == attributes?.unitone?.justifySelf ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				justifySelf: defaultValue,
			},
		};
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-justify-self:${ attributes.unitone?.justifySelf }` ]:
				typeof attributes.unitone?.justifySelf === 'string',
			[ `-justify-self:${ attributes.unitone?.justifySelf.lg }` ]:
				null != attributes.unitone?.justifySelf?.lg,
			[ `-justify-self:md:${ attributes.unitone?.justifySelf?.md }` ]:
				null != attributes.unitone?.justifySelf?.md,
			[ `-justify-self:sm:${ attributes.unitone?.justifySelf?.sm }` ]:
				null != attributes.unitone?.justifySelf?.sm,
		}
	);

	return extraProps;
}

export function useJustifySelfBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveJustifySelfProp( wrapperProps, name, attributes ),
		},
	};
}
