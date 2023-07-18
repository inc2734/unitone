import {
	SelectControl,
	RangeControl,
	BaseControl,
	ToggleControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export function SpacingSizeControl( {
	options,
	onChange,
	label,
	value,
	allowRoot = false,
} ) {
	const defaultOptions = [
		{
			label: '',
			value: undefined,
		},
		{
			label: '-2',
			value: '-2',
		},
		{
			label: '-1',
			value: '-1',
		},
		{
			label: '0',
			value: '0',
		},
		{
			label: '1',
			value: '1',
		},
		{
			label: '2',
			value: '2',
		},
		{
			label: '3',
			value: '3',
		},
		{
			label: '4',
			value: '4',
		},
		{
			label: '5',
			value: '5',
		},
		{
			label: '6',
			value: '6',
		},
		{
			label: '7',
			value: '7',
		},
	];

	options = ! options ? defaultOptions : options;

	const marks = options.map( ( newValue ) => ( {
		value: !! newValue?.value
			? parseInt( newValue?.value )
			: newValue?.value,
		label: undefined,
	} ) );

	return (
		<BaseControl
			id={ label }
			label={ label }
			className="spacing-sizes-control"
		>
			{ allowRoot && (
				<div style={ { marginTop: '12px' } }>
					<ToggleControl
						label={ __( 'Using root padding', 'unitone' ) }
						checked={ 'root' === value }
						onChange={ ( newValue ) => {
							onChange( newValue ? 'root' : undefined );
						} }
					/>
				</div>
			) }

			{ 'root' !== value && (
				<>
					<RangeControl
						className="spacing-sizes-control__range-control"
						value={ parseInt( value ) }
						allowReset={ true }
						resetFallbackValue={ undefined }
						onChange={ onChange }
						withInputField={ false }
						aria-valuenow={ value }
						aria-valuetext={ value }
						min={ options[ 0 ]?.value || options[ 1 ]?.value }
						max={ options[ options.length - 1 ]?.value }
						marks={ marks }
						hideLabelFromVision={ true }
					/>

					<div style={ { marginTop: '5px' } }>
						<SelectControl
							value={ value || '' }
							options={ options }
							onChange={ onChange }
						/>
					</div>
				</>
			) }
		</BaseControl>
	);
}
