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

// import { getGlobalStyleCssVar, isValueGlobalStyle } from '../utils';

export function hasMaxWidthValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

	return null != defaultValue
		? attributes?.unitone?.maxWidth !== defaultValue
		: attributes?.unitone?.maxWidth !== undefined;
}

export function resetMaxWidth( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.maxWidth;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxWidth;

	if ( null != defaultValue ) {
		newUnitone.maxWidth = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMaxWidthDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.maxWidth' ) &&
		! __unstableUnitoneSupports?.maxWidth
	);
}

export function getMaxWidthEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.maxWidth?.label ||
		__( 'Max width', 'unitone' )
	);
}

export function MaxWidthEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxWidth;
	}, [] );

	const isPresetValue = [
		'var(--wp--custom--container-max-width)',
		'var(--wp--custom--content-max-width)',
	].includes( unitone?.maxWidth );

	const [ showCustomValueControl, setShowCustomValueControl ] = useState(
		! isPresetValue
	);

	const onChangeMaxWidth = ( newValue ) => {
		const newUnitone = {
			...unitone,
			maxWidth: newValue || undefined,
		};
		if ( null == newUnitone.maxWidth ) {
			if ( null == defaultValue ) {
				delete newUnitone.maxWidth;
			} else {
				newUnitone.maxWidth = '';
			}
		}

		setAttributes( {
			unitone: !! Object.keys( newUnitone ).length
				? newUnitone
				: undefined,
		} );
	};

	return (
		<BaseControl
			className="unitone-width-control"
			label={ label }
			id="unitone-max-width-control"
		>
			<HStack>
				{ ! showCustomValueControl ? (
					<ToggleGroupControl
						value={ unitone?.maxWidth || '' }
						isBlock
						onChange={ onChangeMaxWidth }
					>
						<ToggleGroupControlOption
							value="var(--wp--custom--container-max-width)"
							label={ __( 'Wide', 'unitone' ) }
						/>
						<ToggleGroupControlOption
							value="var(--wp--custom--content-max-width)"
							label={ __( 'Content Width', 'unitone' ) }
						/>
					</ToggleGroupControl>
				) : (
					<TextControl
						id="unitone-max-width-control"
						value={ unitone?.maxWidth || '' }
						onChange={ onChangeMaxWidth }
					/>
				) }

				<Button
					label={
						showCustomValueControl
							? __( 'Use size preset' )
							: __( 'Set custom size' )
					}
					icon={ settingsIcon }
					onClick={ () => {
						onChangeMaxWidth(
							! isPresetValue
								? 'var(--wp--custom--container-max-width)'
								: unitone?.maxWidth
						);

						setShowCustomValueControl( ! showCustomValueControl );
					} }
					isPressed={ showCustomValueControl }
					size="small"
					iconSize={ 24 }
				/>
			</HStack>
		</BaseControl>
	);
}

export function saveMaxWidthProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.maxWidth' ) &&
		! attributes?.__unstableUnitoneSupports?.maxWidth
	) {
		delete attributes?.unitone?.maxWidth;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.maxWidth ) {
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

	extraProps.style = {
		...extraProps.style,
		'--unitone--max-width': attributes?.unitone?.maxWidth,
	};

	return extraProps;
}

export function editMaxWidthProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMaxWidthProp( props, settings, attributes );
	};

	return settings;
}
