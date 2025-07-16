import {
	BaseControl,
	Button,
	SelectControl,
	__experimentalUnitControl as BaseUnitControl,
} from '@wordpress/components';

import { useSettings } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const UnitControl = ( { label, value, onChange } ) => {
	return (
		<div>
			<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
			<div
				style={ {
					display: 'flex',
					gap: '8px',
					alignItems: 'center',
				} }
			>
				<BaseUnitControl
					__next40pxDefaultSize
					value={ value || '' }
					style={ { width: '100%' } }
					onChange={ onChange }
				/>

				<Button
					variant="secondary"
					size="small"
					onClick={ () => onChange( undefined ) }
				>
					{ __( 'Reset', 'unitone' ) }
				</Button>
			</div>
		</div>
	);
};

export const FontFamilyControl = ( { value, onChange } ) => {
	const [ fontFamilies ] = useSettings( 'typography.fontFamilies' );
	const allFontFamilies = useMemo(
		() =>
			Object.values( fontFamilies ?? {} ).flatMap( ( group ) =>
				Array.isArray( group ) ? group : []
			),
		[ fontFamilies ]
	);

	return (
		<div>
			<BaseControl.VisualLabel>
				{ __( 'Font', 'unitone' ) }
			</BaseControl.VisualLabel>
			<div
				style={ {
					display: 'flex',
					gap: '8px',
					alignItems: 'center',
				} }
			>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					value={ value || '' }
					options={ [
						...[
							{
								label: __( 'Default', 'unitone' ),
								value: '',
							},
						],
						...allFontFamilies?.map( ( fontFamily ) => ( {
							label: fontFamily.name,
							value: fontFamily.slug,
						} ) ),
					] }
					onChange={ onChange }
				/>

				<Button
					variant="secondary"
					size="small"
					onClick={ () => onChange( undefined ) }
				>
					{ __( 'Reset', 'unitone' ) }
				</Button>
			</div>
		</div>
	);
};
