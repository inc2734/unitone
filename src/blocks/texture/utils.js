import { __ } from '@wordpress/i18n';

import { getPresetCssVarFromSlug } from '../../js/utils/preset';

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
			shapePoints: {
				topLeft: '75%',
				bottomLeft: '100%',
				topRight: '0%',
				bottomRight: '25%',
			},
		},
		settings: {
			color: true,
			shapeSize: true,
			shapePoints: true,
		},
	},
	{
		label: __( 'Backslash shape', 'unitone' ),
		value: 'backslash-shape',
		default: {
			shapePoints: {
				topLeft: '0%',
				bottomLeft: '25%',
				topRight: '75%',
				bottomRight: '100%',
			},
		},
		settings: {
			color: true,
			shapeSize: true,
			shapePoints: true,
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

const getPresetOrCustomColor = ( color, customColor, normalizePresets ) => {
	if ( !! color ) {
		return normalizePresets
			? getPresetCssVarFromSlug( 'color', color )
			: `var(--wp--preset--color--${ color })`;
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

const getShapePointValue = ( value, fallback ) =>
	'string' === typeof value && value.trim() ? value : fallback;

export const legacyShapeSizeDefaults = { top: '25%', bottom: '25%' };

const getTopPositionFromBottomSize = ( bottomSize, fallback ) => {
	const value = 'string' === typeof bottomSize ? bottomSize.trim() : '';
	const percentage = /^(\d*\.?\d+)%$/.exec( value );

	if ( percentage ) {
		const position = 100 - Number( percentage[ 1 ] );
		return 0 <= position ? `${ position }%` : fallback;
	}

	if ( /^0(?:\.0+)?(?:[a-z]+)?$/i.test( value ) ) {
		return '100%';
	}

	return fallback;
};

export const getShapePoints = ( type, shapePoints ) => {
	if ( ! shapePoints || ! isTextureSettingEnabled( type, 'shapePoints' ) ) {
		return undefined;
	}

	const defaults = typeOptions.find( ( option ) => option.value === type )
		.default.shapePoints;
	return {
		topLeft: getShapePointValue( shapePoints?.topLeft, defaults.topLeft ),
		bottomLeft: getShapePointValue(
			shapePoints?.bottomLeft,
			defaults.bottomLeft
		),
		topRight: getShapePointValue(
			shapePoints?.topRight,
			defaults.topRight
		),
		bottomRight: getShapePointValue(
			shapePoints?.bottomRight,
			defaults.bottomRight
		),
	};
};

export const getShapePointsFromShapeSize = ( type, shapeSize ) => {
	const top = shapeSize?.top || legacyShapeSizeDefaults.top;
	const bottom = shapeSize?.bottom || legacyShapeSizeDefaults.bottom;
	const defaults = typeOptions.find( ( option ) => option.value === type )
		?.default?.shapePoints;

	if ( 'slash-shape' === type ) {
		return {
			topLeft: getTopPositionFromBottomSize( bottom, defaults.topLeft ),
			bottomLeft: defaults.bottomLeft,
			topRight: defaults.topRight,
			bottomRight: top,
		};
	}

	if ( 'backslash-shape' === type ) {
		return {
			topLeft: defaults.topLeft,
			bottomLeft: defaults.bottomLeft,
			topRight: getTopPositionFromBottomSize( bottom, defaults.topRight ),
			bottomRight: defaults.bottomRight,
		};
	}

	return undefined;
};

// Keep the default output stable for save() and normalize only editor previews.
export const getTextureStyle = ( {
	normalizePresets = false,
	type,
	color,
	customColor,
	gap,
	size,
	shapeSize,
	shapePoints,
	offset,
	radius,
} ) => {
	const points = getShapePoints( type, shapePoints );

	return {
		'--unitone--texture-color': isTextureSettingEnabled( type, 'color' )
			? getPresetOrCustomColor( color, customColor, normalizePresets )
			: undefined,
		'--unitone--texture-gap': isTextureSettingEnabled( type, 'gap' )
			? getPixelValue( gap )
			: undefined,
		'--unitone--texture-size': isTextureSettingEnabled( type, 'size' )
			? getPixelValue( size )
			: undefined,
		'--unitone--texture-band-top-size':
			isTextureSettingEnabled( type, 'shapeSize' ) && ! points
				? shapeSize?.top
				: undefined,
		'--unitone--texture-band-bottom-size':
			isTextureSettingEnabled( type, 'shapeSize' ) && ! points
				? shapeSize?.bottom
				: undefined,
		'--unitone--texture-shape-top-left-y': points
			? points.topLeft
			: undefined,
		'--unitone--texture-shape-bottom-left-y': points
			? points.bottomLeft
			: undefined,
		'--unitone--texture-shape-top-right-y': points
			? points.topRight
			: undefined,
		'--unitone--texture-shape-bottom-right-y': points
			? points.bottomRight
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
		'--unitone--texture-border-bottom-right-radius':
			isTextureSettingEnabled( type, 'radius' )
				? radius?.bottomRight
				: undefined,
		'--unitone--texture-border-bottom-left-radius': isTextureSettingEnabled(
			type,
			'radius'
		)
			? radius?.bottomLeft
			: undefined,
	};
};
