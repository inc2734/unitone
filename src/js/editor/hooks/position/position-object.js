import clsx from 'clsx';

import { SelectControl, TextControl } from '@wordpress/components';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import { cleanEmptyObject } from '../utils';

export function hasPositionValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.position;

	return (
		defaultValue?.position !== unitone?.position?.position &&
		undefined !== unitone?.position?.position
	);
}

function resetPositionFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.position ) {
		attributes.unitone.position.position = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

function resetTopFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.top ) {
		attributes.unitone.position.top = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

function resetRightFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.right ) {
		attributes.unitone.position.right = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

function resetBottomFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.bottom ) {
		attributes.unitone.position.bottom = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

function resetLeftFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.left ) {
		attributes.unitone.position.left = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

function resetZIndexFilter( attributes ) {
	if ( null != attributes?.unitone?.position?.zIndex ) {
		attributes.unitone.position.zIndex = undefined;
	}

	return attributes;
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
			__next40pxDefaultSize
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

export function usePositionBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.position;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.position' ) ) {
		return settings;
	}

	const newPosition = attributes?.unitone?.position ?? defaultValue;

	if ( null == newPosition ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--top': newPosition?.top,
				'--unitone--right': newPosition?.right,
				'--unitone--bottom': newPosition?.bottom,
				'--unitone--left': newPosition?.left,
				'--unitone--z-index': newPosition?.zIndex,
			},
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-position:${ newPosition?.position }` ]:
						!! newPosition?.position,
				}
			),
		},
	};
}
