/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */

import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	isObject,
	mergeObjectWithDefaultValue,
} from '../utils';

import { PaddingControl, isDefaultSpacingSizeValue } from '../components';

function isPresetSpacingValue( value ) {
	return 'string' === typeof value && value.startsWith( 'var:preset|' );
}

function getPresetCssVar( value ) {
	if ( ! isPresetSpacingValue( value ) ) {
		return value;
	}

	const [ , type, slug ] = value.split( '|' );

	return `var(--wp--preset--${ type }--${ slug })`;
}

function isCustomSpacingSizeValue( value ) {
	return (
		null != value &&
		'' !== value &&
		! isObject( value ) &&
		! isDefaultSpacingSizeValue( value )
	);
}

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.padding;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.padding;
	}, [] );

	return defaultValue;
}

export function hasPaddingValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return defaultValue !== unitone?.padding && undefined !== unitone?.padding;
}

export function resetPaddingFilter() {
	return {
		padding: undefined,
	};
}

export function resetPadding( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetPaddingFilter() )
		),
	} );
}

export function isPaddingSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.padding' );
}

export function getPaddingEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Padding', 'unitone' );
	const defaultCode = <code className="unitone-label-code">padding</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.padding?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.padding?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.padding?.code || defaultCode }
		</>
	);
}

const paddingSides = [ 'top', 'right', 'bottom', 'left' ];

function getTargetSides( split ) {
	if ( Array.isArray( split ) ) {
		return split.filter( ( side ) => paddingSides.includes( side ) );
	}

	return paddingSides;
}

export function compacting(
	attribute,
	defaultValue = undefined,
	targetSides = paddingSides
) {
	if ( 0 === attribute ) {
		return 0;
	}

	if ( null == attribute ) {
		return undefined;
	}

	const sides = targetSides.length ? targetSides : paddingSides;
	const expandedAttribute = expand( attribute );
	const expandedDefaultValue = expand( defaultValue );
	const normalizedAttribute = Object.fromEntries(
		sides
			.map( ( side ) => [ side, expandedAttribute?.[ side ] ] )
			.filter( ( [ , value ] ) => null != value )
	);
	const values = Object.values( normalizedAttribute );
	const allEqual =
		sides.length === values.length &&
		values.every( ( v ) => v === values[ 0 ] );

	const compactedAttribute = allEqual ? values[ 0 ] : normalizedAttribute;

	if ( isObject( compactedAttribute ) && null != defaultValue ) {
		if ( compactedAttribute?.top === expandedDefaultValue?.top ) {
			compactedAttribute.top = undefined;
		}

		if ( compactedAttribute?.right === expandedDefaultValue?.right ) {
			compactedAttribute.right = undefined;
		}

		if ( compactedAttribute?.bottom === expandedDefaultValue?.bottom ) {
			compactedAttribute.bottom = undefined;
		}

		if ( compactedAttribute?.left === expandedDefaultValue?.left ) {
			compactedAttribute.left = undefined;
		}
	}

	const cleanedCompactedAttribute = cleanEmptyObject( compactedAttribute );

	if (
		JSON.stringify( cleanedCompactedAttribute ) ===
			JSON.stringify( defaultValue ) ||
		JSON.stringify( cleanedCompactedAttribute ) ===
			JSON.stringify( compacting( defaultValue, undefined, sides ) )
	) {
		return undefined;
	}

	return cleanedCompactedAttribute;
}

export function expand( attribute ) {
	return isObject( attribute )
		? {
				top: attribute?.top,
				right: attribute?.right,
				bottom: attribute?.bottom,
				left: attribute?.left,
		  }
		: {
				top: attribute,
				right: attribute,
				bottom: attribute,
				left: attribute,
		  };
}

export function PaddingEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const split = getBlockSupport( name, 'unitone.padding.split' ) || false;
	const isAllSides = true === split;
	const applyTop = Array.isArray( split ) && split?.includes( 'top' );
	const applyRight = Array.isArray( split ) && split?.includes( 'right' );
	const applyBottom = Array.isArray( split ) && split?.includes( 'bottom' );
	const applyLeft = Array.isArray( split ) && split?.includes( 'left' );
	const targetSides = getTargetSides( split );

	const compactedValue = compacting(
		unitone?.padding,
		defaultValue,
		targetSides
	);
	const compactedDefaultValue = compacting(
		defaultValue,
		undefined,
		targetSides
	);
	const expandedDefaultValue = expand( compactedDefaultValue );
	const displayedPadding = mergeObjectWithDefaultValue(
		expand( unitone?.padding ),
		expandedDefaultValue
	);

	const isMixed =
		isObject( compactedValue ) || isObject( compactedDefaultValue );

	const onChangePadding = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				padding: newValue || undefined,
			} ),
		} );
	};

	const onChangePaddingSide = ( side, newValue ) => {
		const newPadding = expand( unitone?.padding );

		newPadding[ side ] = newValue || expandedDefaultValue?.[ side ];

		// If the side you use is restricted, remove unnecessary values.
		if ( ! isAllSides ) {
			if ( ! applyTop ) {
				newPadding.top = undefined;
			}
			if ( ! applyRight ) {
				newPadding.right = undefined;
			}
			if ( ! applyBottom ) {
				newPadding.bottom = undefined;
			}
			if ( ! applyLeft ) {
				newPadding.left = undefined;
			}
		}

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				padding: compacting( newPadding, defaultValue, targetSides ),
			} ),
		} );
	};

	const sideControls = [];

	if ( isAllSides || applyTop ) {
		sideControls.push( {
			key: 'top',
			value: displayedPadding?.top,
			onChange: ( newValue ) => onChangePaddingSide( 'top', newValue ),
		} );
	}

	if ( isAllSides || applyRight ) {
		sideControls.push( {
			key: 'right',
			value: displayedPadding?.right,
			onChange: ( newValue ) => onChangePaddingSide( 'right', newValue ),
		} );
	}

	if ( isAllSides || applyBottom ) {
		sideControls.push( {
			key: 'bottom',
			value: displayedPadding?.bottom,
			onChange: ( newValue ) => onChangePaddingSide( 'bottom', newValue ),
		} );
	}

	if ( isAllSides || applyLeft ) {
		sideControls.push( {
			key: 'left',
			value: displayedPadding?.left,
			onChange: ( newValue ) => onChangePaddingSide( 'left', newValue ),
		} );
	}

	return (
		<PaddingControl
			label={ label }
			split={ !! split }
			isMixed={ isMixed }
			value={ compactedValue ?? compactedDefaultValue ?? defaultValue }
			onChange={ onChangePadding }
			sideControls={ sideControls }
		/>
	);
}

export function withPaddingBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isPaddingSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newPadding = compacting(
		mergeObjectWithDefaultValue(
			expand( attributes.unitone?.padding ),
			expand( defaultValue )
		)
	);

	if ( null == newPadding ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				...( isCustomSpacingSizeValue( newPadding )
					? { '--unitone--padding': getPresetCssVar( newPadding ) }
					: {} ),
				...( isCustomSpacingSizeValue( newPadding?.top )
					? {
							'--unitone--padding-top': getPresetCssVar(
								newPadding.top
							),
					  }
					: {} ),
				...( isCustomSpacingSizeValue( newPadding?.right )
					? {
							'--unitone--padding-right': getPresetCssVar(
								newPadding.right
							),
					  }
					: {} ),
				...( isCustomSpacingSizeValue( newPadding?.bottom )
					? {
							'--unitone--padding-bottom': getPresetCssVar(
								newPadding.bottom
							),
					  }
					: {} ),
				...( isCustomSpacingSizeValue( newPadding?.left )
					? {
							'--unitone--padding-left': getPresetCssVar(
								newPadding.left
							),
					  }
					: {} ),
			},
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-padding:${ newPadding }` ]:
						null != newPadding &&
						! isObject( newPadding ) &&
						! isCustomSpacingSizeValue( newPadding ),
					[ `-padding-top:${ newPadding?.top }` ]:
						null != newPadding?.top &&
						! isCustomSpacingSizeValue( newPadding.top ),
					[ `-padding-right:${ newPadding?.right }` ]:
						null != newPadding?.right &&
						! isCustomSpacingSizeValue( newPadding.right ),
					[ `-padding-bottom:${ newPadding?.bottom }` ]:
						null != newPadding?.bottom &&
						! isCustomSpacingSizeValue( newPadding.bottom ),
					[ `-padding-left:${ newPadding?.left }` ]:
						null != newPadding?.left &&
						! isCustomSpacingSizeValue( newPadding.left ),
				}
			),
		},
	};
}
