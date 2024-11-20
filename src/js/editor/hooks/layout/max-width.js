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
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { settings as settingsIcon } from '@wordpress/icons';
import { cleanEmptyObject } from '../utils';

export function hasMaxWidthValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

	return (
		defaultValue !== unitone?.maxWidth && undefined !== unitone?.maxWidth
	);
}

export function resetMaxWidthFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			maxWidth: undefined,
		},
	};
}

export function resetMaxWidth( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMaxWidthFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMaxWidthDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.maxWidth' ) &&
		! __unstableUnitoneSupports?.maxWidth
	);
}

export function getMaxWidthEditLabel( {
	__unstableUnitoneSupports,
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

export function MaxWidthEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxWidth;
	}, [] );

	const isPresetValue = [
		'var(--wp--style--global--wide-size)',
		'var(--wp--style--global--content-size)',
	].includes( unitone?.maxWidth );

	const onChangeMaxWidth = ( newValue ) => {
		const newUnitone = {
			...unitone,
			maxWidth: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
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
				{ isPresetValue ? (
					<ToggleGroupControl
						__nextHasNoMarginBottom
						value={ unitone?.maxWidth ?? defaultValue ?? '' }
						isBlock
						onChange={ onChangeMaxWidth }
					>
						<ToggleGroupControlOption
							value="var(--wp--style--global--wide-size)"
							label={ __( 'Wide', 'unitone' ) }
						/>
						<ToggleGroupControlOption
							value="var(--wp--style--global--content-size)"
							label={ __( 'Content Width', 'unitone' ) }
						/>
					</ToggleGroupControl>
				) : (
					<TextControl
						__nextHasNoMarginBottom
						id="unitone-max-width-control"
						value={ unitone?.maxWidth ?? defaultValue ?? '' }
						onChange={ onChangeMaxWidth }
					/>
				) }

				<Button
					label={
						! isPresetValue
							? __( 'Use size preset' )
							: __( 'Set custom size' )
					}
					icon={ settingsIcon }
					onClick={ () => {
						onChangeMaxWidth(
							! isPresetValue
								? 'var(--wp--style--global--wide-size)'
								: ''
						);
					} }
					isPressed={ ! isPresetValue }
					size="small"
					iconSize={ 24 }
				/>
			</HStack>
		</BaseControl>
	);
}

export function saveMaxWidthProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.maxWidth' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.maxWidth ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.maxWidth ) {
		return extraProps;
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--max-width': attributes?.unitone?.maxWidth,
		};
		return extraProps;
	}

	return {
		...extraProps,
		style: {
			...extraProps?.style,
			'--unitone--max-width': attributes?.unitone?.maxWidth,
		},
	};
}

export function useMaxWidthBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.maxWidth;
		},
		[ name ]
	);

	const newMaxWidthProp = useMemo( () => {
		return saveMaxWidthProp( wrapperProps, name, {
			__unstableUnitoneSupports,
			unitone: {
				maxWidth: attributes?.unitone?.maxWidth ?? defaultValue,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMaxWidthProp,
		},
	};
}
