import clsx from 'clsx';

import { SelectControl, TextControl } from '@wordpress/components';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

import { cleanEmptyObject } from '../utils';

export function hasPositionValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.position !== unitone?.position?.position &&
		undefined !== unitone?.position?.position
	);
}

export function resetPositionFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				position: undefined,
			},
		},
	};
}

export function resetPosition( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetPositionFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsPositionDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.position' );
}

export function PositionEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<SelectControl
			__nextHasNoMarginBottom
			label={ label }
			options={ [
				{ label: '', value: '' },
				{
					label: 'static',
					value: 'static',
				},
				{
					label: 'relative',
					value: 'relative',
				},
				{
					label: 'absolute',
					value: 'absolute',
				},
				{ label: 'fixed', value: 'fixed' },
				{
					label: 'sticky',
					value: 'sticky',
				},
			] }
			value={
				unitone?.position?.position ?? defaultValue?.position ?? ''
			}
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						position: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function hasTopValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.top !== unitone?.position?.top &&
		undefined !== unitone?.position?.top
	);
}

export function resetTopFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				top: undefined,
			},
		},
	};
}

export function resetTop( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetTopFilter( { unitone } )?.unitone ),
	} );
}

export function TopEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.position?.top ?? defaultValue?.top ?? '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						top: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function hasRightValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.right !== unitone?.position?.right &&
		undefined !== unitone?.position?.right
	);
}

export function resetRightFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				right: undefined,
			},
		},
	};
}

export function resetRight( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetRightFilter( { unitone } )?.unitone ),
	} );
}

export function RightEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={
				unitone?.position?.right ?? defaultValue?.position?.right ?? ''
			}
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						right: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function hasBottomValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.bottom !== unitone?.position?.bottom &&
		undefined !== unitone?.position?.bottom
	);
}

export function resetBottomFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				bottom: undefined,
			},
		},
	};
}

export function resetBottom( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetBottomFilter( { unitone } )?.unitone ),
	} );
}

export function BottomEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.position?.bottom ?? defaultValue?.bottom ?? '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						bottom: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function hasLeftValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.left !== unitone?.position?.left &&
		undefined !== unitone?.position?.left
	);
}

export function resetLeftFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				left: undefined,
			},
		},
	};
}

export function resetLeft( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetLeftFilter( { unitone } )?.unitone ),
	} );
}

export function LeftEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.position?.left ?? defaultValue?.left ?? '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						left: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function hasZIndexValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.zIndex !== unitone?.position?.zIndex &&
		undefined !== unitone?.position?.zIndex
	);
}

export function resetZIndexFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			position: {
				...attributes?.unitone?.position,
				zIndex: undefined,
			},
		},
	};
}

export function resetZIndex( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetZIndexFilter( { unitone } )?.unitone ),
	} );
}

export function ZIndexEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.position?.zIndex ?? defaultValue?.zIndex ?? '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					position: {
						...unitone?.position,
						zIndex: newAttribute || undefined,
					},
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const newExtraProps = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.position' ) ) {
			return {
				style: { ...extraProps?.style },
				'data-unitone-layout': extraProps?.[ 'data-unitone-layout' ],
			};
		}

		if ( null == attributes?.unitone?.position ) {
			return {
				style: { ...extraProps?.style },
				'data-unitone-layout': extraProps?.[ 'data-unitone-layout' ],
			};
		}

		return {
			style: {
				...extraProps?.style,
				'--unitone--top': attributes?.unitone?.position?.top,
				'--unitone--right': attributes?.unitone?.position?.right,
				'--unitone--bottom': attributes?.unitone?.position?.bottom,
				'--unitone--left': attributes?.unitone?.position?.left,
				'--unitone--z-index': attributes?.unitone?.position?.zIndex,
			},
			'data-unitone-layout': clsx(
				extraProps?.[ 'data-unitone-layout' ],
				{
					[ `-position:${ attributes?.unitone?.position?.position }` ]:
						!! attributes?.unitone?.position?.position,
				}
			),
		};
	}, [
		blockType,
		extraProps?.style,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.position?.top,
		attributes?.unitone?.position?.right,
		attributes?.unitone?.position?.bottom,
		attributes?.unitone?.position?.left,
		attributes?.unitone?.position?.zIndex,
		attributes?.unitone?.position?.position,
	] );

	return {
		...extraProps,
		...newExtraProps,
	};
}

export function usePositionBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.position;
		},
		[ name ]
	);

	const newPositionProp = useBlockProps( wrapperProps, name, {
		unitone: {
			position: attributes?.unitone?.position ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newPositionProp,
		},
	};
}
