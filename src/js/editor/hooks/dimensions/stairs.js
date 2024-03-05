import classnames from 'classnames/dedupe';

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

export function hasStairsValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairs;

	return null != defaultValue
		? attributes?.unitone?.stairs !== defaultValue
		: attributes?.unitone?.stairs !== undefined;
}

export function hasStairsUpValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairsUp;

	return null != defaultValue
		? attributes?.unitone?.stairsUp !== defaultValue
		: attributes?.unitone?.stairsUp !== undefined;
}

export function resetStairs( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.stairs;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairs;

	if ( null != defaultValue ) {
		newUnitone.stairsap = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function resetStairsUp( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.stairsUp;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.stairsUp;

	if ( null != defaultValue ) {
		newUnitone.stairsUp = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsStairsDisabled( props ) {
	const { name: blockName } = props;

	if ( ! hasBlockSupport( blockName, 'unitone.stairs' ) ) {
		return true;
	}

	const blockSupport = getBlockSupport( blockName, 'unitone.stairs' );
	if ( true === blockSupport ) {
		return false;
	}

	const className = props.attributes?.className;
	if ( !! className ) {
		return ! className.split( ' ' ).some( ( needle ) => {
			needle = needle.replace( 'is-style-', '' );
			return blockSupport.styles?.[ needle ];
		} );
	}

	return true;
}

export function getStairsEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.stairs?.label ||
		__( 'Stairs grid', 'unitone' )
	);
}

export function StairsEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairs;
	}, [] );

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.stairs }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					stairs: newValue || undefined,
				};
				if ( null == newUnitone.stairs ) {
					if ( null == defaultValue ) {
						delete newUnitone.stairs;
					} else {
						newUnitone.stairs = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
		/>
	);
}

export function getStairsUpEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.stairsUp?.label ||
		__( 'Stairs climbing direction', 'unitone' )
	);
}

export function StairsUpEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.stairsUp;
	}, [] );

	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			isBlock
			label={ label }
			value={ unitone?.stairsUp }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					stairsUp: newValue || undefined,
				};
				if ( null == newUnitone.stairsUp ) {
					if ( null == defaultValue ) {
						delete newUnitone.stairsUp;
					} else {
						newUnitone.stairsUp = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
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

export function saveStairsProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.stairs' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.stairs ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-stairs:${ attributes.unitone?.stairs }`,
		`-stairs-up:${ attributes.unitone?.stairsUp }`
	);

	return extraProps;
}

export function editStairsProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.stairs' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveStairsProp( props, settings, attributes );
	};
	return settings;
}
