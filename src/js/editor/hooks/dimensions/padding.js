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

import { PaddingControl } from '../components';
import { cleanEmptyObject, isObject } from '../utils';

export function hasPaddingValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

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
	const defaultCode = <code>padding</code>;

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

export function compacting( attribute, defaultValue = undefined ) {
	if ( 0 === attribute ) {
		return 0;
	}

	if ( null == attribute ) {
		return undefined;
	}

	const values = Object.values( attribute );
	const allEqual =
		4 === values.length && values.every( ( v ) => v === values[ 0 ] );

	const compactedAttribute = allEqual ? values[ 0 ] : attribute;

	if ( isObject( compactedAttribute ) && null != defaultValue ) {
		if ( compactedAttribute?.top === defaultValue?.top ) {
			compactedAttribute.top = undefined;
		}

		if ( compactedAttribute?.right === defaultValue?.right ) {
			compactedAttribute.right = undefined;
		}

		if ( compactedAttribute?.bottom === defaultValue?.bottom ) {
			compactedAttribute.bottom = undefined;
		}

		if ( compactedAttribute?.left === defaultValue?.left ) {
			compactedAttribute.left = undefined;
		}
	}

	if (
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( defaultValue ) ||
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( compacting( defaultValue ) )
	) {
		return undefined;
	}

	return compactedAttribute;
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
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.padding;
	}, [] );

	const split = getBlockSupport( name, 'unitone.padding.split' ) || false;
	const isAllSides = true === split;
	const applyTop = Array.isArray( split ) && split?.includes( 'top' );
	const applyRight = Array.isArray( split ) && split?.includes( 'right' );
	const applyBottom = Array.isArray( split ) && split?.includes( 'bottom' );
	const applyLeft = Array.isArray( split ) && split?.includes( 'left' );

	const compactedValue = compacting( unitone?.padding, defaultValue );
	const compactedDefaultValue = compacting( defaultValue );

	const isMixed =
		isObject( compactedValue ) || isObject( compactedDefaultValue );

	const onChangePadding = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const newUnitone = {
			...unitone,
			padding: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangePaddingSide = ( side, newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactedDefault = compacting( defaultValue );
		const expandedDefault = expand( compactedDefault );
		const newPadding = expand( unitone?.padding );

		newPadding[ side ] = newValue || expandedDefault?.[ side ];

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
				padding: compacting( newPadding, defaultValue ),
			} ),
		} );
	};

	const sideControls = [];

	if ( isAllSides || applyTop ) {
		sideControls.push( {
			key: 'top',
			value:
				unitone?.padding?.top ??
				unitone?.padding ??
				defaultValue?.top ??
				defaultValue,
			onChange: ( newValue ) => onChangePaddingSide( 'top', newValue ),
		} );
	}

	if ( isAllSides || applyRight ) {
		sideControls.push( {
			key: 'right',
			value:
				unitone?.padding?.right ??
				unitone?.padding ??
				defaultValue?.right ??
				defaultValue,
			onChange: ( newValue ) => onChangePaddingSide( 'right', newValue ),
		} );
	}

	if ( isAllSides || applyBottom ) {
		sideControls.push( {
			key: 'bottom',
			value:
				unitone?.padding?.bottom ??
				unitone?.padding ??
				defaultValue?.bottom ??
				defaultValue,
			onChange: ( newValue ) => onChangePaddingSide( 'bottom', newValue ),
		} );
	}

	if ( isAllSides || applyLeft ) {
		sideControls.push( {
			key: 'left',
			value:
				unitone?.padding?.left ??
				unitone?.padding ??
				defaultValue?.left ??
				defaultValue,
			onChange: ( newValue ) => onChangePaddingSide( 'left', newValue ),
		} );
	}

	return (
		<PaddingControl
			label={ label }
			split={ !! split }
			isMixed={ isMixed }
			value={ unitone?.padding ?? defaultValue }
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

	const newPadding = compacting( attributes.unitone?.padding );

	if ( null == newPadding ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-padding:${ newPadding }` ]:
						null != newPadding && ! isObject( newPadding ),
					[ `-padding-top:${ newPadding?.top }` ]:
						null != newPadding?.top,
					[ `-padding-right:${ newPadding?.right }` ]:
						null != newPadding?.right,
					[ `-padding-bottom:${ newPadding?.bottom }` ]:
						null != newPadding?.bottom,
					[ `-padding-left:${ newPadding?.left }` ]:
						null != newPadding?.left,
				}
			),
		},
	};
}
