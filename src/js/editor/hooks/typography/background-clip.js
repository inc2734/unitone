import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasBackgroundClipValue( { attributes: { unitone } } ) {
	return unitone?.backgroundClip !== undefined;
}

export function resetBackgroundClipFilter( attributes ) {
	if ( null != attributes?.unitone?.backgroundClip ) {
		attributes.unitone.backgroundClip = undefined;
	}

	return cleanEmptyObject( attributes );
}

export function resetBackgroundClip( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetBackgroundClipFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsBackgroundClipDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.backgroundClip' );
}

export function getBackgroundClipEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Cut the background with text', 'unitone' );
	const defaultCode = <code>background-clip:text</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.backgroundClip?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.backgroundClip?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.backgroundClip?.code || defaultCode }
		</>
	);
}

export function BackgroundClipEdit( {
	label,
	help,
	attributes,
	setAttributes,
} ) {
	useEffect( () => {
		// @todo I would actually like to enable it when using gradients as well,
		// but for some reason the core uses `background` instead of `background-image` so I can't enable it.
		if ( ! attributes?.style?.background?.backgroundImage ) {
			const newUnitone = {
				...attributes?.unitone,
				backgroundClip: undefined,
			};

			setAttributes( {
				unitone: cleanEmptyObject( newUnitone ),
			} );
		}
	}, [ attributes?.style?.background?.backgroundImage ] );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			disabled={
				// @todo I would actually like to enable it when using gradients as well,
				// but for some reason the core uses `background` instead of `background-image` so I can't enable it.
				// ! attributes?.gradient &&
				// ! attributes?.style?.color?.gradient &&
				! attributes?.style?.background?.backgroundImage
			}
			checked={ attributes?.unitone?.backgroundClip ?? false }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...attributes?.unitone,
					backgroundClip: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function useBackgroundClipBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.backgroundClip' ) ) {
		return settings;
	}

	const newBackgroundClip = attributes?.unitone?.backgroundClip;

	if ( null == newBackgroundClip ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				'-background-clip'
			),
		},
	};
}
