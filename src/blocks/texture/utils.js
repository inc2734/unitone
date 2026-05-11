import { __ } from '@wordpress/i18n';

export const typeOptions = [
	{
		label: __( 'Dots', 'unitone' ),
		value: 'dots',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Offset dots', 'unitone' ),
		value: 'offset-dots',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Grid', 'unitone' ),
		value: 'grid',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Horizontal stripe', 'unitone' ),
		value: 'horizontal-stripe',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Vertical stripe', 'unitone' ),
		value: 'vertical-stripe',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Checker pattern', 'unitone' ),
		value: 'checker-pattern',
		default: {
			gap: 50,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
		},
	},
	{
		label: __( 'Graph paper', 'unitone' ),
		value: 'graph-paper',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Slash', 'unitone' ),
		value: 'slash',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			size: true,
			offset: true,
			radius: true,
		},
	},
	{
		label: __( 'Backslash', 'unitone' ),
		value: 'backslash',
		default: {
			gap: 50,
			size: 1,
		},
		settings: {
			color: true,
			gap: true,
			offset: true,
			radius: true,
			size: true,
		},
	},
	{
		label: __( 'Wave', 'unitone' ),
		value: 'wave',
		default: {
			size: 1,
			offset: {
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			},
		},
		settings: {
			color: true,
			offset: true,
			size: true,
		},
	},
	{
		label: __( 'Solid color', 'unitone' ),
		value: 'solid-color',
		default: {
			offset: {
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			},
			radius: {
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			},
		},
		settings: {
			color: true,
			offset: true,
			radius: true,
		},
	},
	{
		label: __( 'Slash shape', 'unitone' ),
		value: 'slash-shape',
		default: {
			shapeSize: {
				top: '25%',
				bottom: '25%',
			},
		},
		settings: {
			color: true,
			shapeSize: true,
		},
	},
	{
		label: __( 'Backslash shape', 'unitone' ),
		value: 'backslash-shape',
		default: {
			shapeSize: {
				top: '25%',
				bottom: '25%',
			},
		},
		settings: {
			color: true,
			shapeSize: true,
		},
	},
];

export const getTextureTypeSettings = ( type ) =>
	typeOptions.find( ( option ) => option.value === type )?.settings || {};

export const isTextureSettingEnabled = ( type, settingKey ) =>
	getTextureTypeSettings( type )[ settingKey ] === true;

const getResetAttributes = () =>
	Object.fromEntries(
		[
			...new Set(
				typeOptions.flatMap( ( { settings } ) =>
					Object.keys( settings ).filter(
						( settingKey ) => 'color' !== settingKey
					)
				)
			),
		].map( ( settingKey ) => [ settingKey, undefined ] )
	);

export const getTextureTypeDefaultAttributes = ( type ) => ( {
	...getResetAttributes(),
	...typeOptions.find( ( option ) => option.value === type )?.default,
} );

const getPresetOrCustomColor = ( color, customColor ) => {
	if ( !! color ) {
		return `var(--wp--preset--color--${ color })`;
	}

	return customColor;
};

const getPixelValue = ( value ) => {
	if ( ! value ) {
		return undefined;
	}

	return `${ value }px`;
};

const getPositiveUnitValue = ( value ) => {
	if ( ! value || 0 >= parseInt( value ) ) {
		return undefined;
	}

	return value;
};

export const getTextureStyle = ( {
	type,
	color,
	customColor,
	gap,
	size,
	shapeSize,
	offset,
	radius,
} ) => ( {
	'--unitone--texture-color': isTextureSettingEnabled( type, 'color' )
		? getPresetOrCustomColor( color, customColor )
		: undefined,
	'--unitone--texture-gap': isTextureSettingEnabled( type, 'gap' )
		? getPixelValue( gap )
		: undefined,
	'--unitone--texture-size': isTextureSettingEnabled( type, 'size' )
		? getPixelValue( size )
		: undefined,
	'--unitone--texture-band-top-size': isTextureSettingEnabled(
		type,
		'shapeSize'
	)
		? shapeSize?.top
		: undefined,
	'--unitone--texture-band-bottom-size': isTextureSettingEnabled(
		type,
		'shapeSize'
	)
		? shapeSize?.bottom
		: undefined,
	'--unitone--texture-top': isTextureSettingEnabled( type, 'offset' )
		? getPositiveUnitValue( offset?.top )
		: undefined,
	'--unitone--texture-right': isTextureSettingEnabled( type, 'offset' )
		? getPositiveUnitValue( offset?.right )
		: undefined,
	'--unitone--texture-bottom': isTextureSettingEnabled( type, 'offset' )
		? getPositiveUnitValue( offset?.bottom )
		: undefined,
	'--unitone--texture-left': isTextureSettingEnabled( type, 'offset' )
		? getPositiveUnitValue( offset?.left )
		: undefined,
	'--unitone--texture-border-top-left-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? radius?.topLeft
		: undefined,
	'--unitone--texture-border-top-right-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? radius?.topRight
		: undefined,
	'--unitone--texture-border-bottom-right-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? radius?.bottomRight
		: undefined,
	'--unitone--texture-border-bottom-left-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? radius?.bottomLeft
		: undefined,
} );
