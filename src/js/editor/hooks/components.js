import {
	SelectControl,
	RangeControl,
	BaseControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { isNumber } from './utils';

function Controls( { isMixed, value, onChange, marks, options } ) {
	return (
		<>
			<RangeControl
				className="spacing-sizes-control__range-control"
				value={ isMixed ? -2 : parseInt( value ) }
				allowReset
				resetFallbackValue={ undefined }
				onChange={ onChange }
				withInputField={ false }
				aria-valuenow={ value }
				aria-valuetext={ value }
				min={ marks[ 0 ]?.value || marks[ 1 ]?.value }
				max={ marks[ marks.length - 1 ]?.value }
				marks={ marks }
				renderTooltipContent={ ( _value ) =>
					options.filter(
						( option ) =>
							parseInt( option.value ) === parseInt( _value )
					)?.[ 0 ]?.label ?? _value
				}
				hideLabelFromVision
				__nextHasNoMarginBottom
			/>

			<div style={ { marginTop: '5px' } }>
				<SelectControl
					value={ value || '' }
					options={ options }
					onChange={ onChange }
				/>
			</div>
		</>
	);
}

export function SpacingSizeControl( {
	options,
	onChange,
	label,
	value,
	isMixed = false,
} ) {
	value = isMixed ? 'mixed' : value;
	const defaultOptions = [
		{
			label: '',
			value: undefined,
		},
		{
			label: 'XS',
			value: -2,
		},
		{
			label: 'S',
			value: -1,
		},
		{
			label: __( 'None', 'unitone' ),
			value: 0,
		},
		{
			label: 'M',
			value: 1,
		},
		{
			label: 'L',
			value: 2,
		},
		{
			label: '2XL',
			value: 3,
		},
		{
			label: '3XL',
			value: 4,
		},
		{
			label: '4XL',
			value: 5,
		},
		{
			label: '5XL',
			value: 6,
		},
		{
			label: '6XL',
			value: 7,
		},
	];

	options = ! options ? defaultOptions : options;

	if ( isMixed ) {
		options.unshift( {
			label: __( 'Mixed' ),
			value: 'mixed',
			disabled: true,
		} );
	}

	const marks = options
		.map( ( newValue ) => {
			return isNumber( newValue?.value )
				? {
						value: parseInt( newValue?.value ),
						label: undefined,
				  }
				: undefined;
		} )
		.filter( Boolean );

	return (
		<>
			{ !! label ? (
				<BaseControl
					id={ label }
					label={ label }
					className="spacing-sizes-control"
				>
					<Controls
						{ ...{ isMixed, value, onChange, marks, options } }
					/>
				</BaseControl>
			) : (
				<div className="spacing-sizes-control">
					<Controls
						{ ...{ isMixed, value, onChange, marks, options } }
					/>
				</div>
			) }
		</>
	);
}
