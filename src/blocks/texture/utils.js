import { __ } from '@wordpress/i18n';

export const typeOptions = [
	{
		label: __( 'Dots', 'unitone' ),
		value: 'dots',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Offset dots', 'unitone' ),
		value: 'offset-dots',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Grid', 'unitone' ),
		value: 'grid',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Horizontal stripe', 'unitone' ),
		value: 'horizontal-stripe',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Vertical stripe', 'unitone' ),
		value: 'vertical-stripe',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Checker pattern', 'unitone' ),
		value: 'checker-pattern',
		settings: {
			color: true,
			gap: true,
		},
	},
	{
		label: __( 'Graph paper', 'unitone' ),
		value: 'graph-paper',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Slash', 'unitone' ),
		value: 'slash',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Backslash', 'unitone' ),
		value: 'backslash',
		settings: {
			color: true,
			gap: true,
			size: true,
		},
	},
	{
		label: __( 'Wave', 'unitone' ),
		value: 'wave',
		settings: {
			color: true,
			size: true,
			offset: true,
		},
	},
	{
		label: __( 'Solid color', 'unitone' ),
		value: 'solid-color',
		settings: {
			color: true,
			offset: true,
			radius: true,
		},
	},
	{
		label: __( 'Diagonal band', 'unitone' ),
		value: 'diagonal-band',
		settings: {
			color: true,
			bandSize: true,
		},
	},
];

export const getTextureTypeSettings = ( type ) =>
	typeOptions.find( ( option ) => option.value === type )?.settings || {};

export const isTextureSettingEnabled = ( type, settingKey ) =>
	getTextureTypeSettings( type )[ settingKey ] === true;

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
	bandSize,
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
		'bandSize'
	)
		? getPositiveUnitValue( bandSize?.top )
		: undefined,
	'--unitone--texture-band-bottom-size': isTextureSettingEnabled(
		type,
		'bandSize'
	)
		? getPositiveUnitValue( bandSize?.bottom )
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
		? getPositiveUnitValue( radius?.topLeft )
		: undefined,
	'--unitone--texture-border-top-right-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? getPositiveUnitValue( radius?.topRight )
		: undefined,
	'--unitone--texture-border-bottom-right-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? getPositiveUnitValue( radius?.bottomRight )
		: undefined,
	'--unitone--texture-border-bottom-left-radius': isTextureSettingEnabled(
		type,
		'radius'
	)
		? getPositiveUnitValue( radius?.bottomLeft )
		: undefined,
} );
