import classnames from 'classnames';

import { SelectControl, TextControl } from '@wordpress/components';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasPositionValue( { name, unitone } ) {
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

export function resetPosition( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetPositionFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsPositionDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.position' );
}

export function PositionEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<SelectControl
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
			value={ unitone?.position?.position ?? defaultValue.position ?? '' }
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

export function hasTopValue( { name, unitone } ) {
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

export function resetTop( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetTopFilter( { unitone } )?.unitone ),
	} );
}

export function TopEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
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

export function hasRightValue( { name, unitone } ) {
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

export function resetRight( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetRightFilter( { unitone } )?.unitone ),
	} );
}

export function RightEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
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

export function hasBottomValue( { name, unitone } ) {
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

export function resetBottom( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetBottomFilter( { unitone } )?.unitone ),
	} );
}

export function BottomEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
			label={ label }
			value={ unitone?.position?.bottom ?? defaultValue.bottom ?? '' }
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

export function hasLeftValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.left !== unitone?.position?.left &&
		undefined !== unitone?.position?.left
	);
}

export function resetLeftValueFilter( attributes ) {
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

export function resetLeft( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetLeftValueFilter( { unitone } )?.unitone
		),
	} );
}

export function LeftEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
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

export function hasZIndexValue( { name, unitone } ) {
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

export function resetZIndex( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetZIndexFilter( { unitone } )?.unitone ),
	} );
}

export function ZIndexEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<TextControl
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

export function savePositionProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.position;

	if ( ! hasBlockSupport( blockType, 'unitone.position' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.position ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				position: {
					...attributes?.unitone?.position,
					...defaultValue,
				},
			},
		};
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--top': attributes?.unitone?.position?.top,
		'--unitone--right': attributes?.unitone?.position?.right,
		'--unitone--bottom': attributes?.unitone?.position?.bottom,
		'--unitone--left': attributes?.unitone?.position?.left,
		'--unitone--z-index': attributes?.unitone?.position?.zIndex,
	};

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-position:${ attributes?.unitone?.position?.position }` ]:
				!! attributes?.unitone?.position?.position,
		}
	);

	return extraProps;
}

export function usePositionBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...savePositionProp( wrapperProps, name, attributes ),
		},
	};
}
