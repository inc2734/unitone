import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';
import { cleanEmptyObject, useDeviceType } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const alignSelfOptions = [
	{
		value: 'start',
		icon: alignTop,
		label: __( 'Align self top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align self center', 'unitone' ),
	},
	{
		value: 'end',
		icon: alignBottom,
		label: __( 'Align self bottom', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: alignStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.alignSelf.responsive' ) ||
		__unstableUnitoneSupports?.alignSelf?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.alignSelf?.default
		? __unstableUnitoneSupports?.alignSelf?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.alignSelf;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );

	return null != __unstableUnitoneSupports?.alignSelf?.default
		? __unstableUnitoneSupports?.alignSelf?.default
		: defaultValue;
}

export function hasAlignSelfValue( {
	name,
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.alignSelf ) &&
		undefined !== unitone?.alignSelf
	);
}

export function resetAlignSelfFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			alignSelf: undefined,
		},
	};
}

export function resetAlignSelf( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetAlignSelfFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsAlignSelfDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.alignSelf' ) &&
		! __unstableUnitoneSupports?.alignSelf
	);
}

export function AlignSelfToolbar( {
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	let defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	const onChangeAlignSelf = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: physicalToLogical( newValue || undefined ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: physicalToLogical( newValue || undefined ),
				md: unitone?.alignSelf?.md || undefined,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || undefined,
				md: physicalToLogical( newValue || undefined ),
				sm: unitone?.alignSelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || undefined,
				md: unitone?.alignSelf?.md || undefined,
				sm: physicalToLogical( newValue || undefined ),
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	let value = unitone?.alignSelf;
	let onChange = onChangeAlignSelf;
	if ( isResponsive ) {
		const fallbackValue = typeof value === 'string' ? value : undefined;
		if ( 'desktop' === deviceType ) {
			value = value?.lg || fallbackValue;
			defaultValue = defaultValue?.lg;
			onChange = onChangeAlignSelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md || value?.lg || fallbackValue;
			defaultValue = defaultValue?.md || defaultValue?.lg;
			onChange = onChangeAlignSelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm || value?.md || value?.lg || fallbackValue;
			defaultValue =
				defaultValue?.sm || defaultValue?.md || defaultValue?.lg;
			onChange = onChangeAlignSelfSm;
		}
	}

	return (
		<BlockVerticalAlignmentToolbar
			controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
			value={ logicalToPhysical( value ?? defaultValue, 'vertical' ) }
			onChange={ onChange }
		/>
	);
}

export function getAlignSelfEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.alignSelf?.label ||
		__( 'Align self', 'unitone' )
	);
}

export function AlignSelfEdit( {
	label,
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const fallbackValue =
		typeof unitone?.alignSelf === 'string' ? unitone?.alignSelf : undefined;

	const onChangeAlignSelf = ( newValue ) => {
		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: newValue || undefined,
		} );

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: newValue || undefined,
				md: unitone?.alignSelf?.md || undefined,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || fallbackValue || undefined,
				md: newValue || undefined,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || fallbackValue || undefined,
				md: unitone?.alignSelf?.md || undefined,
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
							( unitone?.alignSelf?.lg || fallbackValue ) ??
							defaultValue?.lg
						}
						onChange={ onChangeAlignSelfLg }
					>
						{ alignSelfOptions.map(
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
							( unitone?.alignSelf?.md ||
								unitone?.alignSelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.md || defaultValue?.lg )
						}
						onChange={ onChangeAlignSelfMd }
					>
						{ alignSelfOptions.map(
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
							( unitone?.alignSelf?.sm ||
								unitone?.alignSelf?.md ||
								unitone?.alignSelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.sm ||
								defaultValue?.md ||
								defaultValue?.lg )
						}
						onChange={ onChangeAlignSelfSm }
					>
						{ alignSelfOptions.map(
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
				value={ unitone?.alignSelf ?? defaultValue }
				onChange={ onChangeAlignSelf }
			>
				{ alignSelfOptions.map(
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

export function saveAlignSelfProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.alignSelf' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.alignSelf ) {
			return extraProps;
		}
	}

	const defaultValue = getDefaultValue( {
		name: blockType,
		__unstableUnitoneSupports: attributes?.__unstableUnitoneSupports,
	} );

	if ( null == attributes?.unitone?.alignSelf ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				alignSelf: defaultValue,
			},
		};
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-align-self:${ attributes.unitone?.alignSelf }` ]:
				typeof attributes.unitone?.alignSelf === 'string',
			[ `-align-self:${ attributes.unitone?.alignSelf.lg }` ]:
				null != attributes.unitone?.alignSelf?.lg,
			[ `-align-self:md:${ attributes.unitone?.alignSelf?.md }` ]:
				null != attributes.unitone?.alignSelf?.md,
			[ `-align-self:sm:${ attributes.unitone?.alignSelf?.sm }` ]:
				null != attributes.unitone?.alignSelf?.sm,
		}
	);

	return extraProps;
}

export function useAlignSelfBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveAlignSelfProp( wrapperProps, name, attributes ),
		},
	};
}
