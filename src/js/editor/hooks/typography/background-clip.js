import clsx from 'clsx';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { HelpContainer } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasBackgroundClipValue( { attributes: { unitone } } ) {
	return unitone?.backgroundClip !== undefined;
}

export function resetBackgroundClipFilter() {
	return {
		backgroundClip: undefined,
	};
}

export function resetBackgroundClip( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetBackgroundClipFilter() )
		),
	} );
}

export function isBackgroundClipSupportDisabled( { name } ) {
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
		if (
			! attributes?.gradient &&
			! attributes?.style?.color?.gradient &&
			! attributes?.style?.background?.backgroundImage
		) {
			const newUnitone = {
				...attributes?.unitone,
				backgroundClip: undefined,
			};

			setAttributes( {
				unitone: cleanEmptyObject( newUnitone ),
			} );
		}
	}, [
		attributes?.gradient,
		attributes?.style?.color?.gradient,
		attributes?.style?.background?.backgroundImage,
	] );

	return (
		<HelpContainer help={ help } layout="horizontal">
			<ToggleControl
				__nextHasNoMarginBottom
				label={ label }
				disabled={
					! attributes?.gradient &&
					! attributes?.style?.color?.gradient &&
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
		</HelpContainer>
	);
}

export function withBackgroundClipBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isBackgroundClipSupportDisabled( { name } ) ) {
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
