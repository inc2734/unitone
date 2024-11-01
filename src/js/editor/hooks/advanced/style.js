import {
	Notice,
	TextareaControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { transformStyles } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function useIsStyleDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.style' );
}

// @see https://github.com/WordPress/gutenberg/pull/63656
// When useStyleOverride() becomes available, replace it with it.
export function StyleTag( { unitone } ) {
	if ( ! unitone?.style || ! unitone?.instanceId ) {
		return null;
	}

	let customCSS = unitone.style
		.replace( /\r?\n\s*/g, ' ' )
		.replace( /\s*\{\s*/g, ' { ' )
		.replace( /\s*;\s*/g, '; ' )
		.replace( /\s*\}\s*/g, ' }' )
		.replace( /\}\s*/g, '}\n' )
		.trim();

	const customCSSArray = customCSS.split( '\n' );
	customCSS = customCSSArray
		.filter( ( line ) => {
			return line.startsWith( '&' );
		} )
		.join( '\n' );

	customCSS = customCSS.replace(
		/(&)(?=[^{]*\{)/g,
		`[data-unitone-instance-id="${ unitone.instanceId }"]`
	);

	return <style>{ customCSS }</style>;
}

// @see https://github.com/WordPress/gutenberg/blob/a55c62c5c810c84258afcdac7da1a7019a69b332/packages/block-editor/src/components/global-styles/advanced-panel.js
export function StyleEdit( { unitone, setAttributes, clientId } ) {
	const [ cssError, setCSSError ] = useState( null );
	const [ instanceId, setInstanceId ] = useState( clientId );

	useEffect( () => {
		setInstanceId( clientId );
	}, [ clientId ] );

	function handleOnChange( newValue ) {
		let customCSS = newValue ?? undefined;

		if ( !! customCSS ) {
			const dummy = document.createElement( 'div' );
			dummy.innerHTML = customCSS;
			customCSS = dummy.innerText;
		}

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				style: customCSS || undefined,
				instanceId: !! customCSS ? instanceId : undefined,
			} ),
		} );

		if ( ! customCSS ) {
			return;
		}

		if ( cssError ) {
			// Check if the new value is valid CSS, and pass a wrapping selector
			// to ensure that `transformStyles` validates the CSS. Note that the
			// wrapping selector here is not used in the actual output of any styles.
			const [ transformed ] = transformStyles(
				[ { css: newValue } ],
				'.for-validation-only'
			);
			if ( transformed ) {
				setCSSError( null );
			}
		}
	}

	function handleOnBlur( event ) {
		let customCSS = event?.target?.value?.trim();
		if ( !! customCSS ) {
			customCSS = customCSS.replace( / +/g, ' ' );
			customCSS = customCSS.replace( /\n &/g, '\n&' );
		}

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				style: customCSS || undefined,
				instanceId: !! customCSS ? instanceId : undefined,
			} ),
		} );

		if ( ! customCSS ) {
			setCSSError( null );
			return;
		}

		// Check if the new value is valid CSS, and pass a wrapping selector
		// to ensure that `transformStyles` validates the CSS. Note that the
		// wrapping selector here is not used in the actual output of any styles.
		const [ transformed ] = transformStyles(
			[ { css: customCSS } ],
			'.for-validation-only'
		);

		setCSSError(
			transformed === null
				? __( 'There is an error with your CSS structure.' )
				: null
		);
	}

	return (
		<VStack spacing={ 3 }>
			{ cssError && (
				<Notice status="error" onRemove={ () => setCSSError( null ) }>
					{ cssError }
				</Notice>
			) }

			<TextareaControl
				__nextHasNoMarginBottom
				label={ __( 'Additional CSS' ) }
				help={ `${ __(
					'Add your own CSS to customize the appearance of this block.',
					'unitone'
				) } ${ __(
					'Using "&" as a selector acts as a unique selector that applies only to this block.',
					'unitone'
				) } ${ __(
					'Selectors and CSS beginning with anything other than "&" are ignored.',
					'unitone'
				) }` }
				value={ unitone?.style ?? undefined }
				onChange={ handleOnChange }
				onBlur={ handleOnBlur }
				className="block-editor-global-styles-advanced-panel__custom-css-input"
				spellCheck={ false }
				rows={ 6 }
			/>
		</VStack>
	);
}

export function saveStyleProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.style' ) ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-instance-id' ] = attributes?.unitone?.instanceId;

	return extraProps;
}

export function useStyleBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	// useStyleOverride( { css: attributes?.unitone?.style } );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveStyleProp( wrapperProps, name, attributes ),
		},
	};
}
