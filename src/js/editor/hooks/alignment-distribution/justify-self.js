import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	mergeObjectWithDefaultValue,
	useDeviceType,
	normalizeForToggleGroupControl,
} from '../utils';

import { ResponsiveSettingsContainer } from '../components';
import { auto } from '../icons';

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
	{
		value: 'auto',
		icon: auto,
		label: __( 'Auto', 'unitone' ),
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
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifySelf;
	const unstableDefaultValue =
		__unstableUnitoneSupports?.justifySelf?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );
	const unstableDefaultValue =
		__unstableUnitoneSupports?.justifySelf?.default;
	return unstableDefaultValue ?? defaultValue;
}

export function hasJustifySelfValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.justifySelf ) &&
		undefined !== unitone?.justifySelf
	);
}

export function resetJustifySelfFilter() {
	return {
		justifySelf: undefined,
	};
}

export function resetJustifySelf( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetJustifySelfFilter() )
		),
	} );
}

export function isJustifySelfSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function JustifySelfToolbar( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	let defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const primitiveValue =
		typeof unitone?.justifySelf === 'string'
			? unitone?.justifySelf
			: undefined;

	const onChangeJustifySelf = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf:
					newValue !== unitone?.justifySelf ? newValue : undefined,
			} ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg:
						newValue !== unitone?.justifySelf?.lg
							? newValue
							: undefined,
					md: unitone?.justifySelf?.md,
					sm: unitone?.justifySelf?.sm,
				},
			} ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg: unitone?.justifySelf?.lg ?? primitiveValue,
					md:
						newValue !== unitone?.justifySelf?.md
							? newValue
							: undefined,
					sm: unitone?.justifySelf?.sm,
				},
			} ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg: unitone?.justifySelf?.lg ?? primitiveValue,
					md: unitone?.justifySelf?.md,
					sm:
						newValue !== unitone?.justifySelf?.sm
							? newValue
							: undefined,
				},
			} ),
		} );
	};

	let value = unitone?.justifySelf;
	let onChange = onChangeJustifySelf;
	if ( isResponsive ) {
		if ( 'desktop' === deviceType ) {
			value = value?.lg ?? primitiveValue;
			defaultValue = defaultValue?.lg;
			onChange = onChangeJustifySelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md ?? value?.lg ?? primitiveValue;
			defaultValue = defaultValue?.md ?? defaultValue?.lg;
			onChange = onChangeJustifySelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm ?? value?.md ?? value?.lg ?? primitiveValue;
			defaultValue =
				defaultValue?.sm ?? defaultValue?.md ?? defaultValue?.lg;
			onChange = onChangeJustifySelfSm;
		}
	}

	return (
		<ToolbarDropdownMenu
			label={ __( 'Justify self', 'unitone' ) }
			icon={
				justifySelfOptions.filter(
					( option ) => option.value === ( value ?? defaultValue )
				)?.[ 0 ]?.icon ?? justifySelfOptions[ 0 ]?.icon
			}
			controls={ justifySelfOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive: option.value === ( value ?? defaultValue ),
				onClick: () => onChange( option.value ),
			} ) ) }
		/>
	);
}

export function getJustifySelfEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Justify self', 'unitone' );
	const defaultCode = (
		<code className="unitone-label-code">justify-self</code>
	);

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.justifySelf?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.justifySelf?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.justifySelf?.code || defaultCode }
		</>
	);
}

export function JustifySelfEdit( {
	label,
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const primitiveValue =
		typeof unitone?.justifySelf === 'string'
			? unitone?.justifySelf
			: undefined;

	const onChangeJustifySelf = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf:
					newValue !== unitone?.justifySelf ? newValue : undefined,
			} ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg:
						newValue !== unitone?.justifySelf?.lg
							? newValue
							: undefined,
					md: unitone?.justifySelf?.md,
					sm: unitone?.justifySelf?.sm,
				},
			} ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg: unitone?.justifySelf?.lg ?? primitiveValue,
					md:
						newValue !== unitone?.justifySelf?.md
							? newValue
							: undefined,
					sm: unitone?.justifySelf?.sm,
				},
			} ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				justifySelf: {
					lg: unitone?.justifySelf?.lg ?? primitiveValue,
					md: unitone?.justifySelf?.md,
					sm:
						newValue !== unitone?.justifySelf?.sm
							? newValue
							: undefined,
				},
			} ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.justifySelf?.lg ??
								primitiveValue ??
								defaultValue?.lg
						) }
						isDeselectable={ ! defaultValue?.lg }
						onChange={ ( newValue ) =>
							onChangeJustifySelfLg(
								normalizeForToggleGroupControl( newValue )
							)
						}
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.justifySelf?.md ??
								unitone?.justifySelf?.lg ??
								primitiveValue ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						isDeselectable={ false }
						onChange={ ( newValue ) =>
							onChangeJustifySelfMd(
								normalizeForToggleGroupControl( newValue )
							)
						}
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.justifySelf?.sm ??
								unitone?.justifySelf?.md ??
								unitone?.justifySelf?.lg ??
								primitiveValue ??
								defaultValue?.sm ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						isDeselectable={ false }
						onChange={ ( newValue ) =>
							onChangeJustifySelfSm(
								normalizeForToggleGroupControl( newValue )
							)
						}
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
		<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ normalizeForToggleGroupControl(
					unitone?.justifySelf ?? defaultValue
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) =>
					onChangeJustifySelf(
						normalizeForToggleGroupControl( newValue )
					)
				}
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

export function withJustifySelfBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isJustifySelfSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newJustifySelf = mergeObjectWithDefaultValue(
		attributes?.unitone?.justifySelf,
		defaultValue
	);

	if ( null == newJustifySelf ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-justify-self:${ newJustifySelf }` ]:
						typeof newJustifySelf === 'string',
					[ `-justify-self:${ newJustifySelf.lg }` ]:
						null != newJustifySelf?.lg,
					[ `-justify-self:md:${ newJustifySelf?.md }` ]:
						null != newJustifySelf?.md,
					[ `-justify-self:sm:${ newJustifySelf?.sm }` ]:
						null != newJustifySelf?.sm,
				}
			),
		},
	};
}
