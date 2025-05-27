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
import { __ } from '@wordpress/i18n';
import { settings as settingsIcon } from '@wordpress/icons';

import { cleanEmptyObject } from '../utils';

export function hasMaxWidthValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

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

export function useIsMaxWidthDisabled( {
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
						__next40pxDefaultSize
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
						__next40pxDefaultSize
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

export function useMaxWidthBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.maxWidth' ) ) {
		if ( ! __unstableUnitoneSupports?.maxWidth ) {
			return settings;
		}
	}

	const newMaxWidth = attributes?.unitone?.maxWidth;

	if ( null == newMaxWidth ) {
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
