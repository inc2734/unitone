import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasStairsValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairs;

	return defaultValue !== unitone?.stairs && undefined !== unitone?.stairs;
}

export function hasStairsUpValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairsUp;

	return (
		defaultValue !== unitone?.stairsUp && undefined !== unitone?.stairsUp
	);
}

export function resetStairsFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			stairs: undefined,
		},
	};
}

export function resetStairs( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetStairsFilter( { unitone } )?.unitone ),
	} );
}

export function resetStairsUpFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			stairsUp: undefined,
		},
	};
}

export function resetStairsUp( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetStairsUpFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsStairsDisabled( { name } ) {
	if ( ! hasBlockSupport( name, 'unitone.stairs' ) ) {
		return true;
	}

	const blockSupport = getBlockSupport( name, 'unitone.stairs' );
	if ( true === blockSupport ) {
		return false;
	}

	return true;
}

export function getStairsEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.stairs?.label ||
		__( 'Stairs grid', 'unitone' )
	);
}

export function StairsEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairs;
	}, [] );

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.stairs ?? defaultValue }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					stairs:
						newValue || ( null == defaultValue ? undefined : '' ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function getStairsUpEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.stairsUp?.label ||
		__( 'Stairs climbing direction', 'unitone' )
	);
}

export function StairsUpEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairsUp;
	}, [] );

	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			isBlock
			label={ label }
			value={ unitone?.stairsUp ?? defaultValue }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					stairsUp: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		>
			<ToggleGroupControlOption
				label={ __( 'Left', 'unitone' ) }
				value="left"
			/>

			<ToggleGroupControlOption
				label={ __( 'Right', 'unitone' ) }
				value="right"
			/>
		</ToggleGroupControl>
	);
}

export function useStairsBlockProps( settings ) {
	const { attributes, name } = settings;

	const { defaultStairs, defaultStairsUp } = useSelect(
		( select ) => {
			const blockTypeAttributes =
				select( blocksStore ).getBlockType( name )?.attributes;

			return {
				defaultStairs: blockTypeAttributes?.unitone?.default?.stairs,
				defaultStairsUp:
					blockTypeAttributes?.unitone?.default?.stairsUp,
			};
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.stairs' ) ) {
		return settings;
	}

	const newStairs = {
		stairs: attributes?.unitone?.stairs ?? defaultStairs,
		stairsUp: attributes?.unitone?.stairsUp ?? defaultStairsUp,
	};

	if ( null == newStairs?.stairs && null == newStairs?.stairsUp ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-stairs:${ newStairs?.stairs }` ]: !! newStairs?.stairs,
					[ `-stairs-up:${ newStairs?.stairsUp }` ]:
						!! newStairs?.stairsUp,
				}
			),
		},
	};
}
