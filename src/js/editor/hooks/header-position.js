import classnames from 'classnames';

import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function getHeaderPositionFromClassName( { attributes } ) {
	const headerPositionFromClassName = attributes?.className || '';
	return (
		headerPositionFromClassName
			.split( ' ' )
			.map( ( _className ) => {
				return _className.match( /-header-position:([^ ]+)/ )?.[ 1 ];
			} )
			.filter( ( _ ) => _ )?.[ 0 ] || ''
	);
}

export function useIsHeaderPositionDisabled( {
	name: blockName,
	attributes,
} = {} ) {
	return 'core/template-part' !== blockName || 'header' !== attributes.slug;
}

export function HeaderPositionEdit( props ) {
	const { attributes, setAttributes } = props;

	return (
		<SelectControl
			label={ __( 'Position', 'unitone' ) }
			options={ [
				{ label: __( 'Default', 'unitone' ), value: '' },
				{ label: __( 'Overlay', 'unitone' ), value: 'overlay' },
				{ label: __( 'Fixed', 'unitone' ), value: 'fixed' },
			] }
			value={ getHeaderPositionFromClassName( props ) }
			onChange={ ( newValue ) => {
				let newClassName = attributes?.className || '';
				newClassName = newClassName
					.split( ' ' )
					.filter( ( _className ) => {
						return ! _className.match( /-header-position:/ );
					} );

				setAttributes( {
					className: classnames( newClassName, {
						[ `-header-position:${ newValue }` ]: !! newValue,
					} ),
				} );
			} }
		/>
	);
}
