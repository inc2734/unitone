import {
	BaseControl,
	Button,
	TextControl,
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { settings as settingsIcon } from '@wordpress/icons';

import {
	cleanEmptyObject,
	normalizeForToggleGroupControl,
	normalizeForTextControl,
} from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.maxWidth;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxWidth;
	}, [] );

	return defaultValue;
}

export function hasMaxWidthValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.maxWidth && undefined !== unitone?.maxWidth
	);
}

export function resetMaxWidthFilter() {
	return {
		maxWidth: undefined,
	};
}

export function resetMaxWidth( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetMaxWidthFilter() )
		),
	} );
}

export function isMaxWidthSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.maxWidth' ) &&
		! __unstableUnitoneSupports?.maxWidth
	);
}

export function getMaxWidthEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Max width', 'unitone' );
	const defaultCode = <code>max-width</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.maxWidth?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.maxWidth?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.maxWidth?.code || defaultCode }
		</>
	);
}

export function MaxWidthEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );
	const currentValue = unitone?.maxWidth ?? defaultValue ?? '';
	const isPresetValue = [
		'var(--wp--style--global--wide-size)',
		'var(--wp--style--global--content-size)',
	].includes( currentValue );

	const [ isCustomMode, setIsCustomMode ] = useState( ! isPresetValue );

	const isCustomControl = ! isPresetValue || isCustomMode;
	const customValue =
		isCustomMode && undefined === unitone?.maxWidth ? '' : currentValue;

	const onChangeMaxWidth = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				maxWidth: newValue || undefined,
			} ),
		} );
	};

	return (
		<BaseControl
			__nextHasNoMarginBottom
			className="unitone-width-control"
			label={ label }
			id="unitone-max-width-control"
		>
			<HStack>
				{ ! isCustomControl ? (
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						value={ normalizeForToggleGroupControl( currentValue ) }
						isBlock
						onChange={ ( newValue ) => {
							setIsCustomMode( false );
							onChangeMaxWidth(
								normalizeForToggleGroupControl( newValue )
							);
						} }
					>
						<ToggleGroupControlOption
							value="var(--wp--style--global--wide-size)"
							label={ __( 'Wide Width', 'unitone' ) }
						/>
						<ToggleGroupControlOption
							value="var(--wp--style--global--content-size)"
							label={ __( 'Content Width', 'unitone' ) }
						/>
					</ToggleGroupControl>
				) : (
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						id="unitone-max-width-control"
						value={ normalizeForTextControl( customValue ) }
						onChange={ ( newValue ) =>
							onChangeMaxWidth(
								normalizeForTextControl( newValue )
							)
						}
					/>
				) }

				<Button
					label={
						isCustomControl
							? __( 'Use size preset' )
							: __( 'Set custom size' )
					}
					icon={ settingsIcon }
					onClick={ () => {
						if ( isCustomControl ) {
							setIsCustomMode( false );
							onChangeMaxWidth(
								'var(--wp--style--global--wide-size)'
							);
						} else {
							setIsCustomMode( true );
							onChangeMaxWidth( undefined );
						}
					} }
					isPressed={ isCustomControl }
					size="small"
					iconSize={ 24 }
				/>
			</HStack>
		</BaseControl>
	);
}

export function withMaxWidthBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isMaxWidthSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newMaxWidth = attributes?.unitone?.maxWidth ?? defaultValue ?? '';

	if ( '' === newMaxWidth ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--max-width': newMaxWidth,
			},
		},
	};
}
